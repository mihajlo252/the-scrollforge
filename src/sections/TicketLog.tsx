import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabase";
import { toast } from "../utilities/toasterSonner";
import { Frame } from "../components/Frame/Frame";
import styles from "../routes/tickets.module.css";

export const TicketLog = () => {
  type Ticket = {
    appSection: string;
    created_at: string;
    description: string;
    id: number;
    priority: string;
    status: string;
    type: string;
    updated_at: string;
    user_id: string;
  };

  const [tickets, setTickets] = useState<Ticket[]>([] as Ticket[]);

  const getTickets = async () => {
    const { data, error } = await supabase.from("tickets").select("*").limit(20).order("created_at", { ascending: false });
    if (error) {
      toast({ style: "", message: "Error getting tickets:" + error });
    }
    setTickets(data as Ticket[]);
  };

  useEffect(() => {
    getTickets();
  }, []);

  const statusColor = (status: string) =>
    status === "Open" ? "var(--accent)" : status === "Complete" ? "var(--emerald)" : "var(--gold-2)";

  return (
    <Frame classes={styles.logCard}>
      <h3 className="card-title">Ticket Log</h3>
      <div className={styles.logList}>
        {tickets.length === 0 && <div className={styles.empty}>No tickets yet.</div>}
        {tickets.map((ticket) => (
          <div key={ticket.id} className={styles.logItem}>
            <div className={styles.logMeta}>
              <span className="caps">{ticket.type}</span>
              <span>·</span>
              <span className="mono">{new Date(ticket.created_at).toLocaleDateString()}</span>
              <span>·</span>
              <span style={{ color: statusColor(ticket.status) }}>{ticket.status}</span>
            </div>
            <div className={styles.logBody}>
              <div><span className={styles.logKey}>App section:</span> {ticket.appSection}</div>
              <p><span className={styles.logKey}>Description:</span> {ticket.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
};
