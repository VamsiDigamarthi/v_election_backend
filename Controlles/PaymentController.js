import { connection } from "../Database/Database.js";

export const initialPaymentAdminInitiatedDetails = (req, res) => {
  const sql =
    "SELECT pay_mode_admin, pay_mode_user, 	payment_text_user FROM `users` WHERE id = ?";
  try {
    connection.query(sql, [req.params.id], (err, result) => {
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

// payment receved accepted

export const onPaymentModeAccepted = (req, res) => {
  const sql =
    "UPDATE `users` SET pay_mode_user = ?, payment_text_user = ?  WHERE id = ?";
  try {
    connection.query(
      sql,
      [req.body.paymentmode, req.body.paymentText, req.params.id],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json("Payment Details Updated Successfully ...!");
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
};

// payment text display but not recevied payment by click no btn

export const paymnetNotReceived = (req, res) => {
  const sql =
    "UPDATE `users` SET pay_mode_user = ?, payment_text_user = ?  WHERE id = ?";
  try {
    connection.query(
      sql,
      [req.body.paymentuserMode, req.body.paymentText, req.params.id],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json("Your Complaint Accepted ");
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
};

// payment recev accepted

export const paymentModeConfirm = (req, res) => {
  const sql = "UPDATE `users` SET pay_mode_user = ? WHERE id = ?";
  try {
    connection.query(
      sql,
      [req.body.paymentuserMode, req.params.id],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json("Payment Recevived Confirmation .....!");
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
};
