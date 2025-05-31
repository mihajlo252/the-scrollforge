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
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([{ content: "", created_at: "", id: "", user_id: "", username: "" }]);

    const sendMessage = async (e: any) => {
        e.preventDefault();
        if (e.target[0].value === "") {
            toast({ style: "bg-error text-base-100", message: "Please enter a message" });
            return;
        }
        const userID = JSON.parse(getUserFromLocal()!).user.id;
        const { error } = await supabase.from("messages").insert({ content: e.target[0].value, user_id: userID, username: "beca" });
        setNewMessage("");

        if (error) console.error("Error sending message:", error);
    };

    const handleSetNewMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setNewMessage(e.target.value);
    };

    useEffect(() => {
        const handleGetMessages = async () => {
            let { data } = await supabase.from("messages").select("*");
            if (!data) return;
            setMessages(data.map((d: any) => d));
        };
        return () => {
            handleGetMessages();
        };
    }, []);

    useEffect(() => {
        const subscription = supabase
            .channel("chat-room")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
                setMessages((prev) => [...prev, payload.new.content]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
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
            <BoxSection styles="w-full h-full flex flex-col place-self-center px-10 py-5 gap-10">
                <BoxSection styles=" w-full flex flex-col place-self-center px-5 py-5 overflow-y-scroll pb-0 gap-5 no-scrollbar">
                    <ul className="flex flex-col justify-start gap-2">
                        {messages.map((message, index) => (
                            <li key={index} className="flex flex-col text-left">
                                <label className="text-xl font-bold capitalize text-primary">{message.username}</label>
                                <div className="flex justify-between">
                                    {message.content}
                                    <span className="text-accent">
                                        {new Date(message.created_at).toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        })}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div ref={ref} className="px-5"></div>
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
