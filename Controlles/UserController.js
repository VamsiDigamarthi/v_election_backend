import { connection } from "../Database/Database.js";

//
// user get own profile

export const userGetOwnProfile = (req, res) => {
  const sql = "SELECT * FROM `users` WHERE id = ?";
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

// user profile update

export const userProfileUpdate = (req, res) => {
  try {
    connection.query(
      "UPDATE `users` SET name = ?, phone = ?, phonepe = ?, address=? WHERE id = ?;",
      [
        req.body.username,
        req.body.phone,
        req.body.phonepe,
        req.body.address,

        req.params.id,
      ]
    );
    res.status(200).json({
      resp: true,
      msg: "updates user successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
};

//
// update score of user

export const updateScoreOfUser = (req, res) => {
  try {
    connection.query("UPDATE `users` SET score = ? WHERE id = ?;", [
      req.body.score,
      req.params.id,
    ]);
    res.status(200).json({
      resp: true,
      msg: "updates the Score details",
    });
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
};

//

// fect score whene user open learning stage start

export const scoreDataWheneUserOpenLearning = (req, res) => {
  const sql = "SELECT score FROM `users` WHERE id = ?";
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

// fetch the task user

//

export const userFetchTask = (req, res) => {
  const sql = "SELECT * FROM `tasks` WHERE user_id = ? ";

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

//
// update the task status
//

export const updateTask = (req, res) => {
  const sql = "UPDATE `tasks` SET action = ?  WHERE id = ? ";
  try {
    connection.query(sql, [req.body.action, req.params.id], (err, result) => {
      if (err) {
        return res.status(500).json({
          msg: err,
        });
      } else {
        res.status(200).json("updated task successfully ...!");
      }
    });
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
};

//
// kit taken Img upload

export const kiStartImgUpload = (req, res) => {
  const sql = "UPDATE `tasks` SET kit_start = ? WHERE id = ?";
  try {
    connection.query(sql, [req.body.image, req.params.id], (err, result) => {
      if (err) {
        // console.log(err);
        return res.status(500).json({
          msg: err,
        });
      } else {
        res.status(200).json("image uploaded successfully...!");
      }
    });
  } catch (error) {
    return res.status(500).json({
      msg: "something went wrong please try again ....",
    });
  }
};

//
// installation image and certificate

export const onInstallationCertificateAndImage = (req, res) => {
  const sql =
    "UPDATE `tasks` SET InstallationCertificate	 = ?, installationImage = ? WHERE id = ?";
  try {
    connection.query(
      sql,
      [req.body.instaCer, req.body.instaImg, req.params.id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            msg: err,
          });
        } else {
          res.status(200).json("image uploaded successfully...!");
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: "something went wrong please try again ....",
    });
  }
};

//
// completed certificate

export const onCompletedCertificateKitFit = (req, res) => {
  const sql =
    "UPDATE `tasks` SET CompletedCertificate	 = ?, kit_end = ? WHERE id = ?";
  try {
    connection.query(
      sql,
      [req.body.completedCer, req.body.kitFit, req.params.id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            msg: err,
          });
        } else {
          res.status(200).json("image uploaded successfully...!");
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: "something went wrong please try again ....",
    });
  }
};
