import Image from 'next/image';
import React from 'react'
const Reactions = dynamic(() => import("./Reactions"));
import moment from 'moment';
import { BsReply } from 'react-icons/bs';
import dynamic from 'next/dynamic';
import { useMediaQuery } from '@uidotdev/usehooks';
import { RenderMessageWithEmojis } from '../logics/checkEmoji';

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
  message:any,
  currentUser:any,
  selectedChat:any,
  isCurrentUserMessage:any,
  handleRemoveReact:any,
  isReactionListModal:any,
  setReactionListVisible:any,
  reactionListModalRef:any,
    }) => {
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  return (
    <div>
      {" "}
      <div className="">
        {/* Time */}
        <p className="text-[10px] md:text-xs ">
          {message.isEdit ? (
            <span className="font-bold mr-2">Edited</span>
          ) : message.status === "unsent" ? (
            <span className="font-bold mr-2">UnsentAt</span>
          ) : message.status === "remove" ? (
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
            <div className="relative text-[10px] md:text-xs  bg-gray-200 hover:bg-gray-100  dark:bg-gray-800 dark:hover:bg-gray-700 duration-300  rounded-lg p-3  max-w-[260px] break-words !h-fit  ">
              <span className="">
                {/* {message.isReply?.messageId?.content} */}
                {message.isReply?.messageId?.content ? (
                  RenderMessageWithEmojis(
                    message.isReply?.messageId?.content,
                    isSmallDevice
                  )
                ) : message.isReply?.messageId?.image ? (
                  <div className="h-[130px] w-[130px] rounded">
                    <Image
                      src={message.isReply?.messageId?.image.url}
                      alt={message?.sender?.username}
                      height={100}
                      width={100}
                      className="h-full w-full rounded-lg"
                    />
                  </div>
                ) : (
                  ""
                )}
              </span>
              {message.status !== "remove" && message.removedBy !== currentUser?._id ? (
                <div
                  className={`absolute ${
                    message.image ? "-bottom-[70px]" : "-bottom-5"
                  } ring-2 ring-gray-400 left-8 right-0 text-sm   bg-gray-200 hover:bg-gray-100  dark:bg-gray-800 dark:hover:bg-gray-700 duration-300 rounded-lg p-2  max-w-[260px] break-words !h-fit  `}
                >
                  {message.content ? (
                    RenderMessageWithEmojis(message?.content, isSmallDevice)
                  ) : message.image ? (
                    <div className="h-[60px]  rounded">
                      <Image
                        src={message.image.url}
                        alt={message?.sender?.username}
                        height={80}
                        width={80}
                        className="h-full w-full rounded-lg object-cover"
                      />
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
              ) : (
                <div className="absolute text-[10px] md:text-xs -bottom-7 ring-2 ring-gray-400 left-8 right-0 text-sm bg-gray-200 hover:bg-gray-100  dark:bg-gray-800 dark:hover:bg-gray-700 duration-300 rounded-lg p-2  max-w-[260px] break-words !h-fit  ">
                  Removed
                </div>
              )}
            </div>
          </div>
        ) : message.status !== "remove" && message.removedBy !== currentUser?._id ? (
          <div className="text-[10px] md:text-xs relative duration-300 bg-gray-200 hover:bg-gray-100  dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg p-3  max-w-[260px] break-words !h-fit  ">
            {message.content ? (
              RenderMessageWithEmojis(message?.content, isSmallDevice)
            ) : message.image ? (
              <div className="h-[130px] w-[130px] rounded">
                <Image
                  src={message.image.url}
                  alt={message?.sender?.username}
                  height={100}
                  width={100}
                  className="h-full w-full rounded-lg"
                />
              </div>
            ) : (
              ""
            )}

            {/* Reactions */}

            <Reactions
              message={message}
              isCurrentUserMessage={isCurrentUserMessage}
              handleRemoveReact={handleRemoveReact}
              isReactionListModal={isReactionListModal}
              setReactionListVisible={setReactionListVisible}
              reactionListModalRef={reactionListModalRef}
            />
            {/*Display Reactions end */}
          </div>
        ) : (
          <div className="text-[10px] md:text-xs  bg-gray-200 duration-300 hover:bg-gray-100  dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg p-3  max-w-[260px] break-words !h-fit  ">
            Removed
          </div>
        )}
      </div>
    </div>
  );
};

export default Content