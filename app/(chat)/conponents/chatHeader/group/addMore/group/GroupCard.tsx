import { addToGroup } from "@/functions/chatActions";
import { useChatStore } from "@/store/useChat";
import useGroupStore from "@/store/useGroupStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

export type Tuser = {
  username: string;
  email: string;
  pic: string;
  _id: string;
  chatCreatedAt: Date;
};

const GroupCard: React.FC<{ user: Tuser; setIsOpen: any }> = ({ user, setIsOpen }) => {
  const { selectedChat } = useChatStore();
  const { selectedGroupUsers, addGroupSelectUser } = useGroupStore();
  const queryclient = useQueryClient();
   const addgroupMutaion = useMutation({
     mutationFn: (data: any) => addToGroup(data),
     onSuccess: (data) => {
       toast.success("added  successfully!");
       queryclient.invalidateQueries({ queryKey: ["messages"] });
     },
   });
 

  const handleClick = () => {
    addGroupSelectUser(user);
     const groupData = {
       userId: user._id,
       chatId: selectedChat?.chatId,
     };
     addgroupMutaion.mutateAsync(groupData);
  };
  return (
    <div
      onClick={handleClick}
      className={`p-2 rounded-md  text-gray-900 cursor-pointer  bg-violet-300  duration-500 ${
        selectedGroupUsers.some((u) => u._id === user._id) ? "!bg-emerald-300" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 relative ring-2 ring-violet-700 rounded-full">
          <Image
            height={32}
            width={32}
            className="rounded-full h-full w-full object-cover"
            alt={user.username}
            src={user.pic}
          />
        </div>
        <div>
          <h3 className="text-xs md:text-sm font-bold">{user.username}</h3>
          <span className="text-[10px]">{user.email}</span>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
