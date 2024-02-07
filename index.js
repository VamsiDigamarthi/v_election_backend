import express from "express";
import cors from "cors";
import textflow from "textflow.js";

// textflow.useKey(
//   "4tJ2C8oUrGXD6UYQNzIliN48GSTIG6G1kMo0KdkOEbys7EmVpVg2fO2Ifvz8qM6E"
// );
//
// import { initClient } from "messagebird";
// // const messagebird = initClient("w02NeDSwzCZzbvY2W13IrD7meRe91jL6TuTW");
// const messagebird = initClient("test_gshuPaZoeEG6ovbc8M79w0QyM");
//
// const client = require("twilio")(accountSid, authToken);

// import twilio from "twilio";

// const client = twilio(
//   "ACbc1fe492782b79ee32b033305fb6b343",
//   "1bcb9b4e2718eddaa0b27cb53348c33b"
// );

import bodyParser from "body-parser";

import AuthRoute from "./Routes/AuthRoute.js";

import StateRoute from "./Routes/StateRoute.js";
import DistrictRoute from "./Routes/DistrictRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PaymentRoute from "./Routes/PaymentRoute.js";
import ChatRoute from "./Routes/ChatRoute.js";
import { connection } from "./Database/Database.js";

// import multer from "multer";
// import fast2sms from "fast-two-sms";

const app = express();
app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const PORT = "5000";

connection.connect(function (err) {
  if (err) {
    console.log(err);
  }
  app.listen(PORT, () => {
    console.log(`app listen port number ${PORT}...!`);
  });
});

// district coor register

app.use("/auth", AuthRoute);
app.use("/state", StateRoute);
app.use("/district", DistrictRoute);
app.use("/user", UserRoute);

app.use("/payment", PaymentRoute);
app.use("/chat", ChatRoute);

app.post("/send/code", async (req, res) => {
  const { phone } = req.body;
  const newPhone = "+91" + phone;
  const verificationOptions = {
    service_name: "From Brihaspathi Technology",
  };

  const result = await textflow.sendVerificationSMS(
    newPhone,
    verificationOptions
  );

  return res.status(result.status).json(result.message);
});

app.post("/verify/code", async (req, res) => {
  const { phone, code } = req.body;
  const newPhone = "+91" + phone;
  let result = await textflow.verifyCode(newPhone, code);

  if (result.valid) {
    // your server logic
    return res.status(200).json(result.message);
  }
  return res.status(result.status).json(result.message);
});

// app.post("/flower", (req, res) => {
//   client.messages
//     .create({
//       body: "Hello from twilio-node",
//       from: "+12138168977",
//       to: "+919014548747",
//     })
//     .then((message) => console.log(message.sid));
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });
// const upload = multer({ storage: storage });
