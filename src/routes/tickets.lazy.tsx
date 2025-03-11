import { createLazyFileRoute } from "@tanstack/react-router";
import { BoxSection } from "../components/BoxSection";
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

    /*Temporary feature*/
    const [screenSize, setScreenSize] = useState([window.innerWidth, window.innerHeight]);
    /*Temporary feature*/

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
            <BoxSection styles="w-full h-full p-5 justify-center items-center overflow-scroll">
                <form
                    className="flex h-full w-1/2 flex-col items-center justify-center gap-5 text-left"
                    onSubmit={(e) => handleSubmit(e)}
                    >
                    <h1 className="mb-5 text-center text-3xl font-bold text-primary">Select feature if you have a feature request or bug report if you've found one.</h1>
                    <div className="mb-20 flex w-full flex-col gap-2">
                        <select className="select select-bordered" value={bugOrFeature} onChange={(e) => setBugOrFeature(e.target.value)}>
                            <option value="Bug Report">Bug Report</option>
                            <option value="Feature">Feature</option>
                        </select>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        {/* <label htmlFor="short">Short Description:</label> */}
                        <input
                            type="text"
                            name="short"
                            id="short"
                            onChange={(e) => setShort(e.target.value)}
                            value={short}
                            placeholder="Short Description"
                            className="input input-bordered"
                        />
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        {/* <label htmlFor="bug">Full Description:</label> */}
                        <textarea
                            name="ticket"
                            id="ticket"
                            onChange={(e) => setTicket(e.target.value)}
                            value={ticket}
                            placeholder="Describe your problem"
                            className="textarea textarea-bordered"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>

                /*Temporary feature*/
                <p className="absolute right-0 top-0">Screen Size: {screenSize[0]} x {screenSize[1]} </p>
                /*Temporary feature*/
            </BoxSection>
        </motion.div>
    );
}
