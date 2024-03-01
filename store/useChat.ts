// userStore.ts

import { Tuser } from "@/app/[locale]/(chat)/conponents/leftsearchDrawer/UserCard";
import { create } from "zustand";

interface ChatData {
  chatId?: string;
  lastMessage?: string;
  createdAt?: Date;
  username?: string;
  email?: string;
  userId?: string;
  pic?: string;
  isGroupChat: boolean;
  groupChatName: string;
  userInfo: Tuser;
  groupAdmin?: Tuser[];
  users: Tuser[];
  status?: string;
  chatUpdatedBy: Tuser;
}

interface UserStore {
  myChats: ChatData[]|null;
  selectedChat: ChatData | null;
  setSelectedChat: (user: ChatData) => void;
  clearselectedChat: () => void;
}

export const useChatStore = create<UserStore>((set) => ({
  selectedChat: null,
  myChats:null,
  setSelectedChat: (user) => set({ selectedChat: user }),
  clearselectedChat: () => set({ selectedChat: null }),
}));
