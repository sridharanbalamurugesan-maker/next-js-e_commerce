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
        {field:"status",headerName:"Status",width:140,renderCell:({ row }) => {
            return (
            <span
                className={`px-3 py-1 rounded-sm text-white text-xs font-semibold
                ${
                    row.status === "open"
                    ? "bg-[#10b981]"
                    : row.status === "pending"
                    ? "bg-[#f59e0b]"
                    : "bg-[#64748b]"
                }`}
            >
                {row.status}
            </span>
            );
  }},
        {field:"chat",headerName:"Chat As",width:200,renderCell:(params)=>(
        <button className="btn btn-primary btn-sm" style={{cursor:"pointer"}} onClick={()=>{handleChat(params.row)}} >Chat</button>
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
    <div className="p-4 bg-[#f8fafc] min-h-[calc(100vh-56px)]">
      <div className="max-w-[1240px] mx-auto bg-white">
        <div className="px-5 py-4 border-b border-[#f0f0f0]">
          <h3 className="text-lg font-medium">
                  All Tickets
          </h3>
        </div>
        <AdminChatModal
        ticket={selectedTicket}
        />
        <div className="p-2">
         <DataGrid
            rows={row}
            columns={columns}
            getRowId={(row) => row._id}
            pagination
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10]}
            autoHeight
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontWeight: 600,
              },
            }}/>
        </div>
      </div>
    </div>
    </>
    )
}
