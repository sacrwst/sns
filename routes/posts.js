const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")

router.post("/", async (req, res) => {
  const newPost = new Post(req.body)
  try {
    // 保存
    const savedPost = await newPost.save()
    return res.status(200).json(savedPost)
  } catch(err) {
    return res.status(500).json(err)
  }
})

// 投稿の更新
router.put("/:id", async (req, res) => {
  try {
    // 対象の投稿を探す
    const post = await Post.findById(req.params.id) 
    // 本人の投稿か確認
    if(post.userId === req.body.userId) {
      await post.updateOne({
        // 全て更新
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

// 投稿の削除
router.delete("/:id", async (req, res) => {
  try {
    // 対象の投稿を探す
    const post = await Post.findById(req.params.id)
    if(post.userId === req.body.userId) {
      await post.deleteOne()
      return res.status(200).json("deleted.")
    } else {
      return res.status(403).json("It is not your post.")
    }
  } catch(err) {
    return res.status(500).json(err)
  }
})
// 投稿を取得
router.get("/:id", async (req, res) => {
  try {
    // 対象の投稿を探す
    const post = await Post.findById(req.params.id)
    return res.status(200).json(post)
  } catch(err) {
    return res.status(500).json(err)
  }
})

// 特定の投稿にいいね
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if(!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId
        }
      })
      
      return res.status(200).json("liked.") 
    } else {
      await post.updateOne({
        $pull: {
          likes: req.body.userId
        }
      })
      return res.status(403).json("unliked.") 
    }
    
  } catch(err) {
    return res.status(500).json("error!")
  }
  
})

// タイムラインの取得
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId)
    const userPosts = await Post.find({
      userId: currentUser._id
    })

    // フォローしている人の投稿を取得
    const friendPosts = await Promise.all(
      currentUser.followings.map(friendId => {
        return Post.find({userId: friendId})
      })
    )

    return res.status(200).json(userPosts.concat(...friendPosts)) 
  }catch(err) {
    return res.status(500).json("error!")
  }
  
})

module.exports = router