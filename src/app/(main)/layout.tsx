"use client";
import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { getLoginData } from "./utils/utils";
import { usePathname, useRouter } from "next/navigation";
import Script from "next/script";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const publicPaths = ["/home", "/viewProduct"];
    const isPublic = publicPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
    if (isPublic) return;
    if (!getLoginData()) {
      router.push("/login");
    }
  }, [pathname, router]);

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
