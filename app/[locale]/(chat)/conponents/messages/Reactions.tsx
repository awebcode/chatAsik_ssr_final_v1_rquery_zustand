import { useOnlineUsersStore } from "@/store/useOnlineUsers";
import { useUserStore } from "@/store/useUser";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import Image from "next/image";
import React from "react";
import { MdClose } from "react-icons/md";

const Reactions = ({
  message,
  isCurrentUserMessage,
  handleRemoveReact,
  isReactionListModal,
  setReactionListVisible,
  reactionListModalRef,
}: any) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { onlineUsers } = useOnlineUsersStore();
  const { currentUser } = useUserStore();
  const lastThreeReactions =
    message?.reactions?.slice(0, 3).map((reaction: any) => reaction.emoji) ?? [];
  return (
    <div>
      {/* Reactions */}
      <div ref={reactionListModalRef}>
        {message?.reactions?.length === 1 ? (
          <span
            onClick={() => setReactionListVisible(!isReactionListModal)}
            className={`absolute ${
              message.isReply ? "-bottom-6" : "-bottom-3"
            } right-[6px] text-xl cursor-pointer`}
          >
            <span className="flex text-[14px] md:text-lg">
              {/* {message.reactions[0].emoji} */}
              <Emoji
                size={isSmallDevice ? 14 : 20}
                lazyLoad
                emojiStyle={EmojiStyle.FACEBOOK}
                unified={message.reactions[0].emoji.codePointAt(0).toString(16)}
              />
            </span>
          </span>
        ) : (
          <span
            onClick={() => setReactionListVisible(!isReactionListModal)}
            className="absolute -bottom-3 right-[6px]  cursor-pointer"
          >
            {lastThreeReactions.reverse().map((v: any, i: any) => (
              <span key={i} className="inline text-[14px] md:text-lg">
                {/* v */}
                <Emoji
                  size={isSmallDevice ? 14 : 20}
                  lazyLoad
                  emojiStyle={EmojiStyle.FACEBOOK}
                  unified={v?.codePointAt(0).toString(16)}
                />{" "}
              </span>
            ))}
            <span className="text-[14px] md:text-lg">
              {" "}
              {message?.reactions?.length > 1 && message?.reactions?.length < 3
                ? `` //${message?.reactions.length}
                : message?.reactions?.length > 3
                ? ` +${message?.reactions.length - 3}`
                : ""}
            </span>
          </span>
        )}
        <div
          className={`z-50 absolute -top-20 ${
            !isCurrentUserMessage
              ? "-right-[290px] w-auto md:w-[400px]"
              : "right-10 min-w-60"
          } rounded transition-all bg-gray-100 hover:bg-gray-200 dark:bg-gray-800  p-4 md:p-8 duration-500 ${
            isReactionListModal
              ? "translate-y-1 scale-100 opacity-100 w-auto md:w-[400px] max-h-[300px] overflow-y-auto"
              : "translate-y-0 scale-0 opacity-0"
          }`}
        >
          <button
            onClick={() => setReactionListVisible(false)}
            className="btn float-right "
          >
            <MdClose />
          </button>
          <h1 className="text-sm md:text-3xl p-3 border-b-2 mb-6 border-violet-600">
            Reactions ({message?.reactions?.length})
          </h1>
          <div className="">
            {message.reactions.map((v: any, i: any) => {
              return (
                <div
                  key={i}
                  className="flexBetween gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-900 duration-300 p-3 rounded-md"
                >
                  <div className=" p-2 flex items-center w-full">
                    {" "}
                    <div className="h-5 w-5 md:h-8 md:w-8 relative rounded-full ring md:ring-2 ring-violet-600">
                      <Image
                        height={35}
                        width={35}
                        className="rounded-full h-full w-full "
                        alt={v?.reactBy?.username as any}
                        src={v?.reactBy?.pic as any}
                      />
                      {onlineUsers.some((u: any) => u.id === v?.reactBy._id) ? (
                        <span
                          className={`absolute bottom-0 right-0 rounded-full p-1 md:p-[6px] 
                                        bg-green-500
                                      `}
                        ></span>
                      ) : (
                        <span
                          className={`absolute bottom-0 right-0 rounded-full p-[6px] 
                                       bg-rose-500
                                      `}
                        ></span>
                      )}
                    </div>
                    <div className="flex flex-col mx-4">
                      <span>{v?.reactBy.username}</span>
                      {/* Remove own react */}
                      {v.reactBy._id === currentUser?._id && (
                        <span
                          className="text-rose-300 text-[8px] md:text-xs cursor-pointer my-1"
                          onClick={() => {
                            handleRemoveReact(v._id);
                            setReactionListVisible(false);
                          }}
                        >
                          Click to remove
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Right side */}

                  <div className="emoji text-[14px] md:text-sm  text-yellow-400">
                    <Emoji
                      size={isSmallDevice ? 14 : 20}
                      lazyLoad
                      emojiStyle={EmojiStyle.FACEBOOK}
                      unified={v.emoji?.codePointAt(0).toString(16)}
                    />{" "}
                    {/* <span className="">{v.emoji}</span> */}
                  </div>
                </div>
              );
            })}
          </div>
          {/* <button
            onClick={() => setReactionListVisible(false)}
            className="btn float-right bottom-0 "
          >
            Close
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Reactions;
