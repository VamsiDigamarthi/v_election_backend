import { connection } from "../Database/Database.js";

export const bulkUpload = (req, res) => {
  var values = [];

  for (let i of req.body) {
    // console.log(i.PS_Address);
    values.push([
      i.State,
      i.District,
      i.PS_No,
      i.PS_Name_and_Address,
      i.AC_No,
      i.AC_Name,
      i.Location,
      i.Camera_ID,
      i.Mandal,
    ]);
  }

  let sql =
    "INSERT INTO `ps_details` (State, District, PS_No, PS_Name_and_Address, AC_No, AC_Name, Location,Camera_ID, Mandal) VALUES ?";

  connection.query(sql, [values], (err, result) => {
    if (err) {
      res.status(500).json({
        msg: "something went wrong",
      });
    } else {
      console.log("succefully insert all");
      res.status(200).json({
        msg: "succefully insert all",
      });
    }
  });
};

//
// all ps details fetch super admin start
//

export const allPsDetails = (req, res) => {
  const sql = "SELECT * FROM `ps_details`";
  try {
    connection.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({
          msg: "something went wrong ...!",
        });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    res.status(500).json({
      msg: "Something Went Wrong ...!",
    });
  }
};

// all ps details filter header component apply btn click

export const psDetailsFilterBasedOnDistrict = (req, res) => {
  // console.log(req.body.selectedState);
  const sql = "SELECT * FROM `ps_details` WHERE State = ? AND District = ?";
  try {
    connection.query(
      sql,
      [req.body.selectedState, req.body.selectedDist],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            msg: err,
          });
        }
        res.status(200).json(result);
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
};

//
// fetc district coordinator details
//
// payment not receved fetch corresponding ditrict coordanate details
export const districtCoordinatorShowStateCoordinator = (req, res) => {
  const sql =
    "SELECT id, name, phone FROM `users` WHERE district = ? AND state = ? AND role = ?";
  try {
    connection.query(
      sql,
      [req.params.district, req.params.state, "2"],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            msg: err,
          });
        } else {
          // console.log(result);
          res.status(200).json(result);
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
};

//
// task assign with district coor

export const assignTaskDistrictCoor = (req, res) => {
  const exitTask =
    "SELECT * FROM `district_task` WHERE task_heading = ? AND sub_task = ? AND user_id = ?";

  try {
    connection.query(
      exitTask,
      [req.body.selectTask, req.body.selectedSubTaskValue, req.params.id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            msg: err,
          });
        }
        if (result.length) {
          res.status(500).json({
            msg: "This Task is Already Assigned .. !",
          });
        } else {
          const sql =
            "INSERT INTO `district_task`(task_heading	, sub_task, user_id) VALUES(?,?,?)";
          connection.query(
            sql,
            [req.body.selectTask, req.body.selectedSubTaskValue, req.params.id],
            (err, result) => {
              if (err) {
                return res.status(500).json({
                  msg: err,
                });
              } else {
                // console.log(result);
                res.status(200).json(result);
              }
            }
          );
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
};

export const districtCoorTask = (req, res) => {
  const sql = "SELECT * FROM `district_task` WHERE user_id = ?";
  try {
    connection.query(sql, [req.params.id], (err, result) => {
      if (err) {
        return res.status(500).json({
          msg: err,
        });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
};
