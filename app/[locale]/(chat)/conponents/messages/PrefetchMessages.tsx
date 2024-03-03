import React from "react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
const Messages = dynamic(() => import("./Messages"), {
  // ssr: false,
  loading: () => <ChatLoading count={8} height={70} inline={true} radius={5} />,
});
import { allMessagesServerAction } from "@/functions/serverActions";
import dynamic from "next/dynamic";
const ChatLoading = dynamic(() => import("../ChatLoading"));
export default async function PrefetchMessages(props: any) {
  const queryClient = new QueryClient();

  if (props.chatId) {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["messages", props.chatId], //als0 give here the chat id
      queryFn: allMessagesServerAction as any,
      initialPageParam: 0,
      // staleTime: 100000 * 60,
    });
  }

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Messages />
    </HydrationBoundary>
  );
}
