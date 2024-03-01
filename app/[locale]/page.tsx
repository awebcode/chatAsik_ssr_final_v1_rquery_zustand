const Topbar = dynamic(() => import("./(chat)/conponents/Topbar"));
// const LanguageChanger = dynamic(() => import("@/components/LanguageChanger"), {
//   ssr: false,
// });
import { fetchUser } from "@/functions/serverActions";
import { redirect } from "@/navigation";
import dynamic from "next/dynamic";

export default async function Home() {
  const user = await fetchUser();
   if (user.statusCode === 401) {
     redirect("/register");
   }
  return (
    <>
      <Topbar user={user}  />
      <h1 className="text-3xl md:text-6xl  wrapper">Hello, Messengaria!</h1>
    </>
  );
}
