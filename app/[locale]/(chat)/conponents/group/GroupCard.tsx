import { useChatStore } from "@/store/useChat";
import useGroupStore from "@/store/useGroupStore";
import Image from "next/image";
import React from "react";

export type Tuser = {
  username: string;
  email: string;
  pic: string;
  _id: string;
  chatCreatedAt: Date;
};

const GroupCard: React.FC<{ user: Tuser; }> = ({ user}) => {
  const { setSelectedChat } = useChatStore();
  const { selectedAddGroupUsers, addAddGroupSelectUser } = useGroupStore();
  

  const handleClick = () => {
    addAddGroupSelectUser(user);
  };
  return (
    <div
      onClick={handleClick}
      className={`p-2 rounded-md  dark:text-white cursor-pointer  dark:bg-gray-700 dark:hover:bg-gray-800 bg-gray-200 hover:bg-gray-300  duration-500 ${
        selectedAddGroupUsers.some((u) => u._id === user._id) ? "!bg-emerald-300" : ""
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
