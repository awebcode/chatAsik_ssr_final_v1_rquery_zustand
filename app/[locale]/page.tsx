import Script from "next/script";

export default async function Home() {
  return (
    <>
      <h1 className="text-3xl md:text-6xl  wrapper">Hello, Messengaria!</h1>
      <Script id="my-script" type="text/javascript">
        {`
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();

    (function () {
      var s1 = document.createElement("script"),
          s0 = document.getElementsByTagName("script")[0];
      
      s1.async = true;
      s1.src = "https://embed.tawk.to/65e896ce9131ed19d975c4c9/1hoa8q66a";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      
      s0.parentNode.insertBefore(s1, s0);
    })();
  `}
      </Script>
    </>
  );
}
