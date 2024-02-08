import express from "express";
import cors from "cors";
import textflow from "textflow.js";
import cluster from "cluster";
import http from "http";
import { cpus } from "os";

const numCPUs = cpus().length;

import bodyParser from "body-parser";

import AuthRoute from "./Routes/AuthRoute.js";

import StateRoute from "./Routes/StateRoute.js";
import DistrictRoute from "./Routes/DistrictRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PaymentRoute from "./Routes/PaymentRoute.js";
import ChatRoute from "./Routes/ChatRoute.js";
import { connection } from "./Database/Database.js";

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
  // console.log("db connected successfully");
  // app.listen(PORT, () => {
  //   console.log(`app listen port number ${PORT}...!`);
  // });
});

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const server = http.createServer(app);
  // const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

app.use("/auth", AuthRoute);
app.use("/state", StateRoute);
app.use("/district", DistrictRoute);
app.use("/user", UserRoute);

app.use("/payment", PaymentRoute);
app.use("/chat", ChatRoute);
