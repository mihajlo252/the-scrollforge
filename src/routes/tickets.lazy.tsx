import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { sendTicket } from "../utilities/sendTickets";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { motion } from "framer-motion";

export const Route = createLazyFileRoute("/tickets")({
    component: Tickets,
});

function Tickets() {
    const [short, setShort] = useState<string>("");
    const [ticket, setTicket] = useState<string>("");
    const [bugOrFeature, setBugOrFeature] = useState<string>("Bug Report");

    const { user } = JSON.parse(getUserFromLocal());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const report: Ticket = {
            title: short,
            description: ticket,
            user_id: user.id,
            type: bugOrFeature
        };
        if (report.title === "" || report.description === "") return;

        let error;
        try {
            await sendTicket(report);
        } catch (err) {
            error = err;
            throw err;
        }
        if (error) return;

        setShort("");
        setTicket("");
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                <form
                    className="flex h-full w-full flex-col items-center justify-center gap-10 rounded-lg border-2 border-slate-900 bg-base-300 px-[25%] text-left text-neutral"
                    onSubmit={(e) => handleSubmit(e)}
                    >
                    <h1 className="sticky top-0 w-full text-center text-3xl font-bold text-primary">Select feature if you have a feature request or bug report if you've found one.</h1>
                    <div className="flex w-full flex-col gap-2">
                        <select className="select select-bordered" value={bugOrFeature} onChange={(e) => setBugOrFeature(e.target.value)}>
                            <option value="Bug Report">Bug Report</option>
                            <option value="Feature">Feature</option>
                        </select>
                    </div>
                    <div className="flex w-full flex-col gap-5">
                        <input
                            type="text"
                            name="short"
                            id="short"
                            onChange={(e) => setShort(e.target.value)}
                            value={short}
                            placeholder="Short Description"
                            className="input input-bordered"
                        />
                        <textarea
                            name="ticket"
                            id="ticket"
                            onChange={(e) => setTicket(e.target.value)}
                            value={ticket}
                            rows={3}
                            cols={50}
                            placeholder="Describe your problem"
                            className="textarea textarea-bordered min-h-[1rem] resize-none"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>
        </motion.div>
    );
}
