const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");

const User = require("../model/User");
const Post = require("../model/post");

/**
 * @description- Multer middleware for image upload
 * # uploded file will be in upload folder in root directory
 *
 */
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:|\./g, "") + file.originalname);
  },
});
const upload = multer({ storage: storage });

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
  "/signup",

  upload.single("image"),
  async (req, res) => {
    const { name, email, password, phone } = req.body;
    console.log("req.body", req.body);
    console.log("req.file", req.file);
    try {
      let user = await User.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists",
        });
      }

      user = new User({
        name,
        email,
        password,
        phone,
        image: req.file.path,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      ///  user.save();
      await user.save(function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          // res.status(201).json({
          //   message: "Account Created Successfully",
          //  });
        }
      });
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString_sid",
        {
          expiresIn: 10000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

/**
 * @method - POST
 * @param - /login
 * @description - User login
 */

router.post(
  "/login",

  async (req, res) => {
    console.log("req.body", req.body);
    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email: req.body.email,
      });
      console.log("user:", user);
      if (!user)
        return res.status(400).json({
          message: "User Not Exist",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !",
        });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString_sid",
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

/**
 * @method - Get
 * @description - Get LoggedIn User
 * @param - /user/me
 */

router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

/**
 * @method - POST
 * @param - /addPost
 * @description - User Post add
 */

router.post("/addPost", auth, async (req, res) => {
  const { titel, description } = req.body;
  console.log("req.body", req.body);
  try {
    post = new Post({
      titel,
      description,
      // owner--  which person this post belong
      owner: req.user.id,
    });

    await post.save(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.status(201).json({
          message: "Psost Created Successfully",
        });
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
});

/**
 * @method - Get
 * @description - Get wise post list
 * @param - /user/me/post
 */

router.get("/me/post", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    //afer this geeting user wise post
    const post = await Post.find({ owner: req.user.id });
    res.json(post);
  } catch (e) {
    res.send({ message: "Error in Fetching post" });
  }
});

module.exports = router;
