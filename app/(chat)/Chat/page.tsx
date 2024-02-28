import React from "react";

import dynamic from "next/dynamic";
import ClientWrap from "../conponents/ClientWrap";
import PrefetchMessages from "../conponents/messages/PrefetchMessages";
import PrefetchMyFriends from "../conponents/myChats/PrefetchMyFriends";
const EmptyChat = dynamic(() => import("../conponents/EmptyChat"));
const ChatHeader = dynamic(() => import("../conponents/chatHeader/ChatHeader"), {
  ssr: false,
});
const Input = dynamic(() => import("../conponents/Input"), { ssr: false });
const Chat = dynamic(() => import("./Chat"));

const Topbar = dynamic(() => import("../conponents/Topbar"), { ssr: false });
const Drawer = dynamic(() => import("../conponents/leftsearchDrawer/Drawer"));
const GroupModal = dynamic(() => import("../../(chat)/conponents/group/Modal"));
// import PrefetchMessages from "../conponents/messages/PrefetchMessages";
// const Chat = dynamic(() => import("./Index"));
const home = ({
  params,
  searchParams,
}: {
  params: { domain: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // console.log({  searchParams });
  return (
    <div className="">
      <Chat />

      <ClientWrap>
        {/* <Topbar /> */}
        <div className="flex w-screen overflow-hidden">
          {/* <LeftSide /> */}
          <div className="basis-[40%] bg-white h-full min-h-[95vh] w-full rounded-md border-2 m-4 py-4 border-blue-800 hover:border-violet-700 transition-all duration-500">
            <Drawer />
            <GroupModal />
            <div className="h-full  overflow-auto ">
              <PrefetchMyFriends />
            </div>
          </div>
          {/* <LeftSide /> */}
          <div className=" relative p-4 w-full border-2 rounded-md border-blue-800 hover:border-violet-500 transition-all duration-500 m-3">
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
