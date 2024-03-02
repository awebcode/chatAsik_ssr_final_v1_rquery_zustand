import useGroupStore from "@/store/useGroupStore";
import Image from "next/image";
import React from "react";
import { IoMdClose } from "react-icons/io";
interface Tuser {
  username: string;
  _id: string;
  pic: string;
  email: string;
}

const SingleUser = ({ user }: { user: Tuser }) => {
  const { removeAddSelectedUser } = useGroupStore();
  return (
    <div
       onClick={() => removeAddSelectedUser(user._id)}
      className="bg-blue-200 cursor-pointer rounded-xl p-1 flex items-center justify-between gap-[2px]"
    >
      <div className="relative h-4 w-4">
        <Image
          height={25}
          width={25}
          className="rounded-full object-fill h-full w-full"
          alt={user.username as any}
          src={user.pic as any}
        />
      </div>
      <span className="text-[10px]">{user.username as any}</span>
      <span className="cursor-pointer p-2" onClick={() => removeAddSelectedUser(user._id)}>
        <IoMdClose className="text-gray-200 h-3 w-3 rounded-full bg-blue-500" />
      </span>
    </div>
  );
};

export default SingleUser;
