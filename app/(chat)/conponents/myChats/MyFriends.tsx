"use client";
import React, { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useInfiniteQuery } from "@tanstack/react-query";

import dynamic from "next/dynamic";
const InfiniteScroll = dynamic(() => import("react-infinite-scroll-component"));
const FriendsCard = dynamic(() => import("./FriendsCard"));
import { getChats } from "@/functions/chatActions";
import { useUserStore } from "@/store/useUser";
import { useChatStore } from "@/store/useChat";
import { getSenderFull } from "../logics/logics";
import { useRouter, useSearchParams } from "next/navigation";
const MyFriends = () => {
  const { currentUser } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");
  const searchText = useDebounce(searchTerm, 700);
  const { setSelectedChat, selectedChat } = useChatStore();
  const { data, isFetching, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["messages", searchText, currentUser?._id],

    queryFn: getChats as any,

    getNextPageParam: (lastPage: any) => {
      const { prevOffset, total, limit } = lastPage;
      // Calculate the next offset based on the limit
      const nextOffset = prevOffset + limit;

      // Check if there are more items to fetch
      if (nextOffset >= total) {
        return;
      }

      return nextOffset;
    },
    initialPageParam: 0,
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const chats = data?.pages.flatMap((page) => page.chats);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    useChatStore.setState({ myChats: chats });
    if (selectedChat) {
      return;
    }
    if ((chats?.length as any) > 0 && !selectedChat) {
      const chat = chats?.[0];
      const chatData = {
        chatId: chat?._id,
        lastMessage: chat?.latestMessage?.content,
        createdAt: chat?.latestMessage?.createdAt,
        chatCreatedAt: chat?.createdAt,
        username: !chat.isGroupChat
          ? getSenderFull(currentUser, chat.users)?.username
          : chat.chatName,
        email: !chat.isGroupChat ? getSenderFull(currentUser, chat.users)?.email : "",
        userId: !chat.isGroupChat
          ? getSenderFull(currentUser, chat.users)?._id
          : chat._id,
        pic: !chat.isGroupChat
          ? getSenderFull(currentUser, chat.users)?.pic
          : "/vercel.svg",

        isGroupChat: chat.isGroupChat ? true : false,
        groupChatName: chat.chatName,
        groupAdmin: chat.groupAdmin,
        status: chat?.chatStatus?.status,
        chatUpdatedBy: chat?.chatStatus?.updatedBy,
        users: chat.isGroupChat ? chat.users : null,
      };
      setSelectedChat(chatData);
      router.push(`/Chat?chatId=${chat?._id}`);
    }
  }, []);

  useEffect(() => {
    const paramsChatId = searchParams.get("chatId");
    const foundChat = chats?.find((c) => c._id === paramsChatId);
    // Check if the chat has already been selected
    if (selectedChat) {
      return;
    }
    if (paramsChatId && foundChat) {
      const chatData = {
        chatId: foundChat?._id,
        lastMessage: foundChat?.latestMessage?.content,
        createdAt: foundChat?.latestMessage?.createdAt,
        chatCreatedAt: foundChat?.createdAt,
        username: !foundChat.isGroupChat
          ? getSenderFull(currentUser, foundChat.users)?.username
          : foundChat.chatName,
        email: !foundChat.isGroupChat
          ? getSenderFull(currentUser, foundChat.users)?.email
          : "",
        userId: !foundChat.isGroupChat
          ? getSenderFull(currentUser, foundChat.users)?._id
          : foundChat._id,
        pic: !foundChat.isGroupChat
          ? getSenderFull(currentUser, foundChat.users)?.pic
          : "/vercel.svg",

        isGroupChat: foundChat.isGroupChat ? true : false,
        groupChatName: foundChat.chatName,
        groupAdmin: foundChat.groupAdmin,
        status: foundChat?.chatStatus?.status,
        chatUpdatedBy: foundChat?.chatStatus?.updatedBy,
        users: foundChat.isGroupChat ? foundChat.users : null,
      };
      setSelectedChat(chatData);
      // router.push(`/Chat?chatId=${paramsChatId}`);
    }
  }, [searchParams, router]);

  return (
    <>
      <div>
        <div className="menu p-4   bg-base-200 text-base-content overflow-y-scroll">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleInputChange(e)}
            placeholder="Search Friends"
            className="shadow-lg w-full bg-blue-100 ring ring-blue-500  text-sm py-3 px-3 rounded-md text-black outline-none border-1 border-yellow-500 hover:border-yellow-500 transition-all duration-300"
          />

          <div id="customTargetFriend" style={{ height: "80vh", overflowY: "scroll" }}>
            <InfiniteScroll
              dataLength={chats ? chats?.length : 0}
              next={() => {
                fetchNextPage();
              }}
              hasMore={hasNextPage}
              loader={<div>Loading...</div>}
              endMessage={
                <p className="text-green-400">
                  <b>Yay! You have seen it all</b>
                </p>
              }
              style={{ height: "100%" }}
              scrollableTarget="customTargetFriend"
            >
              <div className="flex flex-col gap-5">
                {chats && chats.length > 0 ? (
                  chats.map((chat: any) => (
                    <FriendsCard
                      chat={chat}
                      unseenArray={data?.pages[0].unseenCountArray}
                      key={chat._id}
                    />
                  ))
                ) : (
                  <h1 className="text-sm md:text-xl m-4 text-center">No Friend Found!</h1>
                )}
              </div>
              {/* {isFetching && <h1 className="text-center p-2 text-2xl">Fetching...</h1>} */}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyFriends;
