"use client";

import { useState } from "react";
import ChatModal from "./ChatModal";

interface Ticket {
  _id: string;
  user: string;
  ticketId: string;
  status: string;
  subject: string;
  description: string;
  category: string;
  image?: string | null;
  createdAt: string;
}

interface TicketCardProps {
  ticketData: Ticket;
}

export default function TicketCard({ticketData}: TicketCardProps) {
  const [open, setOpen] = useState(false);

  const statusColor =
    ticketData.status === "open"
      ? "bg-[#10b981]"
      : ticketData.status === "pending"
      ? "bg-[#f59e0b]"
      : ticketData.status === "resolved"
      ? "bg-[#6366f1]"
      : "bg-[#64748b]";

  return (
    <>
      <div className="bg-white p-4 shadow-sm hover:shadow-md transition duration-200 w-[280px]">
        <h4 className="text-sm font-medium text-[#0f172a]">
          Ticket Id: {ticketData.ticketId}
        </h4>

        <p className="mt-2">
          <span className={`inline-block text-white text-xs font-semibold px-2 py-0.5 rounded-sm ${statusColor}`}>
            {ticketData.status}
          </span>
        </p>

        <h3 className="text-sm text-[#64748b] mt-3">
          Date: {new Date(ticketData.createdAt).toLocaleDateString("en-GB")}
        </h3>

        <div className="flex justify-center mt-4">
          <button
            className="btn btn-primary btn-sm w-full"
            onClick={() => setOpen(true)}
          >
            Message
          </button>
        </div>
      </div>

      {open && (
        <ChatModal
          ticket={ticketData}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
