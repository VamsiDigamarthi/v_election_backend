import { connection } from "../Database/Database.js";

export const createChat = (req, res) => {
  const exitSql = "SELECT * FROM `chat` WHERE sender = ? AND receiver = ?";

  try {
    connection.query(
      exitSql,
      [req.body.sender, req.body.received],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            msg: error,
          });
        }
        if (result.length) {
          res.status(500).json({
            resp: true,
            msg: "User Already Exist",
          });
        } else {
          const sql = "INSERT INTO `chat`(sender, receiver) VALUES(?,?)";
          connection.query(
            sql,
            [req.body.sender, req.body.received],
            (err, result) => {
              if (err) {
                return res.status(500).json({
                  msg: err,
                });
              }
              res.status(200).json("Chart Created successfullt ..!");
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

//
// get chat

export const getSpecificChart = (req, res) => {
  const sql = "SELECT * FROM `chat` WHERE sender = ? AND receiver = ?";

  try {
    connection.query(
      sql,
      [req.params.sender, req.params.receiver],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            msg: error,
          });
        } else {
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

// send message

export const sendMessage = (req, res) => {
  //   console.log("send message");
  const sql = "INSERT INTO `message`(chat_id, sender_id, text) VALUES(?,?,?)";
  try {
    connection.query(
      sql,
      [req.body.chartID, req.body.sender, req.body.text],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            msg: err,
          });
        } else {
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
//
export const getAllMessages = (req, res) => {
  const sql = "SELECT * FROM `message` WHERE chat_id = ?";
  try {
    connection.query(sql, [req.params.chartId], (err, result) => {
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
