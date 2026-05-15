"use client";
import { useRouter } from "next/navigation";
import { getLoginData, removeLoginData } from "../utils/utils"
import { useEffect, useState } from "react";

export default function navbar(){
  const router=useRouter();
  const [userData,setUserData]=useState<any>(null);
  useEffect(()=>{
    const data=getLoginData();
    setUserData(data);
  },[])
  const handleLogout=()=>{
     removeLoginData();
      router.push('/login');
  }
  const handleSetting=()=>{
    router.push('/setting');
  }
  const handleHome=()=>{
    router.push('/home');
  }
  const handleClick=()=>{
    router.push('/category');
  }
  const handleProduct=()=>{
    router.push('/product');
  }
  const handleCart=()=>{
    router.push('/cart');
  }
    return(<>
    <div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <div className="dropdown dropdown-hover">
  <div tabIndex={0} role="button" className="btn m-1">menu</div>
  <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
     <li><button onClick={handleHome}>Home</button></li>
     {userData?.role=="69e08e6d2d1e81b6cc670c3b"&&(
      <>
      <li><button onClick={handleClick}>Category</button></li>
      <li><button onClick={handleProduct}>Product</button></li>
     </>
    )}
  </ul>
</div>
  </div>
  <div className="flex-none">
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
        </div>
      </div>
      <div
        tabIndex={0}
        className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
        <div className="card-body">
          <div className="card-actions">
            <button className="btn btn-primary btn-block" onClick={handleCart}>View cart</button>
          </div>
        </div>
      </div>
    </div>
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex={-1}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><button onClick={handleSetting}>Settings</button></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </div>
  </div>
</div></>)
}