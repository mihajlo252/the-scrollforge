import { createLazyFileRoute } from "@tanstack/react-router";
import { supabase } from "../supabase/supabase";
import { useEffect, useRef, useState } from "react";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { toast } from "../utilities/toasterSonner";
import { BoxSection } from "../components/BoxSection/BoxSection";
import { motion } from "framer-motion";
import { Popup } from "../components/Popup/Popup";

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

	return (
		<motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full relative">
			<BoxSection classes="w-full grid grid-rows-[repeat(2, 1fr)] grid-cols-[1fr] px-5 py-5 gap-2 h-full">
				<div className="flex gap-5 relative w-full">
					<div className="flex flex-col gap-2 w-[15%]">
						{myRooms.map((room) => (
							<button key={room.id} type="button" className="button button-accent button-ghost" onClick={() => setChatRoom(room.id)}>
								{room.name}
							</button>
						))}
					</div>

					<BoxSection classes="flex-col grow px-5 py-5 gap-5 overflow-y-scroll w-full h-[calc(100vh-230px)]">
						{chatRoom && (
							<>
								<ul className="flex flex-col justify-start gap-2 h-[calc(80vh-230px)]">
									<li className="flex flex-col text-left">
										<p className="text-center text-xs text-slate-400">System message</p>
										<p className="text-center text-accent">Welcome to {myRooms.find((room) => room.id === chatRoom)?.name}</p>
									</li>
									{messages.map((message, index) => (
										<li key={index} className="flex flex-col text-left gap-2">
											<p
												className={`text-xl font-bold capitalize ${message.user_id === userID ? "text-accent" : "text-primary"}`}
											>
												{message.username}
												{message.user_id === userID && <span className="text-xs text-slate-400"> (Me)</span>}
											</p>

											<p className="flex justify-between">
												{message.content}
												<span className="flex items-center justify-end text-accent">
													{new Date(message.created_at).toLocaleTimeString("en-US", {
														hour: "2-digit",
														minute: "2-digit",
														hour12: false,
													})}
												</span>
											</p>
										</li>
									))}
								</ul>
								<div ref={lastMessageRef} className="px-5 text-left"></div>
							</>
						)}
					</BoxSection>
				</div>

				<div className="flex gap-5 items-end">
					<div className="flex flex-col gap-2 w-[15%]">
						<button type="button" className="button button-accent button-ghost" onClick={() => handleGetAllParties()}>
							Join Party
						</button>
						<button className="button button-primary" onClick={() => setOpenCreateParty(true)}>
							Create Party
						</button>
					</div>
					<div className="flex gap-2 w-full">
						<button type="button" className="button button-accent" onClick={() => setSeeActiveUsers(true)}>
							Active
						</button>
						<form onSubmit={sendMessage} className="flex gap-2 flex-1">
							<input
								type="text"
								value={newMessage}
								onChange={handleSetNewMessage}
								placeholder="Type a message..."
								className="input input-bordered flex-grow"
							/>
							<button type="submit" className="button button-primary">
								Send
							</button>
						</form>
					</div>
				</div>
			</BoxSection>

			<Popup closerFunc={setSeeActiveUsers} toggle={seeActiveUsers}>
				<BoxSection classes="w-1/5 px-5 py-5 flex-col gap-5 justify-start items-center relative">
					<button type="button" className="button button-secondary button-ghost" onClick={() => setSeeActiveUsers(false)}>
						Close
					</button>
					<h1 className=" text-4xl font-semibold text-primary">Active</h1>
					<ul className="flex flex-col">
						{activeUsers.map((user, index) => (
							<li key={index} className="flex flex-col justify-center items-center">
								<p className="text-3xl font-bold capitalize text-success flex items-center">{user}</p>
							</li>
						))}
					</ul>
				</BoxSection>
			</Popup>

			<Popup closerFunc={setOpenCreateParty} toggle={openCreateParty}>
				<form onSubmit={handleCreateRoom}>
					<BoxSection classes="w-full flex flex-col gap-5 px-20 py-10">
						<div className="flex flex-col gap-5">
							<label htmlFor="roomNameID" className="text-2xl">
								Name Your Party
							</label>
							<input
								type="text"
								placeholder="Name"
								id="roomNameID"
								value={newRoomName}
								onChange={(e) => setNewRoomName(e.target.value)}
								className="rounded-xl border-2 border-slate-900 bg-base-300 p-2 text-base-content"
							/>
						</div>
						<div className="flex gap-2">
							<button type="submit" className="button button-primary" disabled={isSubmitting ? true : false}>
								Create party
							</button>
							<button type="button" className="button button-secondary" onClick={() => setOpenCreateParty(false)}>
								Cancel
							</button>
						</div>
					</BoxSection>
				</form>
			</Popup>

			<Popup closerFunc={setOpenAllParties} toggle={openAllParties}>
				<form onSubmit={handleCreateRoom}>
					<BoxSection classes="w-full flex flex-col gap-5 px-10 py-5">
						<ul className="grid grid-cols-2 gap-2">
							{allParties.map((party, index) => (
								<li key={index} className="flex flex-col">
									<BoxSection classes="relative flex flex-col gap-2 py-5 px-10">
										<p className="text-xl font-bold capitalize">{party.name}</p>
										<button className="button button-accent" type="button" onClick={() => handleJoinParty(party.id)}>
											Join
										</button>
									</BoxSection>
								</li>
							))}
						</ul>
					</BoxSection>
				</form>
			</Popup>
		</motion.main>
	);
}
