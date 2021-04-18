import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // должен передать Host: 'z1maka.dev' в headers в обратном случае ingress будет перенаправлять в дефолтный бекенд
    // minikube ip = 192.168.0.10
    return axios.create({
      baseURL: "http://192.168.0.107",
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};
