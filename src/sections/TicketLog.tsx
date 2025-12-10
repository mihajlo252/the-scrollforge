import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabase";
import { toast } from "../utilities/toasterSonner";
import { BoxSection } from "../components/BoxSection";

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
      toast({ style: "bg-error text-base-100", message: "Error getting tickets:" + error });
    }
    setTickets(data as Ticket[]);
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <BoxSection styles="w-[65%] h-full flex flex-col px-10 py-5">
      <h1 className="text-3xl font-bold text-primary">Ticket Log</h1>
      <div className="flex flex-col gap-5 mt-10 overflow-y-scroll overflow-x-visible">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="flex flex-col text-left gap-2">
            <h2 className="text-sm text-gray-500">
              {ticket.type} | {new Date(ticket.created_at).toLocaleDateString()} |{" "}
              <span className={ticket.status === "Open" ? "text-accent" : ticket.status === "Complete" ? "text-success" : "text-primary"}>
                {ticket.status}
              </span>
            </h2>
            <div className="border-slate-900 rounded-[1em] corner-squircle py-2 px-2 border-2">
              <h3><span className="text-accent">App section:</span> {ticket.appSection}</h3>
              <p>
                <span className="text-accent">Description:</span> {ticket.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </BoxSection>
  );
};
