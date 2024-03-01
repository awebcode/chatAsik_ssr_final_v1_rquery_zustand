import { Tuser } from "@/app/[locale]/(chat)/conponents/leftsearchDrawer/UserCard";
import { create } from "zustand";

type Message = {
  content: string;
  status: string;
  sender: Tuser;
  createdAt: Date; // Assuming createdAt is a string, adjust accordingly
};

interface MessageStore {
  isIncomingMessage: boolean;
  isFriendsIncomingMessage: boolean;
  messages: Message[];
  setMessage: (message: Message) => void;
}

const useMessageStore = create<MessageStore>((set) => ({
  isIncomingMessage: false,
  isFriendsIncomingMessage: false,
  messages: [],
  setMessage: (newMessage) => {
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },
}));

export default useMessageStore;
