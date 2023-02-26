const router = require("express").Router()
const Post = require("../models/Post")

router.post("/", async (req, res) => {
  const newPost = new Post(req.body)
  try {
    const savedPost = await newPost.save()
    return res.status(200).json(savedPost)
  } catch(err) {
    return res.status(500).json(err)
  }
})

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id) 
    if(post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body
      })
      return res.status(200).json("edited.")
    } else {
      return res.status(403).json("It is not your post.")
    }
  } catch(err) {
    return res.status(500).json(err)
  }
})

// router.get("/", (req, res) => {
//   res.send("posts router")
// })

module.exports = router