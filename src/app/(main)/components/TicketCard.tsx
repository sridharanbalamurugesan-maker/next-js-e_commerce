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

  return (
    <>
      <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300 w-[250px]">
        <h4 className="text-lg font-semibold mt-3">
          Ticket Id: {ticketData.ticketId}
        </h4>

        <p className="text-gray-600 mt-2">
          Status: {ticketData.status}
        </p>

        <h3 className="text-xl font-bold text-blue-600 mt-3">
          Date:
          {new Date(ticketData.createdAt).toLocaleDateString("en-GB")}
        </h3>

        <div className="flex justify-center mt-3">
          <button
            className="btn btn-primary"
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