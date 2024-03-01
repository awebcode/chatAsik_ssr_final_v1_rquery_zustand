import React, { ReactNode } from "react";
import dynamic from "next/dynamic";
import { unstable_setRequestLocale } from "next-intl/server";
const Topbar = dynamic(() => import("../(chat)/conponents/Topbar"));
export default function AuthLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <>
      <Topbar /> {children}
    </>
  );
}
