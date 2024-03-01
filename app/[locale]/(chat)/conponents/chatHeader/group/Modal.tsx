"use client";
import React, { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import useGroupStore from "@/store/useGroupStore";
import { toast } from "react-toastify";
import { renameGroup } from "@/functions/chatActions";
import { useChatStore } from "@/store/useChat";
import SingleUserCard from "./singleCard/SingleUser";
import { IoMdClose } from "react-icons/io";
import { useUserStore } from "@/store/useUser";
import { useRemoveFromGroup } from "../../mutations/chatMutations";
import AddMoreModal from "./addMore/group/AddMoreModal";
import AddMoreToGroupModal from "./addMore/group/AddMoreModal";
const SingleUser = dynamic(() => import("./singleCard/SingleUser"));
const GroupCard = dynamic(() => import("./GroupCard"));
const GroupModal = ({
  open: isOpen,
  setOpen: setIsOpen,
  onlineUsers,
}: {
  open: any;
  setOpen: any;
  onlineUsers: any;
}) => {
  const queryclient = useQueryClient();
  const { selectedChat } = useChatStore();
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useUserStore();
  const searchText = useDebounce(searchTerm, 600);
  const renameGroupMutaion = useMutation({
    mutationFn: (data: { chatId: string; chatName: string }) => renameGroup(data),
    onSuccess: (data) => {
      console.log({ groupMutaion: data });
      toast.success("Change group  name successfully!");
      queryclient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const { selectedGroupUsers } = useGroupStore();

  const [groupName, setGroupName] = useState(selectedChat?.groupChatName || "");
  const renameGroupHandler = () => {
    if (groupName.trim() === "") {
      return;
    }

    const data = {
      chatId: selectedChat?.chatId as any,
      chatName: groupName,
    };
    renameGroupMutaion.mutateAsync(data);
  };
  //leaveHandler
  const leaveMutation = useRemoveFromGroup();
  const leaveHandler = (userId: string) => {
    console.log("click");
    leaveMutation.mutateAsync({
      chatId: selectedChat?.chatId as any,
      userId,
    });
  };
  return (
    <div>
      <div
        className={`fixed top-[50px] left-[60%] transform -translate-x-1/2 -translate-y-1/2 max-h-fit  max-w-md   transition-all duration-300 rounded-lg p-8 bg-gray-700 ring-2 ring-violet-600 z-50 ${
          isOpen
            ? "translate-y-1 scale-100 opacity-1 "
            : "translate-y-0 scale-0 opacity-0"
        }`}
      >
        <div>
          <span
            className="cursor-pointer absolute right-2 top-2  p-2 bg-white rounded-full  "
            onClick={() => setIsOpen(false)}
          >
            <IoMdClose className=" h-full w-full rounded-full " />
          </span>

          <div>
            <div className="">
              {/* Group Name */}
              <div className="relative mb-5">
                <label className="" htmlFor="Group">
                  Rename Group:
                </label>
                <input
                  disabled={(selectedChat?.groupAdmin || []).some(
                    (admin) => admin._id === currentUser?._id
                  )}
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Group Name."
                  className="shadow-lg w-full h-auto bg-blue-100 ring ring-blue-500 text-sm py-3 px-3 rounded-md  outline-none border-1 border-yellow-500 hover:border-yellow-500 transition-all duration-300"
                />
                <button
                  className={`absolute cursor-pointer right-1 top-[25px] bg-blue-600 btn m-1 text-xs rounded-md p-[8px] capitalize ${
                    (selectedChat?.groupAdmin || []).some(
                      (admin) => admin._id === currentUser?._id
                    )
                      ? "block"
                      : "hidden"
                  }`}
                  onClick={() => renameGroupHandler()}
                >
                  +Rename
                </button>

                {/* Add to group modal */}
                {(selectedChat?.groupAdmin || []).some(
                  (admin) => admin._id === currentUser?._id
                ) && <AddMoreToGroupModal setOpenParentGroup={setIsOpen} />}
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
            </div>
            <div id="targetModal" className="max-h-[300px] mt-2 w-full overflow-y-scroll">
              <div className="flex flex-col gap-5">
                {selectedChat?.users && selectedChat?.users?.length > 0 ? (
                  selectedChat?.users?.map((user: any) => {
                    return <SingleUserCard user={user} key={user._id} />;
                  })
                ) : (
                  <h1 className="text-sm md:text-xl m-4 text-center">
                    No Members Found!
                  </h1>
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            leaveHandler(currentUser?._id as any);
            console.log("clicked leave button");
          }}
          className="my-2 btn bg-red-600 hover:bg-rose-500 float-right"
        >
          Leave Group
        </button>
      </div>
    </div>
  );
};

export default GroupModal;
