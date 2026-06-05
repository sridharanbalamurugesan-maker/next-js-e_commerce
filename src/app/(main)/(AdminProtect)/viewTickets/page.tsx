"use client";

import { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getAllAdminTickets } from "../../utils/ticketApi";
import AdminChatModal from "../../components/AdminChatModal";

export default function ViewTickets(){
    const [row,setRow]=useState();
    const [selectedTicket,setSelectedTicket]=useState(null);
    const columns:GridColDef[]=[
        {field:"user",headerName:"User Name",width:200,renderCell:({ row }) => row.user?.name},
        {field:"subject",headerName:"Subject",width:300},
        {field:"status",headerName:"Status",width:100,renderCell:({ row }) => {
            return (
            <span
                className={`px-3 py-1 rounded-full text-white text-sm
                ${
                    row.status === "open"
                    ? "bg-green-500"
                    : row.status === "pending"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
            >
                {row.status}
            </span>
            );
  }},
        {field:"chat",headerName:"Chat As",width:200,renderCell:(params)=>(
        <button className="btn btn-primary" style={{cursor:"pointer"}} onClick={()=>{handleChat(params.row)}} >Chat</button>
        )},
    ]
    const handleChat=async(row:any)=>{
        setSelectedTicket(row);
         const modal = document.getElementById("AdminChat") as HTMLDialogElement;
                modal?.showModal();
    }
    // console.log("selectedData",selectedTicket);
    useEffect(()=>{
        const fetchData=async()=>{
            const response=await getAllAdminTickets();
            if(response.success){
                const data=response.data;
                // console.log("res",data);
                setRow(data);
                
            }
        }
        fetchData();
    },[])
    return(
    <>
    <h3 className="text-3xl font-bold mb-6 text-center">
            All Tickets
    </h3>
    <AdminChatModal
    ticket={selectedTicket}
    />
     <DataGrid
        rows={row}
        columns={columns}
        getRowId={(row) => row._id}
        pageSizeOptions={[5,10,100]}/>
    </>
    )
}