import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { sendTicket } from "../utilities/sendTickets";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { motion } from "framer-motion";
import { toast } from "../utilities/toasterSonner";
import { Popup } from "../components/Popup/Popup";
import { TicketLog } from "../sections/TicketLog";

export const Route = createLazyFileRoute("/tickets")({
  component: Tickets,
});

function Tickets() {
  const [appSection, setAppSection] = useState<string>("");
  const [ticket, setTicket] = useState<string>("");
  const [bugOrFeature, setBugOrFeature] = useState<string>("Bug Report");
  const [openTicketLog, setOpenTicketLog] = useState<boolean>(false);

  const { user } = JSON.parse(getUserFromLocal());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const report: Ticket = {
      appSection: appSection,
      description: ticket,
      user_id: user.id,
      type: bugOrFeature,
    };
    if (report.appSection === "" || report.description === "") {
      toast({ style: "bg-error text-base-100", message: "Please fill out all fields" });
      return;
    }

    let error;
    try {
      await sendTicket(report);
      toast({ style: "bg-success text-base-100", message: `Ticket sent! Thank you for submitting a ${bugOrFeature}!` });
    } catch (err) {
      error = err;
      toast({ style: "bg-success text-base-100", message: "Ticket not sent! There was an error: " + err });
      throw err;
    }
    if (error) return;

    setAppSection("");
    setTicket("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full relative">
      <form
        className="flex h-full w-full flex-col items-center justify-center gap-10 rounded-lg border-2 border-slate-900 bg-base-300 px-[25%] text-left text-neutral"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h1 className="sticky top-0 w-full text-center text-3xl font-bold text-primary">All feedback is greatly appreciated.</h1>
        <div className="flex w-full flex-col gap-2">
          <select className="select select-bordered" value={bugOrFeature} onChange={(e) => setBugOrFeature(e.target.value)}>
            <option value="Bug Report">Bug Report</option>
            <option value="Feature Request">Feature Request</option>
          </select>
        </div>
        <div className="flex w-full flex-col gap-5">
          <input
            type="text"
            name="appSection"
            id="appSection"
            onChange={(e) => setAppSection(e.target.value)}
            value={appSection}
            placeholder={`Which section of the app is your ${bugOrFeature} referring to?`}
            className="input input-bordered"
          />
          <textarea
            name="ticket"
            id="ticket"
            onChange={(e) => setTicket(e.target.value)}
            value={ticket}
            rows={3}
            cols={50}
            placeholder="Ticket Description"
            className="textarea textarea-bordered min-h-[1rem] resize-none"
          />
        </div>

        <button type="submit" className="button button-primary">
          Submit
        </button>
        <button type="button" className="button button-accent" onClick={() => setOpenTicketLog(true)}>
          Ticket Log
        </button>
      </form>
      <Popup closerFunc={setOpenTicketLog} toggle={openTicketLog}>
        <TicketLog />
      </Popup>
    </motion.div>
  );
}
