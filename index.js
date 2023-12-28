import express from "express";
import cors from "cors";
import mysql from "mysql";
import bodyParser from "body-parser";
// import fast2sms from "fast-two-sms";

const app = express();
app.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "electiondb",
});

const PORT = "5002";

connection.connect(function (err) {
  if (err) {
    console.log(err);
  }
  app.listen(PORT, () => {
    console.log(`app listen port number ${PORT}...!`);
  });
});

app.post("/register", async (req, res) => {
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
    votUrl,
    adhrUrl,
  } = req.body;

  try {
    const fistSql = "SELECT * FROM `users` WHERE phone like ? ";
    const validatedEmail = connection.query(fistSql, ["%" + phone + "%"]);

    console.log(validatedEmail.length);
    // res.json({ num: validatedEmail.length });

    if (validatedEmail.length > 0) {
      return res.status(401).json({
        msg: "Username already exists",
      });
    }

    var sql =
      "INSERT INTO users(state, district, assembly, name,email,phone,phonepe,address,voteridnumber,adharnumber,voteridurl,adharidurl) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";

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
        votUrl,
        adhrUrl,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("user added successfully....!");
          console.log(result);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  const { phone } = req.body;
  // console.log(phone);
  const sql = "SELECT * FROM `users` WHERE phone = ? ";
  try {
    connection.query(sql, [+phone], (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result) {
          // console.log(result);
          res.json(result);
        } else {
          res.json("user does't exist ....! ");
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
});

// edit profile route

app.put("/update-profile/:id", async (req, res) => {
  // console.log(req.body.State);
  try {
    await connection.query(
      "UPDATE `users` SET state = ?, district = ?, name = ?, 	phone = ?, phonepe = ?, address=?, voteridnumber=?, adharnumber=? WHERE id = ?;",
      [
        req.body.state,
        req.body.district,
        req.body.name,
        req.body.phone,
        req.body.phonepe,
        req.body.address,
        req.body.voteridnumber,
        req.body.adharnumber,
        req.params.id,
      ]
    );
    res.status(200).json({
      resp: true,
      msg: "updates the cams details",
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

app.get("/score-user", async (req, res) => {
  const sql =
    "SELECT id, state,district,name,phone, phonepe,score FROM `users` ";
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

app.post("/add-task-user", async (req, res) => {
  console.log(req.body);
  try {
    await connection.query(
      "INSERT INTO tasks(PS_name,AC_name,PS_No,AC_No,user_id ) VALUES(?,?,?,?,?)",
      [
        req.body.psname,
        req.body.acname,
        req.body.psnumber,
        req.body.acnumber,
        req.body.id,
      ],
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
    "SELECT name,phone,PS_No,AC_No,PS_name,AC_name FROM tasks INNER JOIN users ON users.id = tasks.user_id WHERE PS_No = ? OR AC_No = ?";

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
