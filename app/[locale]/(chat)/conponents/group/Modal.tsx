"use client";
import React, { useState } from "react";
import { useClickAway, useDebounce } from "@uidotdev/usehooks";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers } from "@/functions/authActions";
import dynamic from "next/dynamic";
const InfiniteScroll = dynamic(() => import("react-infinite-scroll-component"));
import useGroupStore from "@/store/useGroupStore";
import { toast } from "react-toastify";
import { createGroup } from "@/functions/chatActions";
import { IoMdClose } from "react-icons/io";
import { useChatContext } from "@/context/ChatContext/ChatContextProvider";
import { useChatStore } from "@/store/useChat";
import { getSenderFull } from "../logics/logics";
import { useUserStore } from "@/store/useUser";
import { useRouter } from "@/navigation";
const SingleUser = dynamic(() => import("./SingleUser"));
const GroupCard = dynamic(() => import("./GroupCard"));
const GroupModal = () => {
  const { socket } = useChatContext();
  const queryclient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const searchText = useDebounce(searchTerm, 600);
  const { setSelectedChat } = useChatStore();
  const { currentUser } = useUserStore();
  const router = useRouter();
  const groupMutaion = useMutation({
    mutationFn: (data: any) => createGroup(data),
    onSuccess: (chat) => {
      console.log({ groupMutaion: chat });
      toast.success("Group created successfully!");
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
        groupChatName: chat.chatName,
        isGroupChat: chat.isGroupChat,
        groupAdmin: chat.groupAdmin,
        status: chat?.chatStatus?.status,
        chatUpdatedBy: chat?.chatStatus?.updatedBy,
        users: chat.isGroupChat ? chat.users : null,
      };
      setSelectedChat(chatData);
      queryclient.invalidateQueries({ queryKey: ["messages"] });
      router.push(`/Chat?chatId=${chat._id}`);
    },
  });
  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["messages", searchText, "onGroupsearch"],
    queryFn: getAllUsers as any,
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

  const users = data?.pages.flatMap((page) => page?.users);
  const { selectedAddGroupUsers } = useGroupStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const clickOutsideRef: any = useClickAway((e) => {
    setIsOpen(false);
  });

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const [groupName, setGroupName] = useState("");
  const createGroupHandler = () => {
    if (selectedAddGroupUsers.length < 2 && groupName.trim() === "") {
      return;
    }

    const userIds = selectedAddGroupUsers.map((user: any) => user._id);
    socket.emit("groupCreatedNotify", userIds);
    const groupData = {
      users: userIds,
      name: groupName,
    };
    groupMutaion.mutateAsync(groupData);
  };

  return (
    <div ref={clickOutsideRef}>
      <button
        onClick={toggleDrawer}
        className=" btn btn-primary drawer-button w-full rounded-none my-1 box-border"
      >
        +Create Group
      </button>
      <div
        className={`fixed top-[50px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-fit min-h-max w-auto max-w-md   transition-all duration-300 rounded-lg p-8 bg-gray-700 ring-2 ring-violet-600 z-50 ${
          isOpen
            ? " translate-y-1 scale-100 opacity-1 duration-500"
            : " translate-y-0 scale-0 opacity-0"
        }`}
      >
        <div>
          <span
            className="cursor-pointer absolute right-2 top-2  p-2 bg-white rounded-full  "
            onClick={toggleDrawer}
          >
            <IoMdClose className=" h-full w-full rounded-full " />
          </span>
          <div>
            <div className="">
              {/* Group Name */}
              <div className="relative mb-5">
                <label className="" htmlFor="Group">
                  Group Name:
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Group Name."
                  className="shadow-lg w-full h-auto bg-blue-100 ring ring-blue-500 text-sm py-3 px-3 rounded-md  outline-none border-1 border-yellow-500 hover:border-yellow-500 transition-all duration-300"
                />
                <button
                  disabled={selectedAddGroupUsers.length < 2}
                  className="absolute right-1 top-[25px] bg-blue-600 btn m-1 text-xs rounded-md p-[8px] capitalize "
                  onClick={() => createGroupHandler()}
                >
                  +Create
                </button>
              </div>

              {/* searching */}

              <div className="relative">
                {" "}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter username to search user..."
                  className="shadow-lg w-full h-auto bg-blue-100 ring ring-blue-500 text-sm py-3 px-3 rounded-md  outline-none border-1 border-yellow-500 hover:border-yellow-500 transition-all duration-300"
                />
              </div>
              {selectedAddGroupUsers.length > 0 && (
                <div>
                  <div className=" flex flex-wrap  items-center gap-2 p-4 m-5 overflow-y-auto max-h-40 bg-green-100 rounded-md ">
                    {selectedAddGroupUsers.map((user, index) => (
                      <SingleUser user={user} key={index} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div id="targetModal" className="max-h-[300px] mt-2 w-full overflow-y-scroll">
              <InfiniteScroll
                dataLength={users ? users?.length : 0}
                next={() => {
                  console.log("next call");
                  fetchNextPage();
                }}
                hasMore={searchText.trim() !== "" && hasNextPage}
                loader={<div>Loading...</div>}
                endMessage={
                  <p className="text-green-400">
                    <b>Yay! You have seen it all</b>
                  </p>
                }
                style={{ height: "100%" }}
                scrollableTarget="targetModal"
              >
                <div className="flex flex-col gap-3">
                  {users && users?.length > 0 ? (
                    searchText.trim() !== "" &&
                    users?.map((user: any) => {
                      return <GroupCard user={user} key={user._id} />;
                    })
                  ) : (
                    <h1 className="text-sm md:text-xl m-4 text-center">No User Found!</h1>
                  )}
                </div>
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;
