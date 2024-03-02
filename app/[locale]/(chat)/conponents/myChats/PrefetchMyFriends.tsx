import React, { lazy, Suspense } from "react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getChatsServerAction } from "@/functions/serverActions";
import dynamic from "next/dynamic";
const ChatLoading = dynamic(() => import("../ChatLoading"));
const MyFriends = lazy(() => import("./MyFriends"));

export default async function PrefetchMyFriends(props: any) {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["messages", ""], //als0 give here the chat id
    queryFn: getChatsServerAction as any,
    initialPageParam: 0,
  });

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={<ChatLoading count={9} height={70} inline={false} radius={1} />}
      >
        <MyFriends />
      </Suspense>
    </HydrationBoundary>
  );
}
