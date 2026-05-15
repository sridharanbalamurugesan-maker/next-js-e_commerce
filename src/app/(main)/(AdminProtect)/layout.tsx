"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getLoginData } from "../utils/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  useEffect(() => {

    const user = getLoginData();
    console.log("user",user);

    // logged in
    if (!user) {
      router.push("/login");
      return;
    }

    // admin
    if (user.role !==  "69e08e6d2d1e81b6cc670c3b") {
      router.push("/home");
      return;
    }

  }, [router]);

  return <>{children}</>;
}