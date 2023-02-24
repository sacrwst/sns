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
    const {password, updatedAt, ...other} = user._doc
    res.status(200).json(other)
  } catch(err) {
    return res.status(500).json(err)
  }
})



// router.get("/", (req, res) => {
//   res.send("user router")
// })

module.exports = router