import express from "express";
import {
  kiStartImgUpload,
  onCompletedCertificateKitFit,
  onInstallationCertificateAndImage,
  scoreDataWheneUserOpenLearning,
  updateScoreOfUser,
  updateTask,
  userFetchTask,
  userGetOwnProfile,
  userProfileUpdate,
} from "../Controlles/UserController.js";

const router = express.Router();

router.get("/user-get-profile/:id", userGetOwnProfile);

router.put("/update-profile/:id", userProfileUpdate);

router.put("/update-score/:id", updateScoreOfUser);

router.get("/only-score/:id", scoreDataWheneUserOpenLearning);

router.get("/fetch-task/:id", userFetchTask);

router.put("/update-task/:id", updateTask);

router.put("/kit-start-image/upload/:id", kiStartImgUpload);

router.put(
  "/installation-certificate-image/:id",
  onInstallationCertificateAndImage
);

router.put(
  "/completed-certificate-kit-fitting-img/:id",
  onCompletedCertificateKitFit
);

export default router;
