import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { sendTicket } from "../utilities/sendTickets";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { motion } from "framer-motion";
import { toast } from "../utilities/toasterSonner";
import { Popup } from "../components/Popup/Popup";
import { Frame } from "../components/Frame/Frame";
import { Heading, Icon } from "../components/Primitives";
import { TicketLog } from "../sections/TicketLog";
import styles from "./tickets.module.css";

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
      toast({ style: "", message: "Please fill out all fields" });
      return;
    }

    let error;
    try {
      await sendTicket(report);
      toast({ style: "", message: `Ticket sent! Thank you for submitting a ${bugOrFeature}!` });
    } catch (err) {
      error = err;
      toast({ style: "", message: "Ticket not sent! There was an error: " + err });
      throw err;
    }
    if (error) return;

    setAppSection("");
    setTicket("");
  };

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.page}>
      <Frame classes={styles.card}>
        <Heading size={26} align="center">All feedback is greatly appreciated</Heading>
        <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="bugOrFeature">Type</label>
            <select id="bugOrFeature" className="select" value={bugOrFeature} onChange={(e) => setBugOrFeature(e.target.value)}>
              <option value="Bug Report">Bug Report</option>
              <option value="Feature Request">Feature Request</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="appSection">Section</label>
            <input
              type="text"
              name="appSection"
              id="appSection"
              onChange={(e) => setAppSection(e.target.value)}
              value={appSection}
              placeholder={`Which section is your ${bugOrFeature.toLowerCase()} about?`}
              className="input"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ticket">Description</label>
            <textarea
              name="ticket"
              id="ticket"
              onChange={(e) => setTicket(e.target.value)}
              value={ticket}
              rows={4}
              placeholder="Describe it in detail…"
              className={`textarea ${styles.descArea}`}
            />
          </div>
          <div className={styles.actions}>
            <button type="submit" className="button button-primary">
              <Icon name="check" size={14} /> Submit
            </button>
            <button type="button" className="button button-ghost" onClick={() => setOpenTicketLog(true)}>
              <Icon name="scroll" size={14} /> Ticket Log
            </button>
          </div>
        </form>
      </Frame>
      <Popup closerFunc={setOpenTicketLog} toggle={openTicketLog}>
        <TicketLog />
      </Popup>
    </motion.main>
  );
}
