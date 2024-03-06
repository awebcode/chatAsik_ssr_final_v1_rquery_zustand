import React, { useRef, useState } from "react";
import { RiH1 } from "react-icons/ri";
import InputEmoji from "react-input-emoji";

export default function InputEmojiComponent() {
  const [text, setText] = useState("");
    const buttonRef = useRef();
  function handleOnEnter(text:any) {
    console.log("enter", text);
  }

  return (
    <div className="flex">
      <InputEmoji
        value={text}
        onChange={setText}
        cleanOnEnter
        onEnter={handleOnEnter}
        placeholder="Type a message"
        buttonRef={buttonRef}
        //   buttonElement={<button>Hi</button>}
      />
      <button>Hi</button>
    </div>
  );
}
