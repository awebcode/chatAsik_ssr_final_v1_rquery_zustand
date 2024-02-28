import React from "react";
import {
  BsArchive,
  BsArrowLeft,
  BsBoxArrowLeft,
  BsCheck,
  BsLock,
  BsMicMute,
} from "react-icons/bs";
import { MdCall, MdDelete, MdVideoCall } from "react-icons/md";
import { RiProfileFill, RiProfileLine } from "react-icons/ri";

import { useUserStore } from "@/store/useUser";
import { FaUserCheck, FaUserMinus } from "react-icons/fa";
import { useChatStore } from "@/store/useChat";

const Dropdown = ({
  open,
  setOpen,
  user,
  removeHandler,
  makeAdminHandler,
  removeAdminHandler,
}: any) => {
  const { currentUser } = useUserStore();
  const { selectedChat } = useChatStore();

  const items = [
    {
      name: <span className="text-rose-500">Remove</span>,
      icon: <FaUserMinus className="text-rose-500" />,
      action: () => {
        if (confirm("Are you sure?")) {
          removeHandler();
        }
      },
      isHidden: false,
    },
    {
      name: selectedChat?.groupAdmin?.some((admin) => admin._id === user._id) ? (
        <span className="text-rose-500">Remove from admin</span>
      ) : (
        <span className="text-black">Make Admin</span>
      ),
      icon: <FaUserCheck className="text-rose-500" />,
      action: () => {
        selectedChat?.groupAdmin?.some((admin) => admin._id === user._id)
          ? removeAdminHandler()
          : makeAdminHandler();
      },
      isHidden: false,
    },
  ];

  return (
    <div>
      <ul
        className={`z-[999999] absolute right-0 w-[250px] h-auto p-2  shadow-md   bg-white rounded duration-500 ring-2 ring-violet-500 ${
          open
            ? "translate-y-1 scale-100 opacity-100 duration-300"
            : "translate-y-0 scale-0 opacity-0 duration-300"
        }`}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className={`flex items-center py-2 px-4 cursor-pointer   text-gray-900 hover:bg-gray-100 rounded duration-300 ${
              item.isHidden && "hidden"
            }`}
            onClick={item.action}
          >
            <span className="mr-2 text-xs md:text-sm">{item.icon}</span>
            <span className="text-xs md:text-sm">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
