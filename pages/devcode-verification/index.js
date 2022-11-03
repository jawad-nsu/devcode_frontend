import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import Router from "next/router";

const Devcode = (props) => {
  const [authurl, setAuthurl] = useState();

  useEffect(() => {
    const func = async () => {
      try {
        const res = await fetch("http://localhost:5000/idhash").then((res) =>
          res.json()
        );
        const iframe = await getIframe(res.id, res.hash);
        setAuthurl(iframe);
      } catch (err) {
        console.log("err", err);
      }
    };
    func();
  }, []);

  useEffect(() => {
    let eventSource = new EventSource("http://localhost:5000/authres");
    eventSource.onmessage = function (event) {
      if (JSON.parse(event.data) === "auth successful")
        Router.push("/devcode-verified");
    };
    return () => {
      eventSource.close();
    };
  }, []);

  const getIframe = (id, getHash) => {
    return (
      "https://demo-api.gii.cloud/api/oauth/auth" +
      "?client_id=eucaps_test" + // your-client is the client ID provided by DID
      "&redirect_uri=" +
      encodeURIComponent("http://localhost:5000/auth") +
      "&response_type=code" +
      "&scope=openid" +
      `&sign_id=${id}` + // ID retrieved from post above
      `&state=${getHash}` + // generate state on your side, using e.g. a HMAC
      "&identity_provider=bankid-se" +
      "&display=popup"
    );
  };

  return (
    <Fragment>
      <h3>DevCode Identity</h3>
      <iframe
        style={{ height: "500px", width: "500px" }}
        title="Insert your personal number"
        src={authurl}
      ></iframe>
    </Fragment>
  );
};

// export async function getStaticProps() {
//   const authUrl = await fetch("http://localhost:3000/authurl");

//   // const htmlIframe = `<iframe style="height: 500px; width: 500px" src=${authUrl}></iframe>`;

//   return {
//     props: {
//       htmlIframe,
//     },
//   };
// }

export default Devcode;
