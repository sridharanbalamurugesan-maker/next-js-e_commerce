"use client";

import { useEffect, useRef, useState } from "react";
import {getMessage,sentMessage,updateTicketStatus} from "../utils/chatBoxApi";
import { failureLoader, successLoader } from "../utils/utils";
import { IoMdAdd } from "react-icons/io";

interface Props {
  ticket: any;
}

export default function AdminChatModal({ticket}: Props) {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {

    if (!ticket?.ticketId) return;

    fetchMessages();

  }, [ticket]);

  const fetchMessages = async () => {

    try {

      const response = await getMessage(ticket.ticketId);

      if (response.success) {

        setMessages(response.data);

      }

    } catch (error:any) {

      failureLoader(error.message);

    }
  };

  const handleSend = async () => {

    if (!message.trim()) return;

    try {
         const formData=new FormData();
        formData.append("ticketId",ticket.ticketId);
        formData.append("message",message);
        formData.append("isAdmin","true");
        if(file){
            formData.append("attachment",file);
        }
      const response = await sentMessage(formData);
    //    console.log("Message",messages);

      if (response.success) {

        setMessages((prev) => [
          ...prev,
          response.data,
        ]);
        setFile(null);
        setMessage("");

      }
      else{
         const modal = document.getElementById("AdminChat") as HTMLDialogElement;
            modal?.close();
            console.log("Res",response)
        failureLoader("only jpeg and png and webp are allowed");
      }

    } catch (error:any) {

      failureLoader(error.message);

    }
  };

  const handleStatus = async (status:string) => {

  try {

    const response =await updateTicketStatus(ticket.ticketId,status);

    if (response.success) {

      alert("Status Updated");

    }

  } catch (error:any) {

    failureLoader(error.message);

  }
};

  return (
    <>
      <dialog id="AdminChat" className="modal">

        <div className="modal-box w-11/12 max-w-2xl rounded-2xl p-8">

          <h3 className="text-3xl font-bold mb-6 text-center">
            Admin Chat Box
          </h3>

          <div className="max-w-xl mx-auto h-[90vh] flex flex-col border rounded-lg">

            <div className="border-b p-4 bg-white">

              <h2 className="font-bold text-xl">
                Ticket : {ticket?.ticketId}
              </h2>

              <h2 className="text-lg">
                Status : {ticket?.status}
              </h2>

              <h2 className="text-lg">
                Subject : {ticket?.subject}
              </h2>

                  <div className="flex gap-3 mt-3">

                <button
                    className="btn btn-success"
                    onClick={() =>handleStatus("resolved")}>
                    Close
                </button>

                <button
                    className="btn btn-error"
                    onClick={() =>handleStatus("rejected")}>
                    Reject
                </button>

                </div>

            </div>

         <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-3">
              {messages.map((msg, index) => (
            <div
                key={index}
                className={`flex mb-3 ${
                msg.isAdmin
                    ? "justify-end"
                    : "justify-start"}`}>
                <div
                className={`max-w-[70%] p-3 rounded-lg ${
                    msg.isAdmin
                    ? "bg-blue-500 text-white"
                    : "bg-white border"}`}>
                <div>
                <p>{msg.message}</p>

                 {msg.attachment && (
                <div className="mt-2">
                    <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${msg.attachment}`}
                    alt="Attachment"
                    className="max-w-xs rounded-lg"
                    />
                </div>
                )}

                </div>
                
                <p className="text-xs mt-1">
                 {new Date(msg.createdAt).toLocaleString()}
                </p>

                </div>

            </div>

            ))}

            </div>

            <div className="border-t bg-white">
            
              {/* Selected File Preview */}
              {file && (
                <div className="flex items-center justify-between mx-4 mt-3 mb-2 px-3 py-2 bg-gray-100 rounded-lg border">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-lg">📎</span>
            
                    <span className="text-sm text-gray-700 truncate max-w-[250px]">
                      {file.name}
                    </span>
                  </div>
            
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) {      //This part use to when ever the file selected considered as a new file
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            
              {/* Input Area */}
              <div className="p-4 flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
            
                <button
                  type="button"
                  className="btn btn-ghost btn-circle"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IoMdAdd size={28} />
                </button>
            
                <input
                  type="text"
                  className="input input-bordered flex-1"
                  placeholder="Write message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
            
                <button
                  className="btn btn-primary"
                  onClick={handleSend}
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          <form
            method="dialog"
            className="flex justify-center mt-5"
          >

            <button className="btn btn-outline">
              Close
            </button>

          </form>

        </div>
      </dialog>
    </>
  );
}