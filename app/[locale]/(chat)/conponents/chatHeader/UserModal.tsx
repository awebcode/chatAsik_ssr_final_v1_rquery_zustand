import { useChatStore } from "@/store/useChat";
import Image from "next/image";
import React from "react";

import { useUserStore } from "@/store/useUser";
import {
  useBlockMutation,
  useDeleteSingleChatMutation,
} from "../mutations/chatMutations";
const UserModal = ({ open, setOpen, isUserOnline }: any) => {
  const { selectedChat, setSelectedChat } = useChatStore();
  const { currentUser } = useUserStore();
  const blockMutation = useBlockMutation();

  const deleteSignleChatMutation = useDeleteSingleChatMutation(
    selectedChat?.chatId as any,
    true
  );
  const blockHandler = () => {
    const data = {
      chatId: selectedChat?.chatId,
      status: selectedChat?.status === "blocked" ? "unblocked" : "blocked",
    };
    blockMutation.mutateAsync(data);
  };
  const deleteHandler = () => {
    if (window.confirm(`Are you sure to delete ${selectedChat?.username}?`)) {
      deleteSignleChatMutation.mutateAsync();
    }
  };
  return (
    <div
      className={`z-50 fixed max-h-screen w-full p-4 md:p-10 px-5 md:px-14  top-10 md:top-[100px] transform  dark:bg-gray-800  bg-white hover:bg-gray-200 rounded-md duration-500 ring-2 ring-violet-500   ${
        open
          ? "translate-y-1 scale-100 opacity-100 duration-300"
          : "translate-y-0 scale-0 opacity-0 duration-300"
      }`}
    >
      <div className="flex flex-col gap-6  mb-8">
        <div className="relative mx-auto block h-12 w-12 md:h-24 md:w-24 rounded-full ring-4 ring-blue-500">
          <Image
            src={selectedChat?.pic as any}
            alt={selectedChat?.username as any}
            height={100}
            width={100}
            loading="lazy"
            className="h-full w-full rounded-full"
          />
          <span
            className={`absolute bottom-0 right-0 rounded-full p-[12px] ${
              isUserOnline ? "bg-green-500" : "bg-rose-500"
            }`}
          ></span>
        </div>
        <h1 className="text-sm md:text-lg">
          Name: <span className="font-bold">{selectedChat?.username}</span>
        </h1>

        <p className="text-xs md:text-sm ">Email: {selectedChat?.email}</p>
        {selectedChat?.status === "blocked" &&
        selectedChat.chatUpdatedBy._id === currentUser?._id ? (
          <>
            {" "}
            <button
              onClick={() => blockHandler()}
              className="btn capitalize text-xs md:text-lg w-full bg-blue-500 hover:bg-blue-700"
            >
              UnBlock {selectedChat.username}
            </button>
            <button
              onClick={() => deleteHandler()}
              className="btn capitalize text-xs md:text-lg w-full my-2 bg-rose-500 hover:bg-rose-700"
            >
              Delete Chat
            </button>
          </>
        ) : selectedChat?.status === "blocked" &&
          selectedChat.chatUpdatedBy._id !== currentUser?._id ? (
          <button
            // onClick={() => blockHandler()}
            className="btn capitalize text-xs md:text-lg w-full bg-rose-500 hover:bg-rose-600"
          >
            {selectedChat.username} Blocked You!
          </button>
        ) : (
          <>
            <button
              onClick={() => blockHandler()}
              className="btn capitalize text-xs md:text-lg w-full bg-rose-500 hover:bg-rose-700"
            >
              Block {selectedChat?.username}
            </button>
            <button
              onClick={() => deleteHandler()}
              className="btn capitalize text-xs md:text-lg w-full my-2 bg-rose-500 hover:bg-rose-700"
            >
              Delete Chat
            </button>
          </>
        )}
      </div>

      <button
        className="absolute mt-5 bottom-2 right-1  btn capitalize text-xs md:text-lg"
        onClick={() => setOpen(false)}
      >
        Close
      </button>
    </div>
  );
};

export default UserModal;
