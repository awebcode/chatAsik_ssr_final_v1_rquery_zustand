import React from "react";

import dynamic from "next/dynamic";
import ClientWrap from "../conponents/ClientWrap";
import PrefetchMessages from "../conponents/messages/PrefetchMessages";
import PrefetchMyFriends from "../conponents/myChats/PrefetchMyFriends";
import { fetchUser } from "@/functions/serverActions";
import { redirect } from "@/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import ChatLoading from "../conponents/ChatLoading";
const EmptyChat = dynamic(() => import("../conponents/EmptyChat"));
const ChatHeader = dynamic(() => import("../conponents/chatHeader/ChatHeader"), {
  ssr: false,
  loading: () => <ChatLoading count={1} height={80} inline={false} radius={10} />,
});
const Input = dynamic(() => import("../conponents/Input"), {
  ssr: false,
  loading: () => <ChatLoading count={1} height={90} inline={false} radius={10} />,
});
const Chat = dynamic(() => import("./Chat"));

// const Topbar = dynamic(() => import("../conponents/Topbar"), {
//   ssr: false,
//   loading: () => <ChatLoading count={1} height={80} inline={false} radius={5} />,
// });
const Drawer = dynamic(() => import("../conponents/leftsearchDrawer/Drawer"), {
  ssr: false,

  loading: () => <ChatLoading count={1} height={70} inline={false} radius={1} />,
});
const GroupModal = dynamic(() => import("../../(chat)/conponents/group/Modal"), {
  ssr: false,
  loading: () => <ChatLoading count={1} height={70} inline={false} radius={1} />,
});
// import PrefetchMessages from "../conponents/messages/PrefetchMessages";
// const Chat = dynamic(() => import("./Index"));


const home = async({
  params,
  searchParams,
}: {
  params: { domain: string,locale:string };
  searchParams: { [key: string]: string | string[] | undefined };
  }) => {
  unstable_setRequestLocale(params.locale);
  const user = await fetchUser();
  if (user.statusCode===401) {
   return redirect("/login")
  }
  return (
    <div className="">
      <Chat />

      <ClientWrap>
        {/* <Topbar user={user} /> */}
        <div className="flex w-screen overflow-hidden">
          {/* <LeftSide /> */}
          <div
            className={`basis-[100%] md:basis-[40%]   h-full min-h-[95vh] w-full rounded-md md:border-2 mt-2 md:m-4 py-4 md:border-blue-800 md:hover:border-violet-700 transition-all duration-500 ${
              searchParams.chatId ? "hidden md:block" : ""
            }`}
          >
            <Drawer />
            <GroupModal />
            <div className="h-full  overflow-auto   ">
              <PrefetchMyFriends />
            </div>
          </div>
          {/* <LeftSide /> */}
          <div
            className={` relative p-2 md:p-4 w-full md:border-2 md:rounded-md md:border-blue-800 md:hover:border-violet-500 transition-all duration-500 m-1 md:m-3 block ${
              !searchParams.chatId ? "hidden md:block" : ""
            }`}
          >
            {searchParams.chatId || searchParams.selectedChat ? (
              <>
                <ChatHeader />
                <PrefetchMessages chatId={searchParams.chatId} />
                <div className="absolute bottom-1 w-[96%]">
                  <Input />
                </div>
              </>
            ) : (
              <EmptyChat />
            )}
            {/* <>
              <ChatHeader />
              <PrefetchMessages chatId={searchParams.chatId} />
              <div className="absolute bottom-1 w-[96%]">
                <Input />
              </div>
            </> */}
          </div>
        </div>
      </ClientWrap>
      {/* <PrefetchMessages chatId={props.searchParams.chatId} /> */}
    </div>
  );
};

export default home;
