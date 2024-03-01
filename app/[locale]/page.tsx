const Topbar = dynamic(() => import("./(chat)/conponents/Topbar"));
// const LanguageChanger = dynamic(() => import("@/components/LanguageChanger"), {
//   ssr: false,
// });
import { fetchUser } from "@/functions/serverActions";
import dynamic from "next/dynamic";

export default async function Home({params}:any) {
  const user = await fetchUser();
  return (
    <>
      <Topbar user={user} locale={params?.locale} />
      <h1 className="text-5xl text-green-500 wrapper">Hello, Messenger!</h1>
    </>
  );
}
