const router = require("express").Router()
const User = require("../models/User")

// user update
router.put("/:id", async (req, res) => {
  // ログイン中またはDBの_idとreqのuserIdが同じの時
  if(req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
      })
      res.status(200).json("updated")
    } catch(err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json("It is not your account.")
  }
})

// user delete
router.delete("/:id", async (req, res) => {
  if(req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id)
      res.status(200).json("deleted")
    } catch(err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json("It is not your account.")
  }
})

// user get
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    // password, updatedAtをはずす
    const {password, updatedAt, ...other} = user._doc
    // 必要なものだけを返す
    res.status(200).json(other)
  } catch(err) {
    return res.status(500).json(err)
  }
})

// follow
// :idはフォローする相手のid
router.put("/:id/follow", async (req, res) => {
  // 自分はフォローできない
  if(req.body.userId !== req.params.id) {
    try {
      const followedUser = await User.findById(req.params.id)
      const followingUser = await User.findById(req.body.userId)

      if(!followedUser.followers.includes(req.body.userId)) {
        await followedUser.updateOne({
          $push: {
            followers: req.body.userId
          }
        })
        await followingUser.updateOne({
          $push: {
            followings: req.params.id
          }
        })
        
        return res.status(200).json("followed") 
      } else {
        return res.status(403).json("error") 
      }
      
    } catch(err) {
      return res.status(500).json("error!")
    }
  } else {
    return res.status(500).json("cannot follow yourself.")
  }
  
})

// unfollow
// :idはフォローする相手のid
router.put("/:id/unfollow", async (req, res) => {
  // 自分はフォロー解除できない
  if(req.body.userId !== req.params.id) {
    try {
      const followedUser = await User.findById(req.params.id)
      const followingUser = await User.findById(req.body.userId)

      // フォローされるユーザーの中にフォローするユーザーがすでにいない場合
      if(followedUser.followers.includes(req.body.userId)) {
        await followedUser.updateOne({
          $pull: {
            followers: req.body.userId
          }
        })
        await followingUser.updateOne({
          $pull: {
            followings: req.params.id
          }
        })
        
        return res.status(200).json("unfollowed") 
      } else {
        return res.status(403).json("error") 
      }
      
    } catch(err) {
      return res.status(500).json("error!")
    }
  } else {
    return res.status(500).json("cannot unfollow yourself.")
  }
  
})



// router.get("/", (req, res) => {
//   res.send("user router")
// })

module.exports = router