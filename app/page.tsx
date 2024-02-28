const Topbar = dynamic(() => import("./(chat)/conponents/Topbar"));
import dynamic from "next/dynamic";

export default function Home() {
  return (
    <>
      <Topbar />
      <h1 className="text-5xl text-green-500 wrapper">Hello, Messenger!</h1>
    </>
  );
}
