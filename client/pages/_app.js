import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../api/build-client";

import Header from "../components/header";

const App = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

App.getInitialProps = async (app) => {
  const api = axiosInstance(app.ctx);
  const { data } = await api.get("/api/users/currentuser");

  let pageProps = {};
  if (app.Component.getInitialProps) {
    pageProps = await app.Component.getInitialProps(app.ctx);
  }

  return { pageProps, ...data };
};

export default App;
