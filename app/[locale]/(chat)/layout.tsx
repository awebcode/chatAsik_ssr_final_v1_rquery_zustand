import { unstable_setRequestLocale } from "next-intl/server";
import { ReactNode } from "react";

export default function ChatLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <> {children}</>;
}
