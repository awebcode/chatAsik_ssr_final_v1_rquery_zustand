import React from "react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getChatsServerAction } from "@/functions/serverActions";
import dynamic from "next/dynamic";
const MyFriends = dynamic(() => import("./MyFriends"), { ssr: false });

export default async function PrefetchMyFriends(props: any) {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["messages", "", "65ca49030f9ecfa45c90174c"], //als0 give here the chat id
    queryFn: getChatsServerAction as any,
    initialPageParam: 0,
  });

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyFriends />
    </HydrationBoundary>
  );
}
