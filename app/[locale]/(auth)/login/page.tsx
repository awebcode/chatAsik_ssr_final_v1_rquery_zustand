import dynamic from "next/dynamic";
const ChatLoading = dynamic(() => import("../../(chat)/conponents/ChatLoading"));

const Login = dynamic(() => import("../components/Login"), {
  ssr: false,
  loading: () => <ChatLoading count={8} height={80} inline={false} radius={5} />,
});
const page = () => {
  return (
    <div>
      <Login />
    </div>
  );
};

export default page;
