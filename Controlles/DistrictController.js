import { connection } from "../Database/Database.js";

// fetch user score is greater than 8

export const userGetScoreGreaterThanEight = (req, res) => {
  const sql = "SELECT * FROM `users` WHERE score >= 8 AND district = ? ";
  try {
    connection.query(sql, [req.params.district], (err, result) => {
      if (err) {
        res.status(500).json(err);
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

//
// all rejected task data fetch in specific district
//

export const rejectedTaskDistrictBased = (req, res) => {
  const sql = "SELECT * FROM `tasks` WHERE action = ? AND district = ? ";
  try {
    connection.query(sql, ["rejected", req.params.district], (err, result) => {
      if (err) {
        throw err;
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

//
// district coordinator wise ps numbers

export const districtCoorPsAcDetailsUsingDropdown = (req, res) => {
  const sql = "SELECT * FROM `ps_details` WHERE District = ?";
  try {
    connection.query(sql, [req.params.district], (err, result) => {
      if (err) {
        return res.status(500).json({
          msg: err,
        });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
};

//
// add task to user

const userTableUpdate = (req, res) => {
  // console.log(req.params.id);
  const sql = "UPDATE `users` SET assign_task = ? WHERE id = ?";
  try {
    connection.query(sql, ["yes", req.params.id], (err, result) => {
      if (err) {
        return res.status(500).json({
          msg: err,
        });
      } else {
        res.status(200).json("task added successfully..!");
      }
    });
  } catch (error) {
    res.status(500).json("Something whent wrong");
  }
};

const updateUserTaskAddedToPsDetails = (req, res) => {
  // console.log(req.body["taskOpenFilterData"][0]?.Location);
  const sql = "UPDATE `ps_details` SET assign = ? WHERE Location = ?";
  try {
    connection.query(
      sql,
      ["yes", req.body["taskOpenFilterData"][0]?.Location],
      (err, result) => {
        if (err) {
          res.status(500).json("Something whent wrong");
        } else {
          userTableUpdate(req, res);
        }
      }
    );
  } catch (error) {
    res.status(500).json("Something whent wrong");
  }
};

export const addTaskToUser = (req, res) => {
  var values = [];

  // console.log(req.body["taskOpenFilterData"]);

  for (let i of req.body["taskOpenFilterData"]) {
    values.push([
      i.PS_Name_and_Address,
      i.AC_Name,
      i.PS_No,
      i.AC_No,
      i.District,
      i.Mandal,
      i.Location,
      req.params.id,
    ]);
  }

  // console.log(values);
  //
  try {
    connection.query(
      "INSERT INTO tasks(PS_name,AC_name,PS_No,AC_No,district, mandal, location,  user_id) VALUES ?",
      [values],
      (err, result) => {
        if (err) {
          res.status(500).json(err);
        } else {
          // console.log("success first");
          updateUserTaskAddedToPsDetails(req, res);
        }
      }
    );
  } catch (error) {
    res.status(500).json("Something whent wrong");
  }
};

// add rejected task

// const updatedPsTableAssign = (req, res) => {
//   const sql = "UPDATE `ps_details` SET assign = ? WHERE PS_No = ?";
//   try {
//     connection.query(sql, ["yes", req.body.PS_No], (err, result) => {
//       if (err) {
//         res.status(500).json("Something whent wrong");
//       } else {
//         // res.status(200).json("task added successfully ...!");
//       }
//     });
//   } catch (error) {
//     res.status(500).json("Something whent wrong");
//   }
// };

const updatedOldTaskDistrictAssign = (req, res) => {
  const sql =
    "UPDATE `tasks` SET rejected_dist_assign_new_user = ? WHERE id = ?";
  try {
    connection.query(sql, ["yes", req.body.id], (err, result) => {
      if (err) {
        res.status(500).json("Something whent wrong");
      } else {
        userTableUpdate(req, res);
        // updatedPsTableAssign(req, res);
        // res.status(200).json("task added successfully ...!");
      }
    });
  } catch (error) {
    res.status(500).json("Something whent wrong");
  }
};

export const addRejectedTask = (req, res) => {
  // console.log(req.body);
  try {
    connection.query(
      "INSERT INTO tasks(PS_name,AC_name,PS_No,AC_No,district, mandal, location, user_id) VALUES (?,?,?,?,?,?,?,?)",
      [
        req.body.PS_name,
        req.body.AC_name,
        req.body.PS_No,
        req.body.AC_No,
        req.body.district,
        req.body.mandal,
        req.body.location,
        req.params.id,
      ],
      (err, result) => {
        if (err) {
          res.status(500).json(err);
        } else {
          updatedOldTaskDistrictAssign(req, res);
        }
      }
    );
  } catch (error) {
    res.status(500).json("Something whent wrong");
  }
};

// payment initiated to user

export const paymentInitiatedToUser = (req, res) => {
  const sql =
    "UPDATE `users` SET pay_mode_admin = ?, payment_method = ?, payment_client = ?  WHERE id = ?";
  try {
    connection.query(
      sql,
      ["true", req.body.method, req.body.client, req.params.id],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json("payment Updated Successfully ...!");
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
};

// not assign task users mandal wise

export const usersNotAssignTaskMandalwise = (req, res) => {
  const sql =
    "SELECT name, id FROM `users` WHERE District = ? AND mandal = ? AND role = ? AND assign_task = ? AND score >= 8";
  try {
    connection.query(
      sql,
      [req.body.district, req.body.mandal, "3", "no"],
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

// rejected task

export const rejectedAllTaskFromUser = (req, res) => {
  const sql =
    "SELECT * FROM `tasks` WHERE action = ? AND rejected_dist_assign_new_user = ? AND district = ?";
  try {
    connection.query(
      sql,
      ["rejected", "no", req.params.district],
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

// payment not recevied usre

export const paymentNotReceviedUser = (req, res) => {
  const sql = "SELECT * FROM `users` WHERE pay_mode_admin = ? AND district = ?";
  try {
    connection.query(sql, ["true", req.params.district], (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const notAssignMandalWiseUser = (req, res) => {
  const sql =
    "SELECT * FROM `users` WHERE District = ?  AND role = ? AND assign_task = ? AND score >= 8";
  try {
    connection.query(sql, [req.params.district, "3", "no"], (err, result) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updatedOwnDistrictTask = (req, res) => {
  const sql =
    "UPDATE `district_task` SET completed = ? WHERE user_id = ? AND id = ? ";
  try {
    connection.query(
      sql,
      ["yes", req.params.id, req.params.taskId],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        } else {
          res.status(200).json("Updated Your Task..!");
        }
      }
    );
  } catch (error) {
    return res.status(500).json(error);
  }
};
