const express = require("express")

const app = express()

// middle ware global
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// routes

app.get("/", (req, res)=>{
    res.send("Hello world!")
})

app.get("/api/users", (req, res)=>{
    res.json({users: ['Ali', 'Ahmad', 'Sara']})
})

app.get("/api/users/:id", (req, res)=>{
    const id = req.params;
    res.json({id, name: 'Ali'})
})

app.post('/api/users', (req, res)=>{
    const {name, email} = req.body
    res.status(201).json({id: 1, name, email})
})

app.put("/api/users/:id", (req, res)=>{
    const id = req.params
    const {name} = req.body
    res.json({id, name, updated: true})


})


app.delete("/api/users/:id", (req, res)=>{
    const id = req.params
    res.json({id, deleted: true})
})

// start the server

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log("Server is running on the port ", PORT)
})
