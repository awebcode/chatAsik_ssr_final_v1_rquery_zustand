"use client";
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react").then((module) => {
      return module.default || module;
    });
  },
  { ssr: false }
);
import { Theme, EmojiStyle, SuggestionMode, Emoji } from "emoji-picker-react";
import { useClickAway } from "@uidotdev/usehooks";
import { useChatContext } from "@/context/ChatContext/ChatContextProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editMessage, replyMessage, sentMessage } from "@/functions/messageActions";
import { useChatStore } from "@/store/useChat";
import { useUserStore } from "@/store/useUser";
import { useTypingStore } from "@/store/useTyping";
import TypingIndicatot from "./TypingIndicator";
import useEditReplyStore from "@/store/useEditReply";
import { IoMdClose, IoMdPhotos } from "react-icons/io";
import { MdAddAPhoto, MdOutlineKeyboardVoice } from "react-icons/md";
import { RiEmojiStickerLine } from "react-icons/ri";
import ChatStatus from "./ChatStatus";
import AudioVoice from "./audioVoice/Voice";
import ImageMessage from "./imageMess/ImageMessage";
import { LuSendHorizonal } from "react-icons/lu";
import { useMediaQuery } from "@uidotdev/usehooks";
import useIncomingMessageStore from "@/store/useIncomingMessage";
import { useMessageStore } from "@/store/useMessage";
type Tmessage = {
  message: string | any;
};
type Temoji = {
  emoji: string;
  unified: string;
};
const Input = () => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { selectedChat } = useChatStore();
  const { socket } = useChatContext();
  const { currentUser } = useUserStore();
  const [message, setMessage] = useState<Tmessage>({ message: "" });
  const [openEmoji, setOpenEmoji] = useState(false);
  const { isIncomingMessage } = useIncomingMessageStore();
  const { setInitialMessage } = useMessageStore();
  const [openImageModal, setOpenImageModal] = useState(false);
  const { isTyping, content: typingContent, chatId: typingChatId } = useTypingStore();
  const { cancelEdit, cancelReply, isEdit, isReply, isSentImageModalOpen } =
    useEditReplyStore();
  //clickOutside
  const clickRef: any = useClickAway(() => setOpenEmoji(false));
  const clickImageModalRef: any = useClickAway(() => setOpenImageModal(false));
  //change message
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMessage((prev) => ({ ...prev, [name]: value }));
  };
  //emoji click
  // const onEmojiClick = (e: Temoji) => {

  //   setMessage((prev) => ({ ...prev, message: prev.message + e.emoji }));
  // };
  const [emojiValue, setemojiValue] = useState("");
  // Function to handle emoji click
  const emojiRef = useRef<HTMLSpanElement>(null);

  const onEmojiClick = (e: Temoji) => {
    // Render the Emoji component and get its value
    setemojiValue(e.unified);

    // Append the value of the Emoji component to the message
    setMessage((prev) => ({
      ...prev,
      message: prev.message + e.emoji,
    }));
  };

  // Function to render the Emoji component and get its value

  const timerRef = useRef<any | null>(null);
  useEffect(() => {
    if (message.message.trim() !== "") {
      socket.emit("startTyping", {
        content: message.message,
        chatId: selectedChat?.chatId,
        senderId: currentUser?._id,
        receiverId: selectedChat?.userId,
        isGroupChat: selectedChat?.isGroupChat,
        groupChatId: selectedChat?.isGroupChat ? selectedChat.chatId : null,
      });
    } else {
      if (message.message.trim() === "") {
        socket.emit("stopTyping", {
          content: message.message,
          chatId: selectedChat?.chatId,
          senderId: currentUser?._id,
          receiverId: selectedChat?.userId,
          isGroupChat: selectedChat?.isGroupChat,
          groupChatId: selectedChat?.isGroupChat ? selectedChat.chatId : null,
        });
      }
    }

    const timerLength = 2500;

    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set a new timer
    timerRef.current = setTimeout(() => {
      // Check if the user is still typing after the delay
      if (message.message.trim() !== "") {
        socket.emit("stopTyping", {
          content: message.message,
          chatId: selectedChat?.chatId,
          senderId: currentUser?._id,
          receiverId: selectedChat?.userId,
          isGroupChat: selectedChat?.isGroupChat,
          groupChatId: selectedChat?.isGroupChat ? selectedChat.chatId : null,
        });
      }
    }, timerLength);

    return () => {
      // Clear the timer on component unmount or when the dependency changes
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [message.message, currentUser, selectedChat, socket]);

  //onsubmit
  // const { setMessage } = useMessageStore();
  const queryclient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => sentMessage(data),
    // mutationKey: ["messages"],
    onSuccess: (data) => {
      console.log({inputSentSuccessData:data})
       queryclient.invalidateQueries({
         queryKey: ["messages"],
       });
      const socketData = {
        senderId: currentUser?._id,
        receiverId: selectedChat?.userId,
        chatId: selectedChat?.chatId,
        content: data.content,
        pic: currentUser?.pic,
        createAt: data.createdAt,
        isGroupChat: selectedChat?.isGroupChat,
        groupChatId: selectedChat?.isGroupChat ? selectedChat.chatId : null,
      };
      socket.emit("sentMessage", socketData);
      // toast.success("Message Sent!");
      setMessage({ message: "" });
      useIncomingMessageStore.setState({ isIncomingMessage: true });

     
    },
    // onSettled: () => {
    //   useIncomingMessageStore.setState({ isIncomingMessage: true });
    // },
  });

  //reply message mutation
  const replymutation = useMutation({
    mutationFn: (data) => replyMessage(data),
    // mutationKey: ["messages"],
    onSuccess: (data) => {
      const socketData = {
        senderId: currentUser?._id,
        receiverId: selectedChat?.userId,
        chatId: selectedChat?.chatId,
        content: data.content,
        pic: currentUser?.pic,
        createAt: data.createdAt,
        isGroupChat: selectedChat?.isGroupChat,
        groupChatId: selectedChat?.isGroupChat ? selectedChat.chatId : null,
      };
      socket.emit("sentMessage", socketData);
      // toast.success("Message Replied!");
      setMessage({ message: "" });
      setOpenImageModal(false);
      useIncomingMessageStore.setState({ isIncomingMessage: true });

      queryclient.invalidateQueries({
        queryKey: ["messages"],
      });
    },
    // onSettled: () => {
    //   useIncomingMessageStore.setState({ isIncomingMessage: true });
    // },
  });

  //edit message mutation
  const editmutation = useMutation({
    mutationFn: (data) => editMessage(data),
    // mutationKey: ["messages"],
    onSuccess: (data) => {
      const socketData = {
        senderId: currentUser?._id,
        receiverId: selectedChat?.userId,
        chatId: selectedChat?.chatId,
        content: data.content,
        pic: currentUser?.pic,
        createAt: data.createdAt,
        isGroupChat: selectedChat?.isGroupChat,
        groupChatId: selectedChat?.isGroupChat ? selectedChat.chatId : null,
      };
      socket.emit("sentMessage", socketData);
      // toast.success("Message Edited!");
      setMessage({ message: "" });
      setOpenImageModal(false);
      useIncomingMessageStore.setState({ isIncomingMessage: true });

      queryclient.invalidateQueries({
        queryKey: ["messages"],
      });
    },
    // onSettled: () => {
    //   useIncomingMessageStore.setState({ isIncomingMessage: true });
    // },
  });
  const onSubmit = () => {
    if (!selectedChat?.chatId) {
      return;
    }
    const createdAtTime = new Date(Date.now());
    const messageData = {
      chatId: selectedChat?.chatId,
      content: message.message ? message.message : "😍",
      createdAt: createdAtTime,
    };

    const initialUserMessageData = {
      chat: {
        chatName: selectedChat?.isGroupChat ? selectedChat?.groupChatName : "sender",
        createdAt: selectedChat.createdAt,
        isGroupChat: selectedChat?.isGroupChat,
        latestMessage: selectedChat?.lastMessage,
        updatedAt: new Date(Date.now()),
        users: selectedChat?.users,
        _id: selectedChat.chatId,
      },
      content: message.message ? message.message : "😍",
      status: "unseen",

      sender: currentUser,
      reactions: [],
      createdAt: createdAtTime,
      updatedAt: new Date(),
    };
    setInitialMessage(initialUserMessageData as any);
    mutation.mutateAsync(messageData as any);
  };

  //when key down

  const onkeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !isEdit && !isReply) {
      onSubmit();
    } else if (e.key === "Enter" && isEdit) {
      onEditSubmit();
    } else if (e.key === "Enter" && isReply) {
      onReplySubmit();
    }
  };
  //edit handler
  const onEditSubmit = () => {
    if (!selectedChat?.chatId && !isEdit) {
      return;
    }
    const messageData = {
      messageId: isEdit?._id,
      content: message.message,
    };
    editmutation.mutateAsync(messageData as any);
    cancelEdit();
  };

  //replyHandler
  const onReplySubmit = () => {
    if (!selectedChat?.chatId && !isReply) {
      return;
    }
    const messageData = {
      chatId: selectedChat?.chatId,
      messageId: isReply?._id,
      content: message.message,
    };
    replymutation.mutateAsync(messageData as any);
    cancelReply();
  };

  //side effects and change status
  useEffect(() => {
    if (isEdit && isEdit.content) {
      setMessage({ message: isEdit.content });
    }
  }, [isEdit]);

  //audioVoice
  const audioCallback = (data: any) => {
    console.log({ audioCallbackData: data });
  };
  if (selectedChat?.status === "blocked") {
    return <ChatStatus user={selectedChat.chatUpdatedBy} />;
  }
  //check emoji

  return (
    <>
      <span ref={emojiRef}>
        <Emoji unified={emojiValue} lazyLoad emojiStyle={EmojiStyle.FACEBOOK} />
      </span>
      {isTyping && typingContent && typingChatId === selectedChat?.chatId && (
        <TypingIndicatot user={selectedChat} />
      )}
      <div className="w-full mx-auto z-50  bg-white dark:bg-black">
        {isEdit && (
          <div className="p-2 md:p-4  text-xs md:text-sm  rounded">
            <div className="flexBetween">
              <div>
                Edit
                <span className="font-bold mx-2">
                  {isEdit.sender._id === currentUser?._id
                    ? "Own Message"
                    : isEdit.sender.username}
                </span>
              </div>
              <IoMdClose
                onClick={() => {
                  setMessage({ message: "" });
                  cancelEdit();
                }}
                className="h-4 w-4 md:h-6 md:w-6 cursor-pointer"
              />
            </div>
          </div>
        )}
        {isReply && (
          <div className="p-2 md:p-4  text-xs md:text-sm  m-y rounded">
            <div className="flexBetween">
              <div>
                {" "}
                reply to{" "}
                <span className="font-bold mx-2">
                  {isReply.sender._id === currentUser?._id
                    ? "Myself"
                    : isReply.sender.username}
                </span>
              </div>
              <IoMdClose
                onClick={() => cancelReply()}
                className="h-4 w-4 md:h-6 md:w-6 cursor-pointer"
              />
            </div>
          </div>
        )}
        {/* {renderMessageWithEmojis(message.message, false).map((part, index) => {
          if (typeof part === "string") {
            return <span key={index}>{part}</span>;
          } else if (React.isValidElement(part)) {
            // Render the Emoji component with click handling
            return (
              <Emoji
                key={index}
                unified={part.props.unified}
                size={isSmallDevice ? 14 : 20}
                lazyLoad
                emojiStyle={EmojiStyle.FACEBOOK}
                // onClick={() => handleEmojiClick(part.props.unified)}
              />
            );
          } else {
            return null; // Handle other cases as needed
          }
        })} */}
        <div className="flex items-center justify-center w-full p-2 md:p-4 ">
          <span className="p-2 flex items-center justify-center gap-2 ">
            <button className="rounded-md  text-xs md:text-sm">
              {/* <AudioVoice  callback={audioCallback} /> */}
              <MdOutlineKeyboardVoice className="text-blue-400 h-full w-full mx-1" />
            </button>
            <div ref={clickImageModalRef} className="relative">
              <button
                className="rounded-md mt-2 text-xs md:text-sm"
                onClick={() => setOpenImageModal((prev) => !prev)}
              >
                <MdAddAPhoto className="text-blue-400 h-full w-full mx-1" />
              </button>
                <ImageMessage
                  mutation={mutation}
                  replymutation={replymutation}
                  editmutation={editmutation}
                  setOpenImageModal={setOpenImageModal}
                  openImageModal={openImageModal}
                />
              
            </div>
            {/* <button
              className="rounded-md text-xs md:text-sm"
              onClick={() => setOpenEmoji((prev) => !prev)}
            >
              <IoMdPhotos className="text-blue-400 h-full w-full " />
            </button> */}
            <button
              className="rounded-md text-xs md:text-sm"
              onClick={() => setOpenEmoji((prev) => !prev)}
            >
              <RiEmojiStickerLine className="text-blue-400 h-full w-full mx-1" />
            </button>
          </span>
          <h1></h1>
          <div className="relative basis-[100%]">
            <textarea
              className=" resize-none px-1 h-[70px] text-xs md:text-sm md:px-2 py-3 bg-transparent rounded-xl pr-12  max-h-[200px] overflow-y-auto border border-gray-300 dark:border-gray-600 md:border-2 md:border-violet-800 md:hover:border-green-500 transition-all duration-300 outline-none   w-full "
              name="message"
              placeholder="Aa"
              value={message.message}
              onChange={(e) => handleChange(e)}
              onKeyDown={onkeydown}
              rows={2}
            />
            <div
              ref={clickRef}
              className="absolute right-1 md:right-2 bottom-2 md:bottom-4 text-2xl"
            >
              <button
                className="rounded-md mr-1 text-sm md:text-xl"
                onClick={() => setOpenEmoji((prev) => !prev)}
              >
                <Emoji unified="1f423" size={20} />
              </button>

              <EmojiPicker
                open={openEmoji}
                style={{
                  position: "absolute",
                  top: isSmallDevice ? "-360px" : "-350px", // Adjust this value based on your design
                  right: "0",
                  zIndex: 1000,
                  height: isSmallDevice ? "320px" : "340px",
                  width: isSmallDevice ? "290px" : "310px",
                  fontSize: "10px",
                }}
                onEmojiClick={onEmojiClick}
                autoFocusSearch
                theme={Theme.DARK}
                lazyLoadEmojis
                // previewConfig={{defaultEmoji:<Emoji/>}}

                emojiStyle={EmojiStyle.FACEBOOK}
                searchPlaceholder="Search chat emojis..."
                suggestedEmojisMode={SuggestionMode.RECENT}
                customEmojis={[
                  {
                    names: ["Alice", "alice in wonderland"],
                    imgUrl:
                      "https://cdn.jsdelivr.net/gh/ealush/emoji-picker-react@custom_emojis_assets/alice.png",
                    id: "alice",
                  },
                ]}
              />
            </div>
          </div>
          {!isSentImageModalOpen && (
            <button
              onClick={isEdit ? onEditSubmit : isReply ? onReplySubmit : onSubmit}
              className="h-auto text-xl md:text-2xl mx-2"
            >
              {isEdit ? (
                <span className="btn capitalize text-xs h-full">Edit</span>
              ) : isReply ? (
                <span className="btn capitalize text-xs h-full">Reply</span>
              ) : message.message ? (
                <div className="text-xl md:text-2xl">
                  <LuSendHorizonal className="text-blue-500 h-full w-full" />
                </div>
              ) : (
                "😍"
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Input;
