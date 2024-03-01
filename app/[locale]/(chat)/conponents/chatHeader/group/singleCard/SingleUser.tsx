import { removeFromGroup } from "@/functions/chatActions";
import { useChatStore } from "@/store/useChat";
import useGroupStore from "@/store/useGroupStore";
import { useOnlineUsersStore } from "@/store/useOnlineUsers";
import { useUserStore } from "@/store/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import {
  useMakeAdmin,
  useRemoveFromAdmin,
  useRemoveFromGroup,
} from "../../../mutations/chatMutations";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
const Dropdown = dynamic(() => import("./Dropdown"));
import { useClickAway } from "@uidotdev/usehooks";
import dynamic from "next/dynamic";
interface Tuser {
  username: string;
  _id: string;
  pic: string;
  email: string;
}

const SingleUserCard = ({ user }: { user: Tuser }) => {
  const { selectedChat, setSelectedChat } = useChatStore();
  const { onlineUsers } = useOnlineUsersStore();
  const { currentUser } = useUserStore();
  const removeMutation = useRemoveFromGroup();
  const makeAdminMutation = useMakeAdmin();
  const removeFromAdminMutation = useRemoveFromAdmin();
  const removeHandler = (userId: string) => {
    removeMutation.mutateAsync({
      chatId: selectedChat?.chatId as any,
      userId,
    });
  };

  const makeAdminHandler = (userId: string) => {
    makeAdminMutation.mutateAsync({
      chatId: selectedChat?.chatId as any,
      userId,
    });
  };

  const removeAdminHandler = (userId: string) => {
    removeFromAdminMutation.mutateAsync({
      chatId: selectedChat?.chatId as any,
      userId,
    });
  };
  const isUserOnline = onlineUsers.some((u: any) => user._id === u.id);
  const [open, setOpen] = useState(false);
  const dropdownModalRef: any = useClickAway(() => {
    setOpen(false);
  });
  return (
    <div
      //   onClick={() => removeSelectedUser(user._id)}
      className="bg-blue-100 cursor-pointer rounded-xl p-1 flex items-center justify-between gap-1"
    >
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 relative ring-2 ring-violet-700 rounded-full">
          <Image
            height={32}
            width={32}
            className="rounded-full h-full w-full object-cover"
            alt={user.username}
            src={user.pic}
          />
          <span
            className={`absolute bottom-0 right-0 rounded-full p-[6px] ${
              isUserOnline ? "bg-green-500" : "bg-rose-500"
            }`}
          ></span>
        </div>
        <div>
          <h1 className="text-xs md:text-sm font-bold ">{user.username}</h1>
          <span className="text-[10px]">{user.email}</span>
        </div>
      </div>
      {(selectedChat?.groupAdmin || []).some(
        (admin) => admin._id === currentUser?._id
      ) && (
        <div ref={dropdownModalRef} className="relative">
          <BsThreeDotsVertical
            onClick={() => setOpen((prev) => !prev)}
            className="h-6 w-6 m-2 "
          />
          <Dropdown
            open={open}
            setOpen={setOpen}
            chatId={selectedChat?.chatId}
            removeHandler={() => removeHandler(user._id)}
            makeAdminHandler={() => makeAdminHandler(user._id)}
            removeAdminHandler={() => removeAdminHandler(user._id)}
            groupAdmin={selectedChat?.groupAdmin}
            user={user}
            // status={chat?.chatStatus?.status}
            // updatedBy={chat?.chatStatus?.updatedBy}
            currentUser={currentUser}
            // chat={chat}
          />
        </div>
        // <span
        //   className="cursor-pointer  p-[6px] bg-black rounded-full  "
        //   onClick={() => removeHandler(user._id)}
        // >
        //   <IoMdClose className="text-rose-600 h-full w-full rounded-full " />
        // </span>
      )}
    </div>
  );
};

export default SingleUserCard;
