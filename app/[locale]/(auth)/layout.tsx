import React, { ReactNode } from "react";
import dynamic from "next/dynamic";
const Topbar = dynamic(() => import("../(chat)/conponents/Topbar"));
export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Topbar /> {children}
    </>
  );
}
