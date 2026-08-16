"use client";
import { usePathname, useRouter } from "next/navigation";
import { CART_UPDATED_EVENT, DEFAULT_PROFILE_IMAGE, getLoginData, getProfileImageUrl, notifyHomeReset, PROFILE_UPDATED_EVENT, removeLoginData, SEARCH_CLEARED_EVENT } from "../utils/utils"
import { useEffect, useState } from "react";
import SupportModal from "./SupportModal";
import { getCartByUser } from "../utils/cartApi";

export default function navbar(){
  const router=useRouter();
  const pathname=usePathname();
  const [userData,setUserData]=useState<any>(null);
  const [cartCount,setCartCount]=useState(0);
  const [search,setSearch]=useState("");
  useEffect(()=>{
    const data=getLoginData();
    setUserData(data);
    const refreshUser=()=>{
      setUserData(getLoginData());
    };
    window.addEventListener(PROFILE_UPDATED_EVENT, refreshUser);
    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, refreshUser);
    };
  },[])
  useEffect(()=>{
    if(pathname === "/home"){
      const params=new URLSearchParams(window.location.search);
      setSearch(params.get("search") || "");
    }
  },[pathname])
  useEffect(()=>{
    const clearSearch=()=>setSearch("");
    window.addEventListener(SEARCH_CLEARED_EVENT, clearSearch);
    return () => {
      window.removeEventListener(SEARCH_CLEARED_EVENT, clearSearch);
    };
  },[])
  useEffect(()=>{
    fetchCartCount();
    window.addEventListener(CART_UPDATED_EVENT, fetchCartCount);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, fetchCartCount);
    };
  },[pathname])
  const fetchCartCount=async()=>{
    try {
      const user=getLoginData();
      if(!user?._id){
        setCartCount(0);
        return;
      }
      const response=await getCartByUser(user._id);
      if(response?.success){
        setCartCount(response.data?.length || 0);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleLogout=()=>{
     removeLoginData();
      router.push('/login');
  }
  const handleSetting=()=>{
    router.push('/setting');
  }
  const handleHome=()=>{
    setSearch("");
    router.push('/home');
    notifyHomeReset();
  }
  const handleSearch=(e:React.FormEvent)=>{
    e.preventDefault();
    const keyword=search.trim();
    if(keyword){
      router.push(`/home?search=${encodeURIComponent(keyword)}`);
    }else{
      handleHome();
    }
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
  const handleMyOrders=()=>{
    router.push('/myOrders')
  }
  const handleUsers=()=>{
    router.push('/users')
  }
  const handleChat=()=>{
      const modal = document.getElementById("support") as HTMLDialogElement;
                modal?.showModal();
  }
  const handleTicket=()=>{
    router.push('/ticket');
  }
  const handleView=()=>{
    router.push('/viewTickets');
  }
  const handlePassword=()=>{
    router.push('/resetPassword');
  }
  const handleProfile=()=>{
    router.push('/profile');
  }

    return(<>
    <header className="sticky top-0 z-50 bg-[#6366f1] shadow-md overflow-visible">
      <div className="max-w-[1240px] mx-auto w-full h-16 px-4 flex items-center gap-6">
        <div className="flex items-center gap-4 shrink-0">
          <button type="button" onClick={handleHome} className="flex flex-col items-start leading-none">
            <span className="text-white italic font-extrabold text-[20px] tracking-tight">Grabbuy</span>
            <span className="text-[10px] italic text-[#fcd34d] mt-0.5">
              Explore <span className="text-white font-semibold not-italic">Plus ★</span>
            </span>
          </button>

          <div className="dropdown dropdown-bottom">
            <div tabIndex={0} role="button" className="text-white font-medium text-sm h-9 px-3 flex items-center rounded hover:bg-[#4f46e5] cursor-pointer">
              Menu
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-white rounded-sm z-[100] w-52 p-1 shadow-lg text-[#0f172a] mt-2">
              <li><button onClick={handleHome}>Home</button></li>
              {userData?.role=="69e08e7c2d1e81b6cc670c3c"&&(
                <>
                <li><button onClick={handleTicket}>My Ticket</button></li>
                </>
              )}
              {userData?.role=="69e08e6d2d1e81b6cc670c3b"&&(
                <>
                <li><button onClick={handleClick}>Category</button></li>
                <li><button onClick={handleProduct}>Product</button></li>
                <li><button onClick={handleUsers}>users</button></li>
                <li><button onClick={handleView}>view Tickets</button></li>
               </>
              )}
            </ul>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex-1 min-w-0">
          <div className="flex items-center bg-white rounded-sm overflow-hidden h-10">
            <input
              type="text"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search for products, brands and more"
              className="flex-1 h-10 px-4 text-sm text-[#0f172a] outline-none bg-white border-0"
            />
            <button
              type="submit"
              className="h-10 px-4 text-[#6366f1] hover:bg-[#f8fafc] flex items-center justify-center"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
              </svg>
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3 shrink-0">
          <button type="button" onClick={handleCart} className="h-9 px-3 flex items-center gap-2 text-white font-medium text-sm rounded hover:bg-[#4f46e5] cursor-pointer">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#fcd34d] text-[#6366f1] text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </div>
            Cart
          </button>

          <div className="dropdown dropdown-end dropdown-bottom">
            <div tabIndex={0} role="button" className="h-9 px-2 flex items-center gap-2 text-white font-medium text-sm rounded hover:bg-[#4f46e5] cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-white overflow-hidden shrink-0">
                <img
                  alt="profile"
                  src={getProfileImageUrl(userData?.image) || DEFAULT_PROFILE_IMAGE}
                  className="w-full h-full object-cover" />
              </div>
              <span className="hidden sm:inline leading-none">{userData?.name || "Account"}</span>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/></svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-sm z-[100] mt-2 w-56 p-2 shadow-lg text-[#0f172a]">
              <li>
                <button onClick={handleProfile} className="justify-between">
                  Profile
                  <span className="badge badge-sm bg-[#fcd34d] border-none text-[#6366f1]">New</span>
                </button>
              </li>
              <li><button onClick={handleMyOrders}>orders</button></li>
              <li><button onClick={handleChat}>support As</button></li>
              <li><button onClick={handlePassword}>change Password</button></li>
              <li><button onClick={handleSetting}>Settings</button></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
        <SupportModal/>
      </div>
    </header>
    </>)
}
