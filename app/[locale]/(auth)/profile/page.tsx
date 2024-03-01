import { BaseUrl } from "@/config/BaseUrl";
import { fetchUser } from "@/functions/serverActions";
import Image from "next/image";
import React from "react";

const UserProfile = async () => {
  const user = await fetchUser();
  return (
    <div className="container bg-gray-200 mt-10 p-8 rounded-md shadow-md max-w-md mx-auto ring-4 ring-violet-500 duration-300 hover:ring-yellow-400">
      <Image
        src={user.pic}
        alt={`${user.username}'s avatar`}
        className="w-20 h-20 rounded-full mx-auto mb-4"
        height={80}
        width={80}
        loading="lazy"
      />
      <h2 className="text-2xl font-bold text-center text-gray-800">{user.username}</h2>
      <p className="text-sm text-gray-600 text-center mb-4">{user.email}</p>
      <div className="flex justify-center space-x-2">
        <button className="bg-blue-500 hover:bg-blue-600  px-4 py-2 rounded-md">
          Follow
        </button>
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md">
          Message
        </button>
      </div>
    </div>
  );
};
export default UserProfile;
