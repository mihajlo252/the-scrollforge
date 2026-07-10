import { createLazyFileRoute } from "@tanstack/react-router";
import { supabase } from "../supabase/supabase";
import { useEffect, useRef, useState } from "react";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { toast } from "../utilities/toasterSonner";
import { Frame } from "../components/Frame/Frame";
import { motion } from "framer-motion";
import { Popup } from "../components/Popup/Popup";
import { Icon } from "../components/Primitives";
import styles from "./chat.module.css";

export const Route = createLazyFileRoute("/chat")({
	component: Chat,
});

interface IMessage {
	content: string;
	created_at: string;
	id: string;
	user_id: string;
	username: string;
}

interface Room {
	created_at: string;
	creator: string;
	id: string;
	name: string;
}

function Chat() {
	const userID = JSON.parse(getUserFromLocal()!).user.id;
	const username = JSON.parse(getUserFromLocal()!).user.user_metadata.username;
	const [newMessage, setNewMessage] = useState("");
	const [messages, setMessages] = useState<IMessage[]>([] as IMessage[]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [activeUsers, setActiveUsers] = useState<string[]>([]);
	const [seeActiveUsers, setSeeActiveUsers] = useState(false);
	const [chatRoom, setChatRoom] = useState<string>("");
	const [myRooms, setMyRooms] = useState<Room[]>([] as Room[]);
	const [newRoomName, setNewRoomName] = useState("");
	const [openCreateParty, setOpenCreateParty] = useState(false);

	const [allParties, setAllParties] = useState<Room[]>([] as Room[]);
	const [openAllParties, setOpenAllParties] = useState(false);

	const sendMessage = async (e: any) => {
		e.preventDefault();
		if (chatRoom === "") {
			toast({ style: "bg-error text-base-100", message: "Please select a chat room" });
			return;
		}
		if (e.target[0].value === "") {
			toast({ style: "bg-error text-base-100", message: "Please enter a message" });
			return;
		}
		const { error } = await supabase.from("messages").insert({ content: e.target[0].value, user_id: userID, username, chatRoom });
		setNewMessage("");

		if (error) console.error("Error sending message:", error);
	};

	const handleSetNewMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setNewMessage(e.target.value);
	};

	const handleGetMessages = async () => {
		const { data, error } = await supabase
			.from("messages")
			.select("*")
			.eq("chatRoom", chatRoom)
			.order("created_at", { ascending: true })
			.limit(50);

		if (error) {
			console.error("Error fetching messages", error);
			return;
		}

		if (!data || !Array.isArray(data)) {
			setMessages([]);
			return;
		}

		setMessages(data as IMessage[]);
	};

	const lastMessageRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (messages.length) {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
		}
	}, [messages.length]);

	const handleCreateRoom = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newRoomName === "") {
			toast({ style: "bg-error text-base-100", message: "Please enter a room name" });
			return;
		}
		setIsSubmitting(true);
		const { error } = await supabase.from("parties").insert({ name: newRoomName, creator: userID });
		if (error) {
			toast({ style: "bg-error text-base-100", message: "Error creating room:" + error });
			return;
		} else {
			toast({ style: "bg-success text-base-100", message: "Room created!" });
			setOpenCreateParty(false);
			setIsSubmitting(false);
			await handleGetParties();
		}
	};

	const handleGetMyPartiesID = async () => {
		const { data } = await supabase.from("partyProfiles").select("*").eq("memberID", userID);
		if (!data) {
			toast({ style: "bg-error text-base-100", message: "You are not in any parties." });
			return;
		}
		return data.map((d: { partyID: string }) => d.partyID);
	};

	const handleGetParties = async () => {
		const myPartiesID: string[] | undefined = await handleGetMyPartiesID();
		if (!myPartiesID) return;
		const { data } = await supabase
			.from("parties")
			.select("*")
			.in("id", [...myPartiesID]);
		if (!data) {
			toast({ style: "bg-error text-base-100", message: "You are not in any parties." });
			return;
		}
		setMyRooms(data.map((d: any) => d));
	};

	const handleGetAllParties = async () => {
		setOpenAllParties(true);
		const { data } = await supabase.from("parties").select("*");
		if (!data) {
			toast({ style: "bg-error text-base-100", message: "There are no parties." });
			return;
		}
		setAllParties(data.map((d: any) => d));

		setChatRoom(data[0].id);
	};

	const handleJoinParty = async (id: string) => {
		const { error } = await supabase.from("partyProfiles").insert({ memberID: userID, partyID: id });
		if (error) {
			toast({ style: "bg-error text-base-100", message: "Error joining party:" + error });
			return;
		} else {
			toast({ style: "bg-success text-base-100", message: "Joined party!" });
			await handleGetParties();
			setOpenAllParties(false);
		}
	};

	useEffect(() => {
		handleGetParties();
	}, []);

	useEffect(() => {
		if (!chatRoom) return;
		setMessages([]);
		const subscription = supabase.channel(chatRoom);
		subscription
			.on("presence", { event: "join" }, ({ newPresences }) => {
				setActiveUsers((prev) => [...prev, newPresences[0].user]);
				if (newPresences[0].user !== username) {
					toast({ style: "bg-success text-base-100", message: `${newPresences[0].user} joined the chat` });
				}
			})
			.on("presence", { event: "leave" }, ({ leftPresences }) => {
				setActiveUsers((prev) => prev.filter((user) => user !== leftPresences[0].user));
				if (leftPresences[0].user !== username) {
					toast({ style: "bg-error text-base-100", message: `${leftPresences[0].user} left the chat` });
				}
			})
			.on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
				setMessages((prev) => [...prev, payload.new as IMessage]);
			})
			.on("postgres_changes", { event: "DELETE", schema: "public", table: "messages" }, (payload) => {
				setMessages((prev) => prev.filter((message) => message.id !== payload.old.id));
			})
			.subscribe(async (status) => {
				if (status !== "SUBSCRIBED") {
					return;
				}
				await handleGetMessages();
			});
		subscription.track({ user: username, online_at: new Date().toISOString() });
		return () => {
			supabase.removeChannel(subscription);
			setActiveUsers([]);
		};
	}, [chatRoom]);

	const activeRoomName = myRooms.find((room) => room.id === chatRoom)?.name;

	return (
		<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.page}>
			<div className={styles.chatGrid}>
				{/* Parties rail */}
				<Frame classes={styles.rooms}>
					<div className="card-hdr">
						<div className="card-title">Parties</div>
						<span className="mono" style={{ fontSize: 12, color: "var(--ink-dim)" }}>{myRooms.length}</span>
					</div>
					<div className={styles.roomList}>
						{myRooms.length === 0 && <div className={styles.empty}>No parties yet — create or join one.</div>}
						{myRooms.map((room) => (
							<button
								key={room.id}
								type="button"
								className={styles.roomBtn}
								data-active={chatRoom === room.id ? "" : undefined}
								onClick={() => setChatRoom(room.id)}
							>
								<Icon name="user" size={14} />
								<span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
									{room.name}
								</span>
							</button>
						))}
					</div>
					<div className={styles.roomActions}>
						<button type="button" className="button button-ghost short" onClick={() => handleGetAllParties()}>
							<Icon name="search" size={13} /> Join Party
						</button>
						<button type="button" className="button button-primary short" onClick={() => setOpenCreateParty(true)}>
							<Icon name="plus" size={13} /> Create Party
						</button>
					</div>
				</Frame>

				{/* Chat column */}
				<Frame classes={styles.chatMain}>
					<div className="card-hdr">
						<div className={styles.chatHeaderName}>
							{chatRoom && <span className={styles.online} />}
							<div className="card-title">{activeRoomName ?? "Select a party"}</div>
						</div>
						<button
							type="button"
							className="button button-ghost short"
							onClick={() => setSeeActiveUsers(true)}
							disabled={!chatRoom}
						>
							<Icon name="user" size={13} /> Active{activeUsers.length ? ` · ${activeUsers.length}` : ""}
						</button>
					</div>

					<div className={styles.messages}>
						{!chatRoom ? (
							<div className={styles.placeholder}>Select a party from the left to start chatting.</div>
						) : (
							<>
								<div className={styles.sysMsg}>
									<div className={styles.sysLabel}>System message</div>
									<div className={styles.sysWelcome}>Welcome to {activeRoomName}</div>
								</div>
								{messages.map((message, index) => {
									const own = message.user_id === userID;
									return (
										<div key={index} className={`${styles.msgRow} ${own ? styles.own : ""}`}>
											<div className={styles.msgMeta}>
												<span className={styles.msgName}>{message.username}</span>
												{own && <span className={styles.msgMe}>(Me)</span>}
												<span className={styles.msgTime}>
													{new Date(message.created_at).toLocaleTimeString("en-US", {
														hour: "2-digit",
														minute: "2-digit",
														hour12: false,
													})}
												</span>
											</div>
											<div className={styles.bubble}>{message.content}</div>
										</div>
									);
								})}
								<div ref={lastMessageRef} />
							</>
						)}
					</div>

					<form onSubmit={sendMessage} className={styles.composer}>
						<input
							type="text"
							value={newMessage}
							onChange={handleSetNewMessage}
							placeholder={chatRoom ? "Type a message…" : "Select a party first…"}
							className={`input ${styles.composerInput}`}
							disabled={!chatRoom}
						/>
						<button type="submit" className="button button-primary short" disabled={!chatRoom}>
							<Icon name="fwd" size={14} /> Send
						</button>
					</form>
				</Frame>
			</div>

			<Popup closerFunc={setSeeActiveUsers} toggle={seeActiveUsers}>
				<Frame classes={styles.popupCard}>
					<div className={styles.popupHeader}>
						<h3 className="card-title">Active Members</h3>
						<button type="button" className="button button-secondary short" onClick={() => setSeeActiveUsers(false)}>
							Close
						</button>
					</div>
					<div className={styles.userList}>
						{activeUsers.length === 0 && <div className={styles.empty}>No one is online right now.</div>}
						{activeUsers.map((user, index) => (
							<div key={index} className={styles.userRow}>
								<span className={styles.online} />
								{user}
							</div>
						))}
					</div>
				</Frame>
			</Popup>

			<Popup closerFunc={setOpenCreateParty} toggle={openCreateParty}>
				<form onSubmit={handleCreateRoom}>
					<Frame classes={styles.popupCard}>
						<h3 className="card-title">Name Your Party</h3>
						<input
							type="text"
							placeholder="Party name"
							id="roomNameID"
							value={newRoomName}
							onChange={(e) => setNewRoomName(e.target.value)}
							className="input"
						/>
						<div className={styles.formRow}>
							<button type="submit" className="button button-accent stretch" disabled={isSubmitting}>
								Create Party
							</button>
							<button type="button" className="button button-secondary stretch" onClick={() => setOpenCreateParty(false)}>
								Cancel
							</button>
						</div>
					</Frame>
				</form>
			</Popup>

			<Popup closerFunc={setOpenAllParties} toggle={openAllParties}>
				<Frame classes={styles.popupCard}>
					<div className={styles.popupHeader}>
						<h3 className="card-title">Join a Party</h3>
						<button type="button" className="button button-secondary short" onClick={() => setOpenAllParties(false)}>
							Close
						</button>
					</div>
					<div className={styles.partyGrid}>
						{allParties.length === 0 && <div className={styles.empty}>No parties available.</div>}
						{allParties.map((party, index) => (
							<div key={index} className={styles.partyCard}>
								<span className={styles.partyName}>{party.name}</span>
								<button className="button button-accent short" type="button" onClick={() => handleJoinParty(party.id)}>
									<Icon name="plus" size={13} /> Join
								</button>
							</div>
						))}
					</div>
				</Frame>
			</Popup>
		</motion.section>
	);
}
