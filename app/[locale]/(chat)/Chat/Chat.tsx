"use client";
import React, { useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useChatStore } from "@/store/useChat";
import { useRouter } from "@/navigation";
import { useChatContext } from "@/context/ChatContext/ChatContextProvider";
import { useUserStore } from "@/store/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTypingStore } from "@/store/useTyping";
import { useOnlineUsersStore } from "@/store/useOnlineUsers";
import {
  updateAllMessageStatusAsDelivered,
  updateMessageStatus,
} from "@/functions/messageActions";
import { useVidoeCallStore } from "@/store/useCallStore";
import { Howl } from "howler";
import Peer from "@/context/peer/Peer";
import useMessageStore from "@/store/useMessage";
// import useSound from "use-sound";
// import soundPath from "./audio/notification.mp3";
const IncomingCallModal = dynamic(() => import("../conponents/call/IncomingCallModal"), {
  ssr: false,
});
const RejectedCallModal = dynamic(() => import("../conponents/call/RejectCallModal"), {
  ssr: false,
});

const Chat = ({ user }: any) => {
  const { currentUser, setCurrentUser } = useUserStore();

  // Define Howl instance outside of the component

  // const playNotificationSound = () => {
  //   // Use the Howler.js instance to play the sound
  //   notificationSound.play();
  // };

  const router = useRouter();
  // Create an AudioContext instance
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  // Initialize Howler for playing audio
  const playSound = new Howl({
    src: ["/audio/notification.mp3"],
    preload: true,
    volume: 1,
    autoplay: true,
    onloaderror: (err) => {
      console.log("on load error", err);
    },
    onload: (load) => {
      console.log("on load", load);
    },
    onplay: (play) => {
      console.log("playing on play", play);
    },
  });

  // Function to play audio with AudioContext state check
  const playAudio = () => {
    // Check if the AudioContext is suspended and resume if needed
    if (audioContext.state === "suspended") {
      audioContext.resume().then(() => {
        console.log("AudioContext resumed successfully");
      });
    } else {
      playSound.play(); // If the context is not suspended, play audio directly
    }
  };

  // Function to handle playing notification sound
  const playNotificationSound = useCallback(() => {
    playAudio();
  }, []);
  const queryclient = useQueryClient();
  const { startTyping, stopTyping } = useTypingStore();
  const { addOnlineUser, onlineUsers } = useOnlineUsersStore();
  const { socket } = useChatContext();
  const { selectedChat, myChats } = useChatStore();
  const selectedChatRef = useRef(selectedChat);
  const onlineUsersRef = useRef(onlineUsers);
  const currentUserRef = useRef(currentUser);
  const { IncomingOffer, setIncomingOffer, isRejected } = useVidoeCallStore();
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);
  // Update the reference whenever selectedChat changes
  useEffect(() => {
    // Check if selectedChat is null and reset the reference to null
    if (selectedChat === null) {
      selectedChatRef.current = null;
    }
    selectedChatRef.current = selectedChat;
    onlineUsersRef.current = onlineUsers;
    currentUserRef.current = currentUser;
  }, [selectedChat, onlineUsers, currentUser]);

  const updateStatusMutation = useMutation({
    mutationKey: ["messages"],
    mutationFn: (data: any) => updateMessageStatus(data),
    onSuccess: (data) => {
      const receiver = data.chat?.users.find((u: any) => u._id !== currentUser?._id);
      const deliverData = {
        senderId: currentUser?._id,
        receiverId: receiver?._id,
        chatId: data.chat?._id,
        pic: currentUser?.pic,
      };
      socket.emit("deliveredMessage", deliverData);
      queryclient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const updateStatusAsDeliveredMutationAfterRejoined = useMutation({
    mutationKey: ["messages"],
    mutationFn: () => updateAllMessageStatusAsDelivered(currentUser?._id as any),
    onSuccess: (data) => {
      const deliverData = {
        senderId: currentUser?._id,
        pic: currentUser?.pic,
      };
      socket.emit("deliveredAllMessageAfterReconnect", deliverData);
      queryclient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
  // console.log({ selectedChat});
  const handleSocketMessage = useCallback(
    (data: any) => {
      if (data.senderId === currentUserRef.current?._id) {
        // useMessageStore.setState({ isIncomingMessage: true });
        // console.log("isIncomingMessage");
      } else {
        useMessageStore.setState({ isFriendsIncomingMessage: true });
        console.log("isFriendsIncomingMessage");
      }
      //  if (data.receiverId === currentUser?._id) {
      queryclient.invalidateQueries({ queryKey: ["messages"] });
      //  }
      // console.log({ data }, selectedChat);
      if (data.senderId === selectedChatRef.current?.userId) {
        const updateStatusData = {
          chatId: selectedChatRef.current?.chatId,
          status: "seen",
        };
        updateStatusMutation.mutateAsync(updateStatusData);
      } else if (
        data.receiverId === currentUserRef.current?._id &&
        onlineUsersRef.current.some(
          (user: any) => user.id === currentUserRef.current?._id
        )
      ) {
        playNotificationSound();

        // console.log({ deliveredMessageCallback: data });
        const updateStatusData = {
          chatId: data?.chatId,
          status: "delivered",
        };

        updateStatusMutation.mutateAsync(updateStatusData);
        //for incoming messages
      }
    },
    [currentUserRef, playNotificationSound]
  );
  const handleTyping = useCallback((data: any) => {
    // if (data.receiverId === currentUser?._id) {
    startTyping(data.senderId, data.receiverId, data.chatId, data.content);
    // }
  }, []);
  const handleStopTyping = useCallback((data: any) => {
    // if (data.receiverId === currentUser?._id) {
    stopTyping();
    // }
  }, []);

  const handleOnlineUsers = useCallback((users: any) => {
    if (users) {
      addOnlineUser(users);
    }
  }, []);

  const handleDeliverMessage = useCallback((data: any) => {
    // if (data.senderId === currentUser?._id) {
    queryclient.invalidateQueries({ queryKey: ["messages"] });
    // }
  }, []);
  useEffect(() => {
    updateStatusAsDeliveredMutationAfterRejoined.mutateAsync();
  }, []);

  //all message delivered after join a user
  const handleAllDeliveredAfterReconnect = useCallback(() => {
    queryclient.invalidateQueries({ queryKey: ["messages"] });
  }, []);
  //group chat created
  const groupCreatedNotifyHandler = useCallback(() => {
    queryclient.invalidateQueries({ queryKey: ["messages"] });
    playNotificationSound();
  }, []);
  //single| one to one chat created notice
  const chatCreatedNotifyHandler = useCallback(() => {
    queryclient.invalidateQueries({ queryKey: ["messages"] });
    playNotificationSound();
  }, []);
  const chatDeletedNotifyReceivedHandler = useCallback(() => {
    queryclient.invalidateQueries({ queryKey: ["messages"] });
  }, []);
  useEffect(() => {
    // Emit "setup" event when the component mounts
    if (currentUser) {
      const setupData = {
        id: currentUser?._id,
      };
      socket.emit("setup", setupData);
    }
  }, [currentUser, socket]);
  useEffect(() => {
    // Add event listeners
    socket.on("receiveMessage", handleSocketMessage);
    socket.on("receiveDeliveredMessage", handleDeliverMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    socket.on("setup", handleOnlineUsers);
    socket.on("groupCreatedNotifyReceived", groupCreatedNotifyHandler);
    socket.on("chatCreatedNotifyReceived", chatCreatedNotifyHandler);
    socket.on("chatDeletedNotifyReceived", chatDeletedNotifyReceivedHandler);

    socket.on(
      "receiveDeliveredAllMessageAfterReconnect",
      handleAllDeliveredAfterReconnect
    );

    // Clean up event listeners when the component unmounts
    return () => {
      socket.off("setup", handleOnlineUsers);
      socket.off("disconnect");
      socket.off("receiveMessage", handleSocketMessage);
      socket.off("receiveDeliveredMessage", handleDeliverMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("groupCreatedNotifyReceived", groupCreatedNotifyHandler);
      socket.off("chatCreatedNotifyReceived", chatCreatedNotifyHandler);
      socket.off("chatDeletedNotifyReceived", chatDeletedNotifyReceivedHandler);
      socket.off(
        "receiveDeliveredAllMessageAfterReconnect",
        handleAllDeliveredAfterReconnect
      );
    };
  }, []); //

  // calling start

  //inComingCall

  const handleIncommingCall = useCallback(async ({ from, offer, user, chatId }: any) => {
    //   const ans = await Peer.getAnswer(offer);
    //   socket.emit("call:accepted", { to: selectedChat?.chatId, ans });
    const offerData = {
      offer,
      from,
      user,
      chatId,
    };
    console.log(`Incoming Call received`, offerData);
    // const mediaDevices =
    //   navigator.mediaDevices ||
    //   (navigator as any).webkitGetUserMedia ||
    //   (navigator as any).mozGetUserMedia;

    // const stream = await mediaDevices.getUserMedia({
    //   audio: true,
    //   video: true,
    // });
    // setLocalStream(stream)
    setIncomingOffer(offerData);
  }, []);

  //reject call
  const handleRejectedCall = ({ user }: any) => {
    setIncomingOffer(null);

    useVidoeCallStore.setState({ isRejected: true, rejectBy: user });
  };
  //nego

  const handleNegoNeedIncomming = useCallback(async ({ from, offer }: any) => {
    const ans = await Peer.getAnswer(offer);
    socket.emit("peer:nego:done", { to: from, ans, user: currentUser });
  }, []);

  const handleNegoNeedFinal = useCallback(async ({ ans }: any) => {
    await Peer.setLocalDescription(ans);
  }, []);

  //side effects
  useEffect(() => {
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:rejected", handleRejectedCall);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    return () => {
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:rejected", handleRejectedCall);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, []);

  return (
    <div className="p-1">
      {/* <button
        className="btn"
        onClick={() => {
          playNotificationSound();
          playTickSound()
        }}
      >
        Play Sound
      </button> */}
      {IncomingOffer && <IncomingCallModal />}
      {isRejected && <RejectedCallModal />}
    </div>
  );
};

export default Chat;
