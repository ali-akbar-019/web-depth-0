const express = require("express")
const router = express.Router()

router.get("/", (req, res)=>{
    res.json({users: []})
})

router.get("/:id", (req, res)=>{
    res.json({id: req.params.id})
})


router.post('/', (req, res)=>{
    const {name, email} = req.body;
    res.status(201).json({name, email})
})

router.delete("/:id", (req, res)=>{
    const id = req.params
    res.json({id, deleted: true})
})


module.exports  = router

// app.use("/api/users", userRoutes)