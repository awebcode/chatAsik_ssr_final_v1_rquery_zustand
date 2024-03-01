import { useChatContext } from "@/context/ChatContext/ChatContextProvider";
import { accessChats } from "@/functions/chatActions";
import { useChatStore } from "@/store/useChat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { getSenderFull } from "../logics/logics";
import { useUserStore } from "@/store/useUser";
import { useRouter } from "@/navigation";

export type Tuser = {
  username: string;
  email: string;
  pic: string;
  _id: string;
  lastActive: Date;
  chatCreatedAt: Date;
};

const UserCard: React.FC<{ user: Tuser; setIsOpen: any }> = ({ user, setIsOpen }) => {
  const { setSelectedChat } = useChatStore();
  const Router = useRouter();
  const { socket } = useChatContext();
  const { currentUser } = useUserStore();
  const queryclient = useQueryClient();
  const mutaion = useMutation({
    mutationFn: (data) => accessChats(data),
    onSuccess: (chat) => {
      // const chatData = {
      //   chatId: data?._id,
      //   chatCreatedAt: data?.createdAt,
      //   username: user?.username,
      //   email: user?.email,
      //   userId: user?._id,
      //   pic: user?.pic,
      // };

      const chatData = {
        chatId: chat?._id,
        lastMessage: chat?.latestMessage?.content,
        createdAt: chat?.latestMessage?.createdAt,
        chatCreatedAt: chat?.createdAt,
        username: !chat?.isGroupChat
          ? getSenderFull(currentUser, chat.users)?.username
          : chat.chatName,
        email: !chat?.isGroupChat ? getSenderFull(currentUser, chat.users)?.email : "",
        userId: !chat?.isGroupChat
          ? getSenderFull(currentUser, chat.users)?._id
          : chat?._id,
        pic: !chat.isGroupChat
          ? getSenderFull(currentUser, chat.users)?.pic
          : "/vercel.svg",
        groupChatName: chat?.chatName,
        isGroupChat: chat?.isGroupChat,
        groupAdmin: chat?.groupAdmin,
        status: chat?.chatStatus?.status,
        chatUpdatedBy: chat?.chatStatus?.updatedBy,
        users: chat.isGroupChat ? chat.users : null,
        userInfo: {
          lastActive: !chat.isGroupChat
            ? getSenderFull(currentUser, chat.isGroupChat.users)?.lastActive
            : "",
        } as any,
      };
      setSelectedChat(chatData as any);
      socket.emit("chatCreatedNotify", { to: user?._id });
      queryclient.invalidateQueries({ queryKey: ["messages"] });
      setIsOpen(false);

      Router.push(`/Chat?chatId=${chat._id}`);
    },
  });

  const handleClick = () => {
    mutaion.mutateAsync(user._id as any);
  };

  return (
    <div
      onClick={handleClick}
      className="p-3 rounded-md  cursor-pointer   hover:bg-violet-300 duration-300"
    >
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 relative">
          <Image
            height={35}
            width={35}
            className="rounded-full h-full w-full object-cover"
            alt={user.username}
            src={user.pic}
          />
        </div>
        <div>
          <h3 className="text-xs md:text-sm">{user.username}</h3>
          <span className="text-xs">Last Message</span>
          <span className="text-xs">Time</span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
