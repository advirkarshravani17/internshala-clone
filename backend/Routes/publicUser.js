const router = require("express").Router();
const User = require("../Model/User");
const Post = require("../Model/Post");

/* GET PUBLIC USER PROFILE */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name email profilePhoto friends");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET POSTS FOR PUBLIC USER PROFILE */
router.get("/:id/posts", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
