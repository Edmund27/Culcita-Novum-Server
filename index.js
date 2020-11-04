require('dotenv').config()
const express = require("express");
const loggerMiddleWare = require("morgan");
const corsMiddleWare = require("cors");
const { PORT } = require("./config/constants");

const authRouter = require("./routers/auth");
const authMiddleWare = require("./auth/middleware");
const listingsRouter = require("./routers/listings")
const categoriesRouter = require("./routers/categories")

const app = express();


app.use(loggerMiddleWare("dev"));
const bodyParserMiddleWare = express.json();
app.use(bodyParserMiddleWare);
app.use(corsMiddleWare());

if (process.env.DELAY) {
  app.use((req, res, next) => {
    setTimeout(() => next(), parseInt(process.env.DELAY));
  });
}


app.get("/", (req, res) => {
  res.send("Hi from express");
});

app.post("/echo", (req, res) => {
  res.json({
    youPosted: {
      ...req.body,
    },
  });
});

app.post("/authorized_post_request", authMiddleWare, (req, res) => {
  const user = req.user;
  delete user.dataValues["password"];

  res.json({
    youPosted: {
      ...req.body,
    },
    userFoundWithToken: {
      ...user.dataValues,
    },
  });
});

//ROUTERS:________________________________
app.use("/", authRouter);
app.use("/listings", listingsRouter)
app.use("/categories", categoriesRouter)
//________________________________________

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
