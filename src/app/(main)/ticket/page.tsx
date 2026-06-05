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
    <h3 className="flex justify-center items-center">My Ticket</h3>
    <div
              className="flex flex-wrap gap-5"
            >
    
              {ticketData?.map((ticket)=>(
            <TicketCard
            key={ticket._id}
            ticketData={ticket}/>
            ))}
        
            </div>
            
    
    </>
    )
}