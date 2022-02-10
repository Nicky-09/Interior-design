const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const PORT = 3002;
var jwt = require("jsonwebtoken");
// db connection
const MongoDB_URI = "mongodb://localhost/log";
mongoose
  .connect(MongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));
//Schema
var Schema = mongoose.Schema;
let User = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [],
});

var usersModel = mongoose.model("users", User);
// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/static", express.static("public"));
app.use(cors());
app.get("/", (req, res) => {
  res.sendFile(__dirname + `/public/index.html`);
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + `/public/login.html`);
});
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});
app.get("/index", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
// app.get("/signup", (req, res) => {
//   res.sendFile(__dirname + "/public/register.html");
// });
app.get("/bathroom", (req, res) => {
  res.sendFile(__dirname + "/public/bathroom.html");
});

app.get("/aboutus", (req, res) => {
  res.sendFile(__dirname + "/public/aboutus.html");
});

app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/public/contact.html");
});

app.get("/kitchen", (req, res) => {
  res.sendFile(__dirname + "/public/kitchen.html");
});

app.get("/office", (req, res) => {
  res.sendFile(__dirname + "/public/office.html");
});

app.get("/wardrobe", (req, res) => {
  res.sendFile(__dirname + "/public/wardrobe.html");
});

app.get("/pricing", (req, res) => {
  res.sendFile(__dirname + "/public/pricing.html");
});

app.get("/wardrobe", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/wardrobe.html"));
});

//post routes
app.post("/register", (req, res) => {
  usersModel
    .findOne({ email: req.body.email })
    .then((data) => {
      if (!data) {
        bcrypt.hash(req.body.password, 10, (err, hashed) => {
          let sData = new usersModel();
          sData.firstName = req.body.firstName;
          sData.lastName = req.body.lastName;
          sData.email = req.body.email;
          sData.password = hashed;

          sData.save();
          res.send({ error: false, message: "User Added" });
        });
      } else {
        res.send({ error: true, message: "User already present" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: true, message: err });
    });
});

app.post("/login", (req, res) => {
  console.log(req.body);
  usersModel
    .findOne({ email: req.body.email })
    .then((data) => {
      if (data) {
        bcrypt.compare(req.body.password, data.password, (err, result) => {
          if (err) console.log(err);
          if (result) {
            console.log("matched");
            let token = jwt.sign({ id: data._id }, "secret", {
              expiresIn: 86400,
            });
            res.send({ error: false, message: "Verified User", token });
          } else {
            res.send({ error: true, message: "Password doesn't match" });
          }
        });
      } else {
        res.send({ error: true, message: "User not present" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: true, message: "User not present" });
    });
});

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  jwt.verify(authHeader, "secret", (err, user) => {
    if (err) console.log(err);
    if (err) return res.send({ error: true, message: "Auth failed" });
    req.user = user;
    next();
  });
}
app.post("/addtocart", checkToken, (req, res) => {
  console.log(req.user.id);
  console.log(req.body);

  usersModel.findById(req.user.id).then((data) => {
    data.cart.push(req.body);
    data.save();
  });
});

app.get("/getcart", checkToken, (req, res) => {
  usersModel.findById(req.user.id).then((data) => {
    res.send({ error: false, message: data.cart });
  });
});
app.listen(PORT, () => {
  console.log(`server is up and running on ${PORT}`);
});
