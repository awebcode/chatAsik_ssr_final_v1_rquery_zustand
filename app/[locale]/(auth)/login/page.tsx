import dynamic from "next/dynamic";
const Login = dynamic(() => import("../components/Login"),{
  ssr: false,
  loading:()=><h1>Loading.......</h1>
});
const page = () => {
  return (
    <div><Login/></div>
  )
}

export default page