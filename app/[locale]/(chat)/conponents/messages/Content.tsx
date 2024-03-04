import Image from "next/image";
import React from "react";
const Reactions = dynamic(() => import("./Reactions"));
import moment from "moment";
import { BsReply } from "react-icons/bs";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@uidotdev/usehooks";
import { RenderMessageWithEmojis } from "../logics/checkEmoji";
import RenderMesseage from "./RenderMesseage";
import { UseImageActions } from "@/hooks/imageAction";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { IoIosExpand } from "react-icons/io";
import DownloadAndView from "./DownloadAndView";

const Content = ({
  message,
  currentUser,
  selectedChat,
  isCurrentUserMessage,
  handleRemoveReact,
  isReactionListModal,
  setReactionListVisible,
  reactionListModalRef,
}: {
  message: any;
  currentUser: any;
  selectedChat: any;
  isCurrentUserMessage: any;
  handleRemoveReact: any;
  isReactionListModal: any;
  setReactionListVisible: any;
  reactionListModalRef: any;
}) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  return (
    <div>
      {/* <PreviewModal /> */}

      <div className="">
        {/* Time */}
        <p className="text-[10px] md:text-xs ">
          {message.isEdit ? (
            <span className="font-bold mr-2">Edited</span>
          ) : message.status === "unsent" ? (
            <span className="font-bold mr-2">UnsentAt</span>
          ) : message.status === "remove" &&
            message.removedBy?._id === currentUser?._id ? (
            <span className="font-bold mr-2">removedAt</span>
          ) : null}
          {moment(
            message.isEdit
              ? message.updatedAt
              : message.status === "unsent" || message.status === "remove"
              ? message.updatedAt
              : message.createdAt
          ).format("lll")}
        </p>
        {/* Time end */}
        {message.isReply ? (
          <div>
            <span className="text-[10px] md:text-xs">
              <BsReply className={` h-4 w-4 cursor-pointer mx-2 inline `} />{" "}
              {message?.sender?._id === message.isReply?.messageId?.sender?._id
                ? message?.sender?._id === currentUser?._id
                  ? "You replied to yourself"
                  : message?.sender?._id === selectedChat?.userId
                  ? ` ${message.isReply?.messageId?.sender?.username} replied to You `
                  : ""
                : message.isReply?.messageId?.sender?._id === currentUser?._id
                ? ` ${selectedChat?.username} replied to you `
                : `You replied to ${selectedChat?.username} `}
            </span>
            <div
              className={`relative text-[10px] md:text-xs  ${
                !message?.isReply?.messageId?.image || !message?.image
                  ? "bg-gray-200 hover:bg-gray-100  dark:bg-gray-800 dark:hover:bg-gray-700"
                  : ""
              } duration-300  rounded-lg p-3 max-w-[40vw] md:max-w-[40vw] break-words !h-fit  `}
            >
              <span className="">
                {/* {message.isReply?.messageId?.content} */}
                {message.isReply && message.isReply?.messageId?.content ? (
                  RenderMessageWithEmojis(
                    message.isReply?.messageId?.content,
                    isSmallDevice
                  )
                ) : message.isReply?.messageId?.image ? (
                  <div className=" rounded relative h-[100px] md:h-[150px] bg-red-300 inline-block">
                    <Image
                      src={message.isReply?.messageId?.image.url}
                      alt={message?.sender?.username}
                      height={isSmallDevice ? 300 : 1000}
                      width={isSmallDevice ? 300 : 1000}
                      className="h-full w-auto rounded-lg"
                    />
                    <DownloadAndView url={message.isReply?.messageId?.image.url} />
                  </div>
                ) : (
                  ""
                )}
              </span>
              {message.status !== "remove" &&
              message.removedBy?._id !== currentUser?._id ? (
                <div
                  className={` ${
                    message.image
                      ? "-mt-2 md:-mt-2"
                      : "border dark:border-gray-600 border-gray-300 left-8 right-0 text-sm   bg-gray-200 hover:bg-gray-100  dark:bg-gray-800 dark:hover:bg-gray-700"
                  }   text-[10px] md:text-xs  duration-300 rounded-lg p-2  max-w-[40vw] md:max-w-[40vw] break-words !h-fit  `}
                >
                  {message.content ? (
                    RenderMessageWithEmojis(message?.content, isSmallDevice)
                  ) : message.image ? (
                    <div className="  rounded relative">
                      <Image
                        src={message.image.url}
                        alt={message?.sender?.username}
                        height={isSmallDevice ? 300 : 600}
                        width={isSmallDevice ? 300 : 600}
                        className="h-full w-full rounded-lg object-cover"
                      />
                      <DownloadAndView url={message.image.url} />
                    </div>
                  ) : (
                    ""
                  )}
                  {/* Reply Reactions */}
                  <Reactions
                    message={message}
                    isCurrentUserMessage={isCurrentUserMessage}
                    handleRemoveReact={handleRemoveReact}
                    isReactionListModal={isReactionListModal}
                    setReactionListVisible={setReactionListVisible}
                    reactionListModalRef={reactionListModalRef}
                  />
                </div>
              ) : message.status === "remove" &&
                message.removedBy?._id === currentUser?._id ? (
                <div className="text-[10px] md:text-xs  bg-gray-200 duration-300 hover:bg-gray-100  dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg p-3  max-w-[40vw] md:max-w-[40vw] break-words !h-fit  ">
                  Removed
                </div>
              ) : (
                <RenderMesseage
                  message={message}
                  isCurrentUserMessage={isCurrentUserMessage}
                  handleRemoveReact={handleRemoveReact}
                  isReactionListModal={isReactionListModal}
                  setReactionListVisible={setReactionListVisible}
                  reactionListModalRef={reactionListModalRef}
                />
              )}
            </div>
          </div>
        ) : message.status !== "remove" && message.removedBy?._id !== currentUser?._id ? (
          <RenderMesseage
            message={message}
            isCurrentUserMessage={isCurrentUserMessage}
            handleRemoveReact={handleRemoveReact}
            isReactionListModal={isReactionListModal}
            setReactionListVisible={setReactionListVisible}
            reactionListModalRef={reactionListModalRef}
          />
        ) : message.status === "remove" && message.removedBy?._id === currentUser?._id ? (
          <div className="text-[10px] md:text-xs  bg-gray-200 duration-300 hover:bg-gray-100  dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg p-3  max-w-[40vw] md:max-w-[40vw] break-words !h-fit  ">
            Removed
          </div>
        ) : (
          <RenderMesseage
            message={message}
            isCurrentUserMessage={isCurrentUserMessage}
            handleRemoveReact={handleRemoveReact}
            isReactionListModal={isReactionListModal}
            setReactionListVisible={setReactionListVisible}
            reactionListModalRef={reactionListModalRef}
          />
        )}
      </div>
    </div>
  );
};

export default Content;
