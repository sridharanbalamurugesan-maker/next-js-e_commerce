"use client";

import { useEffect, useState } from "react";
import { forgotPass } from "../(main)/utils/forgotPasswordApi";
import { getLoginData, successLoader } from "../(main)/utils/utils";
import { useRouter } from "next/navigation";

export default function ForgotPage(){
    const [email,setEmail]=useState<string>('');
    const [user, setUser] = useState<any>(null);
    const router=useRouter();
    useEffect(()=>{
        const loginUser=getLoginData();
        setUser(loginUser);
    },[])
    const handleSubmit=async(e:any)=>{
        e.preventDefault();
         if (!email.trim()) {
         alert("Please enter your email");
         return;
          }
          const payload={
            email:email
          }
    const response=await forgotPass(payload);
    console.log("forgotPassword",response);
    if(response.success){
            successLoader(response.message);
    }
            setEmail("");

    };
    const handleClick=()=>{
        if(user){
            router.push('/home')
        }
        else{
            router.push('/login');
        }
    };
    return(
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] px-4">
      <div className="w-full max-w-[800px] flex flex-col md:flex-row shadow-lg overflow-hidden">
        <div className="bg-[#6366f1] text-white p-8 md:w-[340px] flex flex-col justify-between min-h-[360px]">
          <div>
            <h2 className="text-3xl font-medium mb-4">Forgot Password</h2>
            <p className="text-[#c7d2fe] text-lg leading-7">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>
          <p className="italic font-extrabold text-2xl mt-10">Grabbuy</p>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 bg-white p-8 md:p-10 flex flex-col gap-6">
             <input  className="fk-input" type="email" value={email}  placeholder="Enter your email" onChange={(e)=>{setEmail(e.target.value)}}/>
            
            <button type="submit" className="fk-orange-btn py-3 text-sm">Send Reset Link</button>
            <button type="button" className="w-full bg-white text-[#6366f1] py-3 text-sm font-medium shadow-[0_2px_4px_0_rgba(0,0,0,.2)]" onClick={handleClick}>{user?"Home":"Login"}</button>
        </form>
      </div>
    </div>
    )
}
