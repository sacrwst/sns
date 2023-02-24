const router = require("express").Router()
const User = require("../models/User")


// user update
router.put("/:id", async (req, res) => {
  if(req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
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
      const user = await User.findByIdAndDelete(req.params.id)
      res.status(200).json("deleted")
    } catch(err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403)
  }
})

// router.get("/", (req, res) => {
//   res.send("user router")
// })

module.exports = router