import express from "express";
import cors from "cors";
import mysql from "mysql";
import bodyParser from "body-parser";
// import multer from "multer";
// import fast2sms from "fast-two-sms";

const app = express();
app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "electiondb",
});

const PORT = "5000";

connection.connect(function (err) {
  if (err) {
    console.log(err);
  }
  app.listen(PORT, () => {
    console.log(`app listen port number ${PORT}...!`);
  });
});

app.post("/register", (req, res) => {
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
});

app.post("/login", async (req, res) => {
  const { phonenumber } = req.body;
  // console.log(phonenumber);
  const sql = "SELECT * FROM `users` WHERE phone = ? ";
  try {
    connection.query(sql, [phonenumber], (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result.length) {
          // console.log(result);
          // res.status(200).json(result[0]?.password);
          if (result[0]?.password === req.body.password) {
            return res.status(200).json(result);
          } else {
            res.status(500).json("password does't correct");
          }
        } else {
          res.status(500).json("user does't exist ....! ");
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
});

// get User Whene is Login

app.get("/user-get-profile/:id", (req, res) => {
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
});

// edit profile route

app.put("/update-profile/:id", async (req, res) => {
  // console.log(req.body.State);
  try {
    await connection.query(
      "UPDATE `users` SET name = ?, 	phone = ?, phonepe = ?, address=? WHERE id = ?;",
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
});

//
// update the score of user
//

app.put("/update-score/:id", async (req, res) => {
  try {
    await connection.query("UPDATE `users` SET score = ? WHERE id = ?;", [
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
});

//
// based on Score data fetch
//

// fect score whene user open learning stage start

app.get("/only-score/:id", (req, res) => {
  const sql = "SELECT score FROM `users` WHERE id = ?";
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
});

// fect score whene user open learning stage end

app.get("/score-user", async (req, res) => {
  const sql =
    "SELECT id, state,district,name,phone, phonepe,score, mandal FROM `users` WHERE score >= '8' ";
  try {
    // await connection.query("SELECT * FROM `users` WHERE score >= ?;", ["4"]);
    // res.status(200).json({
    //   resp: true,
    //   msg: "updates the Score details",
    // });
    connection.query(sql, (err, result) => {
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
});

//
// user based on score filter
//

app.post("/score-user-based-on-score", async (req, res) => {
  const sql =
    "SELECT id, state,district,name,phone,phonepe,score FROM `users` WHERE score = ?; ";
  try {
    connection.query(sql, [req.body.score], (err, result) => {
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
});

//
// add task to user api
// "UPDATE `tasks` SET task = ?, user_id = ?;",

app.post("/add-task-user/:id", async (req, res) => {
  // console.log(req.body);
  try {
    await connection.query(
      "INSERT INTO tasks(PS_name,AC_name,PS_No,AC_No,user_id ) VALUES(?,?,?,?,?)",
      [
        req.body.psname,
        req.body.acname,
        req.body.psnumber,
        req.body.acnumber,
        req.params.id,
      ],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json("task added successfully..!");
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
});

//
// get task based on id
//

app.get("/fetch-task/:id", async (req, res) => {
  const sql = "SELECT * FROM `tasks` WHERE user_id = ? ";

  try {
    await connection.query(sql, [req.params.id], (err, result) => {
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
});

//
// update the task status
//

app.put("/update-task/:id", async (req, res) => {
  const sql = "UPDATE `tasks` SET action = ?  WHERE id = ? ";
  try {
    await connection.query(
      sql,
      [req.body.action, req.params.id],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json("updated task successfully ...!");
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
});

//
// admin-fetch-user-and-task-data
//

app.post("/ps-ac-number", async (req, res) => {
  // console.log(req.body);

  const sql =
    "SELECT name,phone,PS_No,AC_No,PS_name,AC_name,	kitstatus, tasks.id  FROM tasks INNER JOIN users ON users.id = tasks.user_id WHERE PS_No = ? OR AC_No = ?";

  try {
    await connection.query(
      sql,
      [req.body.psnumber, req.body.acnumber],
      (err, result) => {
        if (err) {
          throw err;
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
});

//
// upload images from server side
//

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });
// const upload = multer({ storage: storage });

app.post("/img-upload-sever-ps-ac/:id", async (req, res) => {
  const sql =
    "UPDATE `tasks` SET installationImage = ? , InstallationCertificate = ? ,CompletedCertificate=?  WHERE id = ? ";
  try {
    await connection.query(
      sql,
      [
        req.body.installationImage,
        req.body.InstallationCertificate,
        req.body.CompletedCertificate,
        req.params.id,
      ],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json("updated task successfully ...!");
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
});

app.put("/kit-status-update/:id", async (req, res) => {
  console.log(req.body.kitStatus.kit);
  console.log(req.params);

  const sql = "UPDATE `tasks` SET kitstatus = ? WHERE id = ?";

  try {
    await connection.query(
      sql,
      [req.body.kitStatus.kit, req.params.id],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json("updated task successfully ...!");
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
});

//
// all rejected task data fetch
//
app.get("/rejected-task-data", async (req, res) => {
  const sql = "SELECT * FROM `tasks` WHERE action = ?";
  try {
    await connection.query(sql, ["rejected"], (err, result) => {
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
});

//
// rejecte task based user data fetch throught AC NAME

app.get(
  "/rejected-user-data-fetch-basedon-acname/:acname/user/:userId",
  async (req, res) => {
    // console.log(req.params.userId);
    // console.log(req.params.acname);
    const sql = "SELECT * FROM `users` WHERE assembly = ? AND id <> ?";

    try {
      await connection.query(
        sql,
        [req.params.acname, req.params.userId],
        (err, result) => {
          if (err) {
            throw err;
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
  }
);

//
// rejected task added to remaining user
//

app.put("/rejected-task-update-specific-user", async (req, res) => {
  const sql = "UPDATE `tasks` SET action = ?, user_id = ? WHERE id = ?";
  // console.log(req.body.userId);
  // console.log(req.body.id);
  try {
    await connection.query(
      sql,
      ["initiated", req.body.userId, req.body.id],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json("updated task successfully ...!");
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
});

// SERACH USERS BASED ON MANDALS

app.get("/search-user-basedon-mandal/:mandal", (req, res) => {
  const sql = "SELECT name FROM `users` WHERE mandal = ?";

  try {
    connection.query(sql, [req.params.mandal], (err, result) => {
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
});

//
// newly added future
//
// new features added
//
// kit start image fetch

app.put("/kit-start-image/upload/:id", (req, res) => {
  const sql = "UPDATE `tasks` SET kit_start = ? WHERE id = ?";
  try {
    connection.query(sql, [req.body.image, req.params.id], (err, result) => {
      if (err) {
        throw err;
      } else {
        res.status(200).json("image uploaded successfully...!");
      }
    });
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
});

//
// kit start image fetch

//
// installation certificate and image

app.put("/installation-certificate-image/:id", (req, res) => {
  const sql =
    "UPDATE `tasks` SET InstallationCertificate	 = ?, installationImage = ? WHERE id = ?";
  try {
    connection.query(
      sql,
      [req.body.instaCer, req.body.instaImg, req.params.id],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json("image uploaded successfully...!");
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
});

//
// installation certificate and image end

//
// completed certificate and image

app.put("/completed-certificate-kit-fitting-img/:id", (req, res) => {
  const sql =
    "UPDATE `tasks` SET CompletedCertificate	 = ?, kit_end = ? WHERE id = ?";
  try {
    connection.query(
      sql,
      [req.body.completedCer, req.body.kitFit, req.params.id],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json("image uploaded successfully...!");
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      msg: error,
    });
  }
});

//
// completed certificate and image end

//
// payment pay or not actions take admin start
// user initial fetch data form payment all modes

app.get("/payment-mode-admin-to-user/:id", (req, res) => {
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
});

// admin change payment mode
// like admin paymnet send to user

app.put("/payment-mode-admin-update/:id", (req, res) => {
  const sql = "UPDATE `users` SET pay_mode_admin = ?  WHERE id = ?";
  try {
    connection.query(
      sql,
      [req.body.paymentmode, req.params.id],
      (err, result) => {
        if (err) {
          throw err;
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
});

// user upload payment receviced or not
// like received the payment
// user click yes
app.put("/payment-mode-user-update/:id", (req, res) => {
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
});

// payment failure case no payment recevied
// user click no
app.put("/payment-mode-user-update-two-mode/:id", (req, res) => {
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
});

// district coordanator msg show and confirm payment
// user confirm click
app.put("/payment-mode-user-confirm/:id", (req, res) => {
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
});

// payment not receved fetch corresponding ditrict coordanate details

app.get("/fetch-district-coordinator/:district", (req, res) => {
  const sql = "SELECT name, phone FROM `users` WHERE district = ? AND role = ?";
  try {
    connection.query(sql, [req.params.district, "2"], (err, result) => {
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
});

//
// payment pay or not actions take admin end
//
