"use client";
import { useChatStore } from "@/store/useChat";
import { useOnlineUsersStore } from "@/store/useOnlineUsers";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaBeer } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { useClickAway } from "@uidotdev/usehooks";
import { MdCall, MdVideoCall } from "react-icons/md";

import dynamic from "next/dynamic";
import { useRouter } from "@/navigation";
import moment from "moment";
const GroupModal = dynamic(() => import("./group/Modal"));
const VideoCallModal = dynamic(() => import("./VideoCallModal"));
const UserModal = dynamic(() => import("./UserModal"));
const ChatHeader = () => {
  const router = useRouter();
  const { selectedChat, clearselectedChat } = useChatStore();
  const { onlineUsers } = useOnlineUsersStore();
  const [open, setOpen] = useState(false);
  const [openVideoCall, setOpenVideoCall] = useState(false);
  const isUserOnline = onlineUsers.some((u: any) => u.id === selectedChat?.userId);
  const userModalRef: any = useClickAway((e) => {
    setOpen(false);
  });

  const videoCallModalRef: any = useClickAway(() => {
    setOpenVideoCall(false);
  });

  return (
    <div className="p-4 bg-gray-200  dark:bg-gray-800  flexBetween rounded">
      <div className="flex items-center gap-2">
        <span
          className=" cursor-pointer  md:p-[6px]  rounded-full"
          onClick={() => {
            useChatStore.setState({selectedChat:null})
            clearselectedChat();
            router.replace("/Chat", undefined);
          }}
        >
          <FaArrowLeft className="h-3 md:h-4 w-3 md:w-4" />
        </span>
        {selectedChat && (
          <>
            <div className="relative  p-[2px] h-8 w-8 md:h-10 md:w-10 ring md:ring-2 ring-violet-500 rounded-full">
              <Image
                height={35}
                width={35}
                className="rounded-full object-fill h-full w-full"
                alt={selectedChat.username as any}
                src={selectedChat.pic as any}
                loading="lazy"
              />

              <span
                className={`absolute bottom-0 -right-1 rounded-full  p-[6px] ${
                  isUserOnline ? "bg-green-500" : "bg-rose-500"
                }`}
              ></span>
            </div>
            <div className="ml-1">
              <h3 className="text-xs md:text-sm font-bold ">{selectedChat.username}</h3>
              <span className="text-[10px] ">
                {isUserOnline ? (
                  <span className="text-green-500">Online</span>
                ) : (!isUserOnline &&
                    !selectedChat.isGroupChat &&
                    selectedChat?.userInfo?.lastActive) ||
                  selectedChat.createdAt ? (
                  <span className="text-[9px]">
                    <span className="mr-1">active</span>
                    {moment(
                      (selectedChat?.userInfo?.lastActive as any) ||
                        selectedChat.createdAt
                    ).fromNow()}
                  </span>
                ) : (
                    <span className="text-rose-500">Offline</span>
                  
                )}
              </span>
            </div>
          </>
        )}
      </div>
      {selectedChat && (
        <div className="flex items-center gap-4">
          <span ref={videoCallModalRef} className="cursor-pointer flex gap-2">
            <MdCall
              onClick={() => setOpenVideoCall((prev) => !prev)}
              className="h-4 w-4 md:h-6 md:w-6  cursor-pointer"
            />
            <MdVideoCall
              onClick={() => setOpenVideoCall((prev) => !prev)}
              className="h-4 w-4 md:h-6 md:w-6  cursor-pointer"
            />
            <VideoCallModal
              openVideoCall={openVideoCall}
              setOpenVideoCall={setOpenVideoCall}
              isUserOnline={isUserOnline}
            />
          </span>
          {/* check is group chat or not */}
          {selectedChat?.isGroupChat ? (
            <span ref={userModalRef} className="cursor-pointer">
              <BsThreeDots
                onClick={() => setOpen((prev) => !prev)}
                className="h-4 w-4 md:h-6 md:w-6  cursor-pointer"
              />
              <GroupModal open={open} setOpen={setOpen} onlineUsers={onlineUsers} />
            </span>
          ) : (
            <span ref={userModalRef} className="cursor-pointer">
              <BsThreeDots
                onClick={() => setOpen((prev) => !prev)}
                className="h-6 w-6  cursor-pointer"
              />
              <UserModal open={open} setOpen={setOpen} isUserOnline={isUserOnline} />
            </span>
          )}
        </div>
      )}
      {/* <div>...</div> */}
    </div>
  );
};
export default ChatHeader;
