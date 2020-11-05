const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const User = require("../models/").user;
const Listing = require("../models/").listing
const { SALT_ROUNDS } = require("../config/constants");

const router = new Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({ where: { email }});

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: "User with that email not found or password incorrect"
      });
    }

    delete user.dataValues["password"]; // don't send back the password hash
    const token = toJWT({ userId: user.id });
    return res.status(200).send({ token, ...user.dataValues });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/signup", async (req, res) => {
  const { name, surname, email, password, image, lat, lng } = req.body;
  if (!email || !password || !name) {
    return res.status(400).send("Please provide an email, password and a name");
  }

  try {
    const newUser = await User.create({
      name,
      surname,
      email,
      password: bcrypt.hashSync(password, SALT_ROUNDS),
      image,
      lat,
      lng
    });

    delete newUser.dataValues["password"]; // don't send back the password hash

    const token = toJWT({ userId: newUser.id });

    res.status(201).json({ token, ...newUser.dataValues });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .send({ message: "There is an existing account with this email" });
    }

    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

// The /me endpoint can be used to:
// - get the users email & name using only their token
// - checking if a token is (still) valid
router.get("/mypage", authMiddleware, async (req, res) => {
  const user = await User.findOne({
    where: { id: req.user.id },
    include: [{ model: Listing }], 
  });

  if (!user.userId === req.user.id) {
    return res.status(404).send({ message: "Unauthorised access" });
  }

  delete req.user.dataValues["password"];
  res.status(200).send({ ...req.user.dataValues, user });
});


router.post("/create", authMiddleware, async (req, res) => {
  const user = req.user;

  if (user === null) {
    return res.status(404).send({ message: "Does not exist" });
  }

  if (!user.userId === req.user.id) {
    return res.status(403).send({ message: "Unauthorised Request" });
  }

  const { title, description, image, categoryId } = req.body;

  if (!title || !description || !image || !categoryId) {
    return res
      .status(400)
      .send({ message: "Please fill all the required fields!" });
  }

  const newListing = await Listing.create({
    title,
    description,
    image,
    availability: "available",
    userId: user.id,
    categoryId
  });

  delete req.user.dataValues["password"];
  res.status(201).send({
    message: "Listing created",
    ...req.user.dataValues,
    newListing,

  });
});

module.exports = router;
