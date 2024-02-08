import { connection } from "../Database/Database.js";
import fetch from "node-fetch";
export const signUp = (req, res) => {
  let mandals = req.body.mandal;
  mandals = mandals.toLowerCase();

  const {
    phone,
    name,
    email,
    state,
    dist,
    assembly,
    address,
    phonepe,
    voteridnumber,
    adharnumber,
    voterIdImage,
    adharIdImage,
    // mandal,
    password,
  } = req.body;
  const exitSql = "SELECT * FROM `users` WHERE phone = ?";
  try {
    connection.query(exitSql, [req.body.phone], (err, result) => {
      if (err) return err;
      if (result.length) {
        res.status(500).json({
          resp: true,
          msg: "User Already Exist",
        });
      } else {
        const sql =
          "INSERT INTO users(state, district, assembly, name,email,phone,phonepe,address,voteridnumber,adharnumber,voteridurl,adharidurl, mandal,password) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        connection.query(
          sql,
          [
            state,
            dist,
            assembly,
            name,
            email,
            phone,
            phonepe,
            address,
            voteridnumber,
            adharnumber,
            voterIdImage,
            adharIdImage,
            mandals,
            password,
          ],
          (err, result) => {
            if (err) {
              res.status(200).json({
                resp: true,
                msg: err,
              });
            }

            res.status(200).json({
              resp: true,
              msg: "Registration Successfully ..!",
            });
          }
        );
      }
    });
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
};

export const sendOtp = (req, res) => {
  const { phone } = req.body;
  const exitUser = "SELECT * FROM `users` WHERE phone = ?";
  connection.query(exitUser, [phone], (err, result) => {
    if (err) return err;
    if (result.length) {
      return res.status(500).json({
        resp: true,
        msg: "User Already Exist",
      });
    } else {
      const existOtp = "SELECT * FROM `otp` WHERE phone = ?";

      connection.query(existOtp, [phone], (err, result) => {
        if (err) {
          return res.status(500).json({
            resp: true,
            msg: err,
          });
        }
        if (result.length) {
          var otp = Math.floor(1000 + Math.random() * 9000);
          fetch(
            `https://pgapi.vispl.in/fe/api/v1/multiSend?username=btrak.trans&password=H6pxA&unicode=false&from=BTRACK&to=91${phone}&dltPrincipalEntityId=1201159541316676305&dltContentId=1207161517681422152&text=Dear Maruthi Your OTP is. ${otp} Regards, Brihaspathi Technologies`
          )
            .then(() => {
              const updateOtp =
                "UPDATE `otp` SET otp_value = ? WHERE phone = ?";
              connection.query(updateOtp, [otp, phone], (err, result) => {
                if (err) {
                  return res.status(500).json({
                    msg: err,
                  });
                } else {
                  res.status(200).json({ msg: "otp send" });
                }
              });
            })
            .catch((e) => console.log(e));
        } else {
          var otp = Math.floor(1000 + Math.random() * 9000);
          fetch(
            `https://pgapi.vispl.in/fe/api/v1/multiSend?username=btrak.trans&password=H6pxA&unicode=false&from=BTRACK&to=91${phone}&dltPrincipalEntityId=1201159541316676305&dltContentId=1207161517681422152&text=Dear Maruthi Your OTP is. ${otp} Regards, Brihaspathi Technologies`
          )
            .then(() => {
              const storeOtp =
                "INSERT INTO `otp`(phone, otp_value) VALUES(?,?)";
              connection.query(storeOtp, [phone, otp], (err, result) => {
                if (err) {
                  return res.status(500).json({
                    msg: err,
                  });
                } else {
                  res.status(200).json({ msg: "otp send" });
                }
              });
            })
            .catch((e) => console.log(e));
        }
      });
    }
  });
};

export const verifyOtp = (req, res) => {
  let mandals = req.body.mandal;
  mandals = mandals.toLowerCase();

  const {
    phone,
    name,
    email,
    state,
    dist,
    assembly,
    address,
    phonepe,
    voteridnumber,
    adharnumber,
    voterIdImage,
    adharIdImage,
    // mandal,
    password,
    otp,
  } = req.body;

  const existUserOtp = "SELECT * FROM `otp` WHERE phone = ?";
  connection.query(existUserOtp, [phone], (err, result) => {
    if (err) {
      return res.status(500).json({
        msg: err,
      });
    }
    if (result.length) {
      const dbOtp = result[0]?.otp_value;
      if (otp === dbOtp) {
        const sql =
          "INSERT INTO users(state, district, assembly, name,email,phone,phonepe,address,voteridnumber,adharnumber,voteridurl,adharidurl, mandal,password,role) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        connection.query(
          sql,
          [
            state,
            dist,
            assembly,
            name,
            email,
            phone,
            phonepe,
            address,
            voteridnumber,
            adharnumber,
            voterIdImage,
            adharIdImage,
            mandals,
            password,
            req.body.role,
          ],
          (err, result) => {
            if (err) {
              return res.status(200).json({
                resp: true,
                msg: err,
              });
            }

            return res.status(200).json({
              resp: true,
              msg: "Registration Successfully ..!",
            });
          }
        );
      } else {
        return res.status(500).json({
          msg: "Otp Invalid",
        });
      }
    } else {
      return res.status(500).json({
        msg: "User Not Found",
      });
    }
  });
};

export const login = (req, res) => {
  const { phone } = req.body;
  const sql = "SELECT * FROM `users` WHERE phone = ? ";
  try {
    connection.query(sql, [phone], (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result.length) {
          return res.status(200).json(result);
          // if (result[0]?.password === req.body.password) {
          //   return res.status(200).json(result);
          // } else {
          //   res.status(500).json("password does't correct");
          // }
        } else {
          res.status(500).json("user does't exist ....! ");
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export const loginOtp = (req, res) => {
  const { phone } = req.body;
  // console.log(phone);

  const existUser = "SELECT * FROM `users` WHERE phone = ? ";
  connection.query(existUser, [phone], (err, result) => {
    if (err) {
      return res.status(500).json({
        resp: true,
        msg: err,
      });
    }
    if (result.length) {
      const existOtp = "SELECT * FROM `otp` WHERE phone = ?";
      connection.query(existOtp, [phone], (err, result) => {
        if (err) {
          return res.status(500).json({
            resp: true,
            msg: err,
          });
        }
        if (result.length) {
          var otp = Math.floor(1000 + Math.random() * 9000);
          fetch(
            `https://pgapi.vispl.in/fe/api/v1/multiSend?username=btrak.trans&password=H6pxA&unicode=false&from=BTRACK&to=91${phone}&dltPrincipalEntityId=1201159541316676305&dltContentId=1207161517681422152&text=Dear Maruthi Your OTP is. ${otp} Regards, Brihaspathi Technologies`
          )
            .then(() => {
              const updateOtp =
                "UPDATE `otp` SET otp_value = ? WHERE phone = ?";
              connection.query(updateOtp, [otp, phone], (err, result) => {
                if (err) {
                  return res.status(500).json({
                    msg: err,
                  });
                } else {
                  res.status(200).json({ msg: "otp send" });
                }
              });
            })
            .catch((e) => console.log(e));
        }
      });
    } else {
      return res.status(500).json({ msg: "User Does't Exist" });
    }
  });
};

export const loginVerifyOtp = (req, res) => {
  const { phone, otp } = req.body;

  const exitOtp = "SELECT * FROM `otp` WHERE phone = ?";
  connection.query(exitOtp, [phone], (err, result) => {
    if (err) {
      return res.status(500).json({
        resp: true,
        msg: err,
      });
    }
    if (result.length) {
      const dbOtp = result[0]?.otp_value;
      if (otp === dbOtp) {
        const sql = "SELECT * FROM `users` WHERE phone = ? ";

        connection.query(sql, [phone], (err, result) => {
          if (err) {
            return res.status(500).json({
              resp: true,
              msg: err,
            });
          } else {
            return res.status(200).json(result);
          }
        });
      } else {
        return res.status(500).json("Otp Invalid");
      }
    }
  });
};
