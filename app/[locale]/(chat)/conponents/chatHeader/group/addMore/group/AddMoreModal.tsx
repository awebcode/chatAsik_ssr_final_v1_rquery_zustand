"use client";
import React, { useEffect, useState } from "react";
import { useClickAway, useDebounce } from "@uidotdev/usehooks";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers } from "@/functions/authActions";
import dynamic from "next/dynamic";
const InfiniteScroll = dynamic(() => import("react-infinite-scroll-component"));
import useGroupStore from "@/store/useGroupStore";
import { toast } from "react-toastify";
import { addToGroup, createGroup } from "@/functions/chatActions";
import { IoMdClose } from "react-icons/io";
import { useChatContext } from "@/context/ChatContext/ChatContextProvider";
import { useChatStore } from "@/store/useChat";
const SingleUser = dynamic(() => import("./SingleUser"));
const GroupCard = dynamic(() => import("./GroupCard"));
const AddMoreToGroupModal = (setOpenParentGroup: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchText = useDebounce(searchTerm, 600);

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
  const { selectedGroupUsers } = useGroupStore();
  const { selectedChat } = useChatStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const clickOutsideRef: any = useClickAway(() => {
    setIsOpen(false);
  });
  useEffect(() => {
    useGroupStore.setState({ selectedGroupUsers: selectedChat?.users });
  }, []);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
    // setOpenParentGroup(false);
  };

  return (
    <div ref={clickOutsideRef}>
      <button
        onClick={toggleDrawer}
        className=" btn btn-primary drawer-button  rounded-none m-2 box-border"
      >
        +Add more to group
      </button>
      <div
        className={`fixed top-[50px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-fit max-w-md w-[200px] md:w-[400px]   transition-all duration-300 rounded-lg p-8 bg-gray-700 ring-2 ring-violet-600 z-50 ${
          isOpen
            ? " translate-y-1 scale-100 opacity-1 duration-500"
            : " translate-y-0 scale-0 opacity-0"
        }`}
      >
        <div>
          <span
            className="cursor-pointer absolute right-2 top-1  p-2 bg-white rounded-full  "
            onClick={toggleDrawer}
          >
            <IoMdClose className=" h-full w-full rounded-full " />
          </span>
          <div>
            <div className="">
              {/* Group Name */}

              {/* searching */}

              <div className="relative mt-2">
                {" "}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Enter username to search user..."
                  className="shadow-lg w-full h-auto bg-blue-100 ring ring-blue-500 text-sm py-3 px-3 rounded-md  outline-none border-1 border-yellow-500 hover:border-yellow-500 transition-all duration-300"
                />
              </div>
              {selectedGroupUsers.length > 0 && (
                <div>
                  <div className=" flex flex-wrap  items-center gap-2 p-4 m-5 overflow-y-auto max-h-40 bg-green-100 rounded-md ">
                    {selectedGroupUsers.map((user, index) => (
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
                  fetchNextPage();
                }}
                hasMore={searchText.trim() !== "" && hasNextPage}
                loader={<div>Loading...</div>}
                endMessage={
                  users &&
                  users?.length > 0 &&
                  searchText.trim() !== "" && (
                    <p className="text-green-400">
                      <b>Yay! You have seen it all</b>
                    </p>
                  )
                }
                style={{ height: "100%" }}
                scrollableTarget="targetModal"
              >
                <div className="flex flex-col gap-5">
                  {users && users?.length > 0 ? (
                    searchText.trim() !== "" &&
                    users?.map((user: any) => {
                      return (
                        <GroupCard user={user} key={user._id} setIsOpen={setIsOpen} />
                      );
                    })
                  ) : (
                    <h1 className="text-sm md:text-xl m-4 text-center">No User Found!</h1>
                  )}

                  <h1>{isFetching ? "isFetching" : ""}</h1>
                </div>
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMoreToGroupModal;
