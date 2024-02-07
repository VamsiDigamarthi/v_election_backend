import express from "express";
import {
  allPsDetails,
  assignTaskDistrictCoor,
  bulkUpload,
  districtCoorTask,
  districtCoordinatorShowStateCoordinator,
  psDetailsFilterBasedOnDistrict,
} from "../Controlles/StateController.js";

const router = express.Router();

router.post("/bulk-upload", bulkUpload);

router.get("/all-ps-details-fetch-super-admin", allPsDetails);

router.post("/header-apply-btn-click-psc-data", psDetailsFilterBasedOnDistrict);

router.get(
  "/fetch-district-coordinator/:district/state/:state",
  districtCoordinatorShowStateCoordinator
);

router.post("/assign/task/district/coor/:id", assignTaskDistrictCoor);

router.get("/distrci/task/:id", districtCoorTask);

export default router;
