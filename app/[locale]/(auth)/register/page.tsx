import dynamic from "next/dynamic";
const Register = dynamic(() => import("../components/Register"), {
  ssr: false,
  loading: () => <h1>Loading.......</h1>,
});
const page = () => {
  return (
    <div><Register/></div>
  )
}

export default page