"use server";
import { BaseUrl } from "@/config/BaseUrl";
import axios from "axios";
import { cookies } from "next/headers";
export const getChatsServerAction = async ({
  queryKey = "",
  pageParam = 0,
}: {
  pageParam: any;
  queryKey: any;
}) => {
  const { data } = await axios.get(
    `${BaseUrl}/fetchChats/${queryKey[2]}?search=${
      queryKey[1]
    }&skip=${pageParam}&limit=${10}`,
    {
      headers: {
        "Content-Type": "application/json",
         Cookie: `authToken=${cookies().get("authToken")?.value};`,
      },
      withCredentials: true,
    }
  );
  return { ...data, prevOffset: pageParam, skip: pageParam };
};


//all messages server action

//all Messages
export const allMessagesServerAction = async ({
  queryKey = "",
  pageParam = 0,
}: {
  pageParam: any;
  queryKey: any;
  }) => {
  const { data } = await axios.get(
    `${BaseUrl}/allMessages/${queryKey[1]}?skip=${pageParam}&limit=${10}`,
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: `authToken=${cookies().get("authToken")?.value};`,
      },
      withCredentials: true,
    }
  );
  return { ...data, prevOffset: pageParam, skip: pageParam };
};