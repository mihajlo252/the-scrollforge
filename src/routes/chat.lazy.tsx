import { createLazyFileRoute } from "@tanstack/react-router";
import { supabase } from "../supabase/supabase";
import { useEffect, useRef, useState } from "react";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { toast } from "../utilities/toasterSonner";
import { BoxSection } from "../components/BoxSection";
import { motion } from "framer-motion";

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

function Chat() {
    const userID = JSON.parse(getUserFromLocal()!).user.id;
    const username = JSON.parse(getUserFromLocal()!).user.user_metadata.username;
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([
        {
            content: "Welcome to the chat!",
            created_at: "",
            id: "",
            user_id: "",
            username: "",
        },
    ] as IMessage[]);

    const sendMessage = async (e: any) => {
        e.preventDefault();
        if (e.target[0].value === "") {
            toast({ style: "bg-error text-base-100", message: "Please enter a message" });
            return;
        }
        const { error } = await supabase.from("messages").insert({ content: e.target[0].value, user_id: userID, username: username });
        setNewMessage("");

        if (error) console.error("Error sending message:", error);
    };

    const handleSetNewMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setNewMessage(e.target.value);
    };

    const handleGetMessages = async () => {
        let { data } = await supabase.from("messages").select("*");
        if (!data) return;
        setMessages((prev) => [...prev, ...(data.map((d: any) => d) as IMessage[])]);
    };

    useEffect(() => {
        const subscription = supabase
            .channel("chat-room")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
                setMessages((prev) => [...prev, payload.new as IMessage]);
            })
            .on("postgres_changes", { event: "DELETE", schema: "public", table: "messages" }, (payload) => {
                setMessages((prev) => prev.filter((message) => message.id !== payload.old.id));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
            handleGetMessages();
        };
    }, []);

    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (messages.length) {
            ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages.length]);

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="m-0 h-full w-full p-0">
            <BoxSection styles="w-full h-full flex flex-col px-10 py-5 gap-10 justify-between">
                <BoxSection styles="w-full max-h-[70vh] flex flex-col flex-grow px-5 py-5 gap-5 overflow-y-scroll no-scrollbar">
                    <ul className="flex flex-col justify-start gap-2">
                        {messages &&
                            messages.map((message, index) => (
                                <li key={index} className="flex flex-col text-left">
                                    {index === 0 ? (
                                        <>
                                            <p className="text-center text-xs text-slate-400">System message</p>
                                            <p className="text-center text-accent">{message.content}</p>
                                        </>
                                    ) : (
                                        <div className="relative flex flex-col gap-2">
                                            <p className="text-xl font-bold capitalize text-primary">
                                                {message.username}
                                                {message.user_id === userID && <span className="text-xs text-slate-400"> (Me)</span>}
                                            </p>

                                            <div className="flex justify-between">
                                                {message.content}
                                                <span className="flex items-center justify-end text-accent">
                                                    {new Date(message.created_at).toLocaleTimeString("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: false,
                                                    })}
                                                </span>
                                            </div>

                                        </div>
                                    )}
                                </li>
                            ))}
                    </ul>
                    <div ref={ref} className="px-5 text-left"></div>
                </BoxSection>
                <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleSetNewMessage}
                        placeholder="Type a message..."
                        className="input input-bordered flex-grow"
                    />
                    <button type="submit" className="btn btn-primary">
                        Send
                    </button>
                </form>
            </BoxSection>
        </motion.main>
    );
}
