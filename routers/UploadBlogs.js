const blogUpload = require("express").Router();
const Blogs = require("../models/Blog");
const UserModel = require("../models/UserSignup");
const userReqCounts = new Map();
const maxreq = 5;
const Timelimit = 60 * 60 * 10000;

blogUpload.post("/blogs/:userjwt", async (req, res) => {
  try {
    const token = req.params.userjwt;
    if (!token) {
      res.status(404).send("You must be logged in");
    }
    // Protect the server from spamming reqs
    const reqData = userReqCounts.has(token);

    if (reqData) {
      const currentTime = new Date().getTime();

      if (currentTime - reqData.startTime >= Timelimit) {
        reqData.startTime = currentTime;

        reqData.count = 1;
      } else if (reqData.counter > maxreq) {
        res.status(429).json({ error: "Too many requests" });
      }
    } else {
      const { title, image, sections } = req.body;
      const blog = new Blogs({
        token,
        title,
        image,
        sections,
      });

      await blog.save();

      userReqCounts.set(token, { startTime: new Date().getTime(), count: 1 });
      console.log(userReqCounts);

      res.json({ messgae: "sucess" }).status(200);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

blogUpload.put("/blogs/:userjwt/:blogid", async (req, res) => {
  try {
    const token = req.params.userjwt;
    const blogId = req.params.blogid;
    const blogData = req.body;

    const userExits = await UserModel.findById(token);
    const blog = await Blogs.findById(blogId);

    if (!userExits) {
      res.status(404).json({ error: "User not found" });
    }

    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
    }

    await Blogs.findByIdAndUpdate(blogId, blogData, { new: true });

    res.status(200).json({ message: "Blog Updated" });

    res.send(blog);
  } catch (error) {
    console.log(error);
  }
});

module.exports = { blogUpload };
