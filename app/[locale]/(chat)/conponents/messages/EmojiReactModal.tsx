import React from "react";
import { MdAdd } from "react-icons/md";
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
import { useMediaQuery } from "@uidotdev/usehooks";

const EmojiReactModal = ({
  message,
  openReactModal,
  setOpenReactModal,
  onEmojiClick,
  emojiModalRef,
  openEmojiModal,
  setOpenEmojiModal,
  isCurrentUserMessage,
}: any) => {
   const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  return (
    <div>
      <div
        className={`absolute z-50 -top-[90px] -right-20 p-4 rounded-xl bg-gray-800  max-w-[40rem] transition-transform   duration-500  ${
          openReactModal
            ? "translate-y-1 scale-100 opacity-100"
            : "translate-y-0 scale-0 opacity-0"
        }`}
      >
        <div className="flexBetween flex-row w-full gap-x-2 text-inherit">
          {["🙂", "😢", "🥰", "😠", "😜"].map((v, i: number) => {
            return (
              <div key={i}>
                {" "}
                <span
                  onClick={() => {
                    const e = { emoji: v };
                    onEmojiClick(e, message._id);
                    // setOpenReactModal(false);
                    // setOpenEmojiModal(false);
                  }}
                  className={`text-gray-300 h-4 w-4 md:h-6 md:w-6 mr-1 cursor-pointer transition-all duration-500 hover:scale-105`}
                >
                  {" "}
                  {/* {v} */}
                  <Emoji
                    size={isSmallDevice ? 14 : 20}
                    lazyLoad
                    emojiStyle={EmojiStyle.FACEBOOK}
                    unified={(v as any)?.codePointAt(0).toString(16)}
                  />{" "}
                </span>
              </div>
            );
          })}
          <span ref={emojiModalRef} className="p-2 rounded-full bg-gray-700 relative">
            <MdAdd
              onClick={() => setOpenEmojiModal((prev: boolean) => !prev)}
              className={`text-gray-300 h-[18px] w-[18px] mr-1 cursor-pointer `}
            />
            <EmojiPicker
              open={openEmojiModal}
              style={{
                position: "absolute",
                top: !isCurrentUserMessage ? "50px" : "50px", // Adjust this value based on your design
                right: !isCurrentUserMessage ? "-220px" : "0px",
                zIndex: 1000,
                height: isSmallDevice ? "310px" : "310px",
                width: isSmallDevice ? "270px" : "290px",
                fontSize: "10px",
              }}
              onEmojiClick={(e) => {
                onEmojiClick(e, message._id);
                setOpenReactModal(false);
                setOpenEmojiModal(false);
              }}
              autoFocusSearch
              theme={Theme.DARK}
              lazyLoadEmojis
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
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmojiReactModal;
