import { useChatContext } from "@/context/ChatContext/ChatContextProvider";
import {
  deleteSingleChat,
  makeAsAdmin,
  removeFromAdmin,
  removeFromGroup,
} from "@/functions/chatActions";
import { updateChatStatusAsBlockOUnblock } from "@/functions/messageActions";
import { useChatStore } from "@/store/useChat";
import { useUserStore } from "@/store/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/navigation";
import { toast } from "react-toastify";

export const useBlockMutation = () => {
  const queryClient = useQueryClient();
  const { setSelectedChat, selectedChat } = useChatStore();

  return useMutation({
    mutationFn: (data: any) => updateChatStatusAsBlockOUnblock(data),
    onSuccess: (data) => {
      console.log({ data });
      toast.success(data.status);
      setSelectedChat({
        ...selectedChat,
        status: data.status,
        chatUpdatedBy: { _id: data.updatedBy },
      } as any);
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

export const useDeleteSingleChatMutation = (chatId: string, onChat: boolean) => {
  const queryClient = useQueryClient();
  const { socket } = useChatContext();
  const { setSelectedChat, selectedChat } = useChatStore();
  const router = useRouter();
  return useMutation({
    mutationFn: () => deleteSingleChat(chatId),
    onSuccess: (data) => {
      toast.success("Chat deleted successfully!");
      if (onChat || chatId === selectedChat?.chatId) {
        router.push("/Chat");
      }
      console.log({ deleteChatData: data });
      socket.emit("chatDeletedNotify", data.users);
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

///remove from greoup or leave group

export const useRemoveFromGroup = () => {
  const queryClient = useQueryClient();
  const { setSelectedChat, selectedChat } = useChatStore();
  const { currentUser } = useUserStore();
  const Router = useRouter();
  return useMutation({
    mutationFn: (removeData: { chatId: string; userId: string }) =>
      removeFromGroup(removeData),
    onSuccess: (data) => {
      // Assuming selectedChat is stored in a global state using setSelectedChat
      // If not, modify this part accordingly
      setSelectedChat({ ...selectedChat, users: data.data.users } as any);
      queryClient.invalidateQueries({ queryKey: ["messages"] });

      if (data.isAdminLeave) {
        Router.push("/Chat");
      }
    },
  });
};

///make admin

export const useMakeAdmin = () => {
  const queryClient = useQueryClient();
  const { setSelectedChat, selectedChat } = useChatStore();
  return useMutation({
    mutationFn: (addData: { chatId: string; userId: string }) => makeAsAdmin(addData),
    onSuccess: (data) => {
      console.log({ makeAdmin: data.data });
      // Assuming selectedChat is stored in a global state using setSelectedChat
      // If not, modify this part accordingly
      setSelectedChat({ ...selectedChat, groupAdmin: data.data.groupAdmin } as any);
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

///remove from admin

export const useRemoveFromAdmin = () => {
  const queryClient = useQueryClient();
  const { setSelectedChat, selectedChat } = useChatStore();
  return useMutation({
    mutationFn: (removeData: { chatId: string; userId: string }) =>
      removeFromAdmin(removeData),
    onSuccess: (data) => {
      // Assuming selectedChat is stored in a global state using setSelectedChat
      // If not, modify this part accordingly
      setSelectedChat({ ...selectedChat, groupAdmin: data.data.groupAdmin } as any);
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
