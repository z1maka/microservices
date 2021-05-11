const jwt = require("jsonwebtoken");
const axios = require("axios");

const signin = () => {
  const token = jwt.sign(
    {
      id: "6080869b3ddb360019804f81",
      email: "zhenya.masnyy@gmail.com",
    },
    "asdf"
  );

  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`express:sess=${base64}`];
};

const cookie = signin();

console.log("cookie", cookie);

const doRequest = async () => {
  const { data } = await axios.post(
    "http://z1maka.dev/api/ticket/",
    {
      title: "ticket",
      price: 5,
    },
    { headers: { cookie } }
  );

  await axios.put(
    `http://z1maka.dev/api/ticket/${data.id}`,
    {
      title: "ticket",
      price: 10,
    },
    { headers: { cookie } }
  );

  axios.put(
    `http://z1maka.dev/api/ticket/${data.id}`,
    {
      title: "ticket",
      price: 15,
    },
    { headers: { cookie } }
  );

  console.log("Request complete!");
};

(async () => {
  for (let i = 0; i < 1000; i++) {
    doRequest();
  }
})();
