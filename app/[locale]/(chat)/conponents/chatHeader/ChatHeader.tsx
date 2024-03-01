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
          className=" cursor-pointer p-[6px] bg-blue-500 rounded-full"
          onClick={() => {
            router.push("/Chat");
            //  clearselectedChat();
          }}
        >
          <FaArrowLeft className="h-3 w-3" />
        </span>
        {selectedChat && (
          <>
            <div className="relative p-[2px] h-10 w-10 ring-2 ring-violet-600 rounded-full">
              <Image
                height={35}
                width={35}
                className="rounded-full object-fill h-full w-full"
                alt={selectedChat.username as any}
                src={selectedChat.pic as any}
              />

              <span
                className={`absolute bottom-0 right-0 rounded-full p-[6px] ${
                  isUserOnline ? "bg-green-500" : "bg-rose-500"
                }`}
              ></span>
            </div>
            <div className="">
              <h3 className="text-xs md:text-sm ">{selectedChat.username}</h3>
              <span className="text-xs ">
                {isUserOnline ? (
                  <span className="text-green-500">Online</span>
                ) : (
                  <span className="text-rose-500">Offline</span>
                )}
              </span>
              {!isUserOnline &&
              !selectedChat.isGroupChat &&
              selectedChat?.userInfo?.lastActive ? (
                <span className="text-[9px]">
                  active: {selectedChat?.userInfo?.lastActive as any}
                  {moment(selectedChat?.userInfo?.lastActive as any)
                    .startOf("hour")
                    .fromNow()}{" "}
                  ago
                </span>
              ) : (
                ""
              )}
            </div>
          </>
        )}
      </div>
      {selectedChat && (
        <div className="flex items-center gap-4">
          <span ref={videoCallModalRef} className="cursor-pointer flex gap-2">
            <MdCall
              onClick={() => setOpenVideoCall((prev) => !prev)}
              className="h-6 w-6  cursor-pointer"
            />
            <MdVideoCall
              onClick={() => setOpenVideoCall((prev) => !prev)}
              className="h-6 w-6  cursor-pointer"
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
                className="h-6 w-6  cursor-pointer"
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
