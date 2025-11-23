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
  const [messages, setMessages] = useState<IMessage[]>([] as IMessage[]);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

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
    let { data } = await supabase.from("messages").select("*").limit(50).order("created_at", { ascending: false });
    // if (!data) return;
    setMessages((prev) => [...prev, ...(data?.reverse()?.map((d: any) => d) as IMessage[])]);
  };

  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messages.length) {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length]);

  useEffect(() => {
    const subscription = supabase.channel("a");
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

      // supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="m-0 h-full w-full p-0">
      <BoxSection styles="w-full max-h-[80vh] flex px-5 py-5 gap-2 justify-between overflow-hidden">
        <div className=" flex flex-col gap-5 px-2 py-5">
          <h1 className="text-center text-2xl font-semibold text-primary">Active</h1>
          <ul className="flex flex-col">
            {activeUsers.map((user, index) => (
              <li key={index} className="flex flex-col text-left">
                <p className="text-xl font-bold capitalize">
                  {user}
                  <span className="text-4xl text-success text-center leading-[1ch]">·</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-5 w-full h-full">
          <BoxSection styles="w-full max-h-[70vh] flex flex-col flex-grow px-5 py-5 gap-5 overflow-y-scroll">
            <ul className="flex flex-col justify-start gap-2">
              <li className="flex flex-col text-left">
                <p className="text-center text-xs text-slate-400">System message</p>
                <p className="text-center text-accent">Welcome to the chat!</p>
              </li>
              {messages.map((message, index) => (
                <li key={index} className="flex flex-col text-left">
                  <div className="relative flex flex-col gap-2">
                    <p className={`text-xl font-bold capitalize ${message.user_id === userID ? "text-accent" : "text-primary"}`}>
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
                </li>
              ))}
            </ul>
            <div ref={lastMessageRef} className="px-5 text-left"></div>
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
        </div>
      </BoxSection>
    </motion.main>
  );
}
