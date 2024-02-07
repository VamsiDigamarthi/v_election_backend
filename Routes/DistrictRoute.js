import express from "express";
import {
  addRejectedTask,
  addTaskToUser,
  districtCoorPsAcDetailsUsingDropdown,
  notAssignMandalWiseUser,
  paymentInitiatedToUser,
  paymentNotReceviedUser,
  rejectedAllTaskFromUser,
  rejectedTaskDistrictBased,
  updatedOwnDistrictTask,
  // updateUserTaskAddedToPsDetails,
  userGetScoreGreaterThanEight,
  // userTableUpdate,
  usersNotAssignTaskMandalwise,
} from "../Controlles/DistrictController.js";

const router = express.Router();

// router.get("/login", login);

router.get("/score-user/:district", userGetScoreGreaterThanEight);

router.get("/rejected-task-data/:district", rejectedTaskDistrictBased);

router.get(
  "/district-coor-ps-ac-number/:district",
  districtCoorPsAcDetailsUsingDropdown
);

router.post(
  "/add-task-user/:id",
  addTaskToUser
  // userTableUpdate,
  // updateUserTaskAddedToPsDetails
);

router.post("/add-rejected-task-user/:id", addRejectedTask);

router.post("/payment-mode-admin-update/:id", paymentInitiatedToUser);

router.post("/users/notassigntask/mandalwise", usersNotAssignTaskMandalwise);

// rejected task

router.get("/rejected/tasks/district/:district", rejectedAllTaskFromUser);

// get payment not recevied

router.get("/payment/not/received/:district", paymentNotReceviedUser);

router.get(
  "/users/notassigntask/butnotassign/mandal/:district",
  notAssignMandalWiseUser
);

router.put("/update/own/task/:id/task/:taskId", updatedOwnDistrictTask);

export default router;
