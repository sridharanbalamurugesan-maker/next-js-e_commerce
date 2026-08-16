"use client"

import { useEffect, useState } from "react"
import { getAllUserTickets } from "../utils/ticketApi"
import TicketCard from "../components/TicketCard"

interface Ticket{
    _id:string;
    user:string;
    ticketId:string;
    status:string;
    subject:string;
    description:string;
    category:string;
    image?:string|null;
    createdAt:string;

}
export default function Ticket(){
    const [ticketData,setTicketData]=useState<Ticket[]>([]);
    useEffect(()=>{
        const viewTickets=async()=>{
            const response=await getAllUserTickets();
            if(response.success){
                console.log("Ticket",response);
                setTicketData(response.data)
            }
        }
        viewTickets();
    },[])
    return(
    <>
    <div className="bg-[#f8fafc] min-h-[calc(100vh-56px)] p-4">
      <div className="max-w-[1240px] mx-auto">
        <div className="bg-white px-5 py-4 mb-4">
          <h3 className="text-lg font-medium">My Tickets</h3>
        </div>
        <div className="flex flex-wrap gap-4">
    
              {ticketData?.map((ticket)=>(
            <TicketCard
            key={ticket._id}
            ticketData={ticket}/>
            ))}
        
            </div>
      </div>
    </div>
    
    </>
    )
}
