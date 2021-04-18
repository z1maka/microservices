import React, { useEffect } from "react";
import Router from "next/router";
import { useRequest } from "../../hooks/use-request";

const Signout = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "get",
    onSuccess: () => Router.push("/"),
  });
  useEffect(() => {
    doRequest();
  }, []);

  return <div>Выход...</div>;
};

export default Signout;
