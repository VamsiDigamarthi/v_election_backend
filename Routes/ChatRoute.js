import express from "express";
import {
  createChat,
  getAllMessages,
  getSpecificChart,
  sendMessage,
} from "../Controlles/ChatController.js";

const router = express.Router();

router.post("/create-chat", createChat);

router.get("/get-chat/sender/:sender/receiver/:receiver", getSpecificChart);

router.post("/send-message", sendMessage);

router.get("/all-messages/:chartId", getAllMessages);

export default router;
