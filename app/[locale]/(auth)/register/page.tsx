import dynamic from "next/dynamic";
const ChatLoading = dynamic(() => import("../../(chat)/conponents/ChatLoading"));

const Register = dynamic(() => import("../components/Register"), {
  ssr: false,
  loading: () => <ChatLoading count={8} height={80} inline={false} radius={5} />,
});
const page = () => {
  return (
    <div>
      <Register />
    </div>
  );
};

export default page;
