"use client";
import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { getLoginData } from "./utils/utils";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    const user = getLoginData();
    if (!user) {
      router.push("/login");
      return;
    }
  }, [router]);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#f8fafc] min-h-[calc(100vh-56px)]">
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </main>
      <Footer />
    </>
  );
}
