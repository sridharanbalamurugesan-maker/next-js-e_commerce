import { io, Socket } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const socket: Socket = io(URL,{
   autoConnect:false,
});