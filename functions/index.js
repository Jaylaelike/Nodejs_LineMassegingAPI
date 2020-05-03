const functions = require("firebase-functions");
const request = require("request-promise");

const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message";
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer tFfLW24HDcLS/mVOvAATa2jcM9YQ5G1gCvYgokXURu8BVP9XTa7rUfKKsA9p9apW++1u+Ps23EJbIgOdoUt1pgNqDD4VPqFcTwo5XDkRtPPlqjwCgWP9jeyj3T9o60XVLZndWHIJOAx5MH9xIjDi9QdB04t89/1O/w1cDnyilFU=`,
};

exports.LineBotPush = functions.https.onRequest((req, res) => {
  return request({
    method: `GET`,
    uri: `https://covid19.th-stat.com/api/open/today`,
    json: true,
  })
    .then((response) => {
      const message = `ติดเชื้อสะสม: ${response.Confirmed}\nติดเชื้อเพิ่ม: ${response.NewConfirmed}\nตาย: ${response.Deaths}\nอยู่ในโรงพยาบาล: ${response.Hospitalized}\nหายแล้ว: ${response.Recovered}\nหายแล้วเพิ่ม: ${response.NewRecovered}`;
      return push(res, message);
    })
    .catch((error) => {
      return res.status(500).send(error);
    });
});

const push = (res, msg) => {
  return request({
    method: `POST`,
    uri: `${LINE_MESSAGING_API}/push`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      to: `Ua980d0f433585d1fb2d2a868548de984`,
      messages: [
        {
          type: `text`,
          text: msg,
        },
      ],
    }),
  })
    .then(() => {
      return res.status(200).send(`Done`);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
