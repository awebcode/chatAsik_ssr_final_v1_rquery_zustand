import React, { useEffect, useState } from "react";
import { Tuser } from "../leftsearchDrawer/UserCard";
import { useUserStore } from "@/store/useUser";
import Image from "next/image";
import { BsReply, BsThreeDotsVertical } from "react-icons/bs";
import { useClickAway } from "@uidotdev/usehooks";
import useEditReplyStore from "@/store/useEditReply";
import { useChatStore } from "@/store/useChat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  updateAllMessageStatusAsRemove,
  updateAllMessageStatusAsUnsent,
} from "@/functions/messageActions";
import { useChatContext } from "@/context/ChatContext/ChatContextProvider";
import { MdOutlineEmojiEmotions } from "react-icons/md";

import { useAddRemoveReactionMutation } from "../mutations/messageMutations";
import dynamic from "next/dynamic";
import { RenderStatus } from "../logics/RenderStatusComponent";
import { useOnlineUsersStore } from "@/store/useOnlineUsers";
// const ChatLoading = dynamic(() => import("../ChatLoading"));
const Content = dynamic(() => import("./Content"));

const EmojiReactModal = dynamic(() => import("./EmojiReactModal"));
type TMessage = {
  _id: string;
  content: string;
  status: string;
  sender: Tuser;
  isEdit: any;
  isReply: any;
  createdAt: Date; // Assuming createdAt is a string, adjust accordingly
  updatedAt: Date;
  removedBy: string;
  reactions: any[];
  image: { url: string };
};

const MessageCard = ({ message }: { message: TMessage }) => {
  const { onEdit, onReply } = useEditReplyStore();
  const { currentUser } = useUserStore();
  const { selectedChat } = useChatStore();
  const [openReactModal, setOpenReactModal] = useState(false);
  const [isReactionListModal, setReactionListVisible] = useState(false);
  const [openEmojiModal, setOpenEmojiModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState("");
  const { socket } = useChatContext();
  const { onlineUsers } = useOnlineUsersStore();
  const modalRef: any = useClickAway(() => {
    setOpen(false);
  });
  const reactModalRef: any = useClickAway(() => {
    setOpenReactModal(false);
  });
  const emojiModalRef: any = useClickAway(() => {
    setOpenEmojiModal(false);
  });

  const reactionListModalRef: any = useClickAway(() => {
    setReactionListVisible(false);
  });

  const isCurrentUserMessage = message?.sender?._id === currentUser?._id;
  const queryclient = useQueryClient();
  const unsentmutation = useMutation({
    mutationFn: (data) => updateAllMessageStatusAsUnsent(data),
    // mutationKey: ["messages"],
    onSuccess: (data) => {
      const socketData = {
        senderId: currentUser?._id,
        receiverId: selectedChat?.userId,
        chatId: selectedChat?.chatId,

        pic: currentUser?.pic,
        createAt: data.createdAt,
        isGroupChat: selectedChat?.isGroupChat,
      };
      socket.emit("sentMessage", socketData);
      // toast.success("Message Unsent!");
      setOpen(false);
      queryclient.invalidateQueries({
        queryKey: ["messages"],
      });
    },
  });

  const removemutation = useMutation({
    mutationFn: (data) => updateAllMessageStatusAsRemove(data),
    // mutationKey: ["messages"],
    onSuccess: (data) => {
      console.log({ data });
      const socketData = {
        senderId: currentUser?._id,
        receiverId: selectedChat?.userId,
        chatId: selectedChat?.chatId,

        pic: currentUser?.pic,
        createAt: data.createdAt,
        isGroupChat: selectedChat?.isGroupChat,
      };
      socket.emit("sentMessage", socketData);
      // toast.success("Message Removed!");
      setOpen(false);
      queryclient.invalidateQueries({
        queryKey: ["messages"],
      });
    },
  });
  const removeHandler = (id: string) => {
    const data = { status: "remove", messageId: id, chatId: selectedChat?.chatId };
    removemutation.mutateAsync(data as any);
  };
  const removeFromAllHandler = (id: string) => {
    const data = { status: "removeFromAll", messageId: id, chatId: selectedChat?.chatId };
    removemutation.mutateAsync(data as any);
  };
  const unsentHandler = (id: string) => {
    const data = { status: "unsent", messageId: id, chatId: selectedChat?.chatId };
    unsentmutation.mutateAsync(data as any);
  };

  const BackRemoveFromAllHandler = (id: string) => {
    const data = {
      status: "reBack",
      messageId: id,
      chatId: selectedChat?.chatId,
    };
    removemutation.mutateAsync(data as any);
  };
  useEffect(() => {
    if (removemutation.isError && removemutation.error) {
      toast.error((removemutation.error as any)?.response?.data?.message);
    }

    if (unsentmutation.isError && unsentmutation.error) {
      toast.error((unsentmutation.error as any)?.response?.data?.message);
    }

    return () => {
      // Cleanup: Reset error states when the component unmounts
      removemutation.reset();
      unsentmutation.reset();
    };
  }, [removemutation.isError, unsentmutation.isError, toast]);
  //reactiions
  const addRemoveReactionMutation = useAddRemoveReactionMutation();
  const onEmojiClick = (e: any, messageId: string) => {
    setCurrentEmoji(e.emoji);
    const reactionData = {
      type: "add",
      messageId: messageId,
      emoji: e.emoji,
    };
    addRemoveReactionMutation.mutateAsync(reactionData);
  };

  const handleRemoveReact = (id: string) => {
    const reactionData = {
      type: "remove",
      reactionId: id,
    };
    addRemoveReactionMutation.mutateAsync(reactionData);
  };
  const isUserOnline = onlineUsers.some((u: any) =>
    selectedChat?.isGroupChat
      ? selectedChat?.users.some((user: any) => user._id === u.id)
      : selectedChat?.userId === u.id
  );
  return (
    <div
      className={`flex ${
        isCurrentUserMessage ? "justify-end " : "justify-start"
      } mb-4 py-10`}
    >
      <div
        className={`flex items-end ${
          isCurrentUserMessage ? "flex-row-reverse" : "flex-row"
        } space-x-2`}
      >
        {message?.sender?._id === currentUser?._id ? (
          RenderStatus(message, "onMessage", 0, currentUser)
        ) : (
          <div className="h-8 w-8 relative">
            <Image
              height={35}
              width={35}
              className="rounded-full h-full w-full object-cover"
              alt={message?.sender?.username as any}
              src={message?.sender?.pic as any}
            />
            <span
              className={`absolute bottom-0 right-0 rounded-full p-[4px] ${
                isUserOnline ? "bg-green-500" : "bg-rose-500"
              }`}
            ></span>
          </div>
        )}

        <div className=" ">
          <div
            className={`flex items-center ${
              !isCurrentUserMessage ? "flex-row-reverse" : "flex-row"
            } gap-[6px]`}
          >
            {/* {message.status !== "unsent" && message.removedBy !== currentUser?._id && ( */}
            <>
              {" "}
              <span className="relative" ref={modalRef}>
                {message.status !== "unsent" && (
                  <BsThreeDotsVertical
                    onClick={() => setOpen((prev) => !prev)}
                    className=" h-5 w-5 cursor-pointer"
                  />
                )}

                <div
                  className={`modal absolute ${
                    !isCurrentUserMessage ? "left-[0px] -top-24" : "-left-[150px] -top-36"
                  }   w-[140px]  bg-gray-200 dark:bg-gray-800  p-3 rounded-lg duration-300 transition-transform ${
                    open
                      ? "translate-y-1 scale-100 opacity-100"
                      : "translate-y-0 scale-0 opacity-0"
                  }`}
                >
                  <ul className="flex flex-col gap-1">
                    {isCurrentUserMessage && (
                      <a
                        onClick={() => {
                          onEdit(message as any);
                          setOpen(false);
                        }}
                        className=" text-xs hover:bg-gray-300  p-[6px] duration-300  rounded"
                      >
                        Edit
                      </a>
                    )}
                    {message.status !== "remove" ? (
                      <>
                        <a
                          onClick={() => removeHandler(message._id)}
                          className=" text-[10px] md:text-xs hover:bg-gray-300  p-[6px] duration-300  rounded"
                        >
                          Remove
                        </a>
                        <a
                          onClick={() => removeFromAllHandler(message._id)}
                          className="text-[10px] md:text-xs hover:bg-gray-300  p-[6px] duration-300  rounded"
                        >
                          Remove from all
                        </a>
                      </>
                    ) : (
                      <a
                        onClick={() => BackRemoveFromAllHandler(message._id)}
                        className="text-[10px] md:text-xs hover:bg-gray-300  p-[6px] duration-300  rounded"
                      >
                        Back Message
                      </a>
                    )}

                    {isCurrentUserMessage && (
                      <a
                        onClick={() => unsentHandler(message._id)}
                        className=" text-[10px] md:text-xs hover:bg-gray-300  p-[6px] duration-300  rounded"
                      >
                        Unsent
                      </a>
                    )}
                  </ul>
                </div>
              </span>
              {message.status !== "unsent" && message.status !== "remove" && (
                <>
                  {" "}
                  <span>
                    <BsReply
                      onClick={() => {
                        onReply(message as any);
                        setOpen(false);
                      }}
                      className={` h-4 w-4 md:h-[18px] md:w-[18px] cursor-pointer`}
                    />
                  </span>
                  {/* Emoji reaction start */}
                  <div ref={reactModalRef} className="relative">
                    <span>
                      <MdOutlineEmojiEmotions
                        onClick={() => setOpenReactModal((prev) => !prev)}
                        className={`h-4 w-4 md:h-[18px] md:w-[18px] mr-1 cursor-pointer ${openReactModal?"text-blue-500":""}`}
                      />
                    </span>
                    {/* Emoji Modal */}

                    <EmojiReactModal
                      message={message}
                      openReactModal={openReactModal}
                      setOpenReactModal={setOpenReactModal}
                      onEmojiClick={onEmojiClick}
                      emojiModalRef={emojiModalRef}
                      openEmojiModal={openEmojiModal}
                      setOpenEmojiModal={setOpenEmojiModal}
                      isCurrentUserMessage={isCurrentUserMessage}
                    />
                  </div>
                  {/* Emoji reaction end */}
                </>
              )}
            </>
            {/* )} */}
            {/* Content Component start */}
            <Content
              message={message}
              currentUser={currentUser}
              selectedChat={selectedChat}
              isCurrentUserMessage={isCurrentUserMessage}
              handleRemoveReact={handleRemoveReact}
              isReactionListModal={isReactionListModal}
              setReactionListVisible={setReactionListVisible}
              reactionListModalRef={reactionListModalRef}
            />
            {/* Content Component end */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
