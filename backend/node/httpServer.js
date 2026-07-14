const http = require('http')

// create server
const server = http.createServer((req,res)=>{
    // req: request
    // res: response
    
    console.log(req.url)
    console.log("method: ", req.method)

    // 
    if(req.url === '/'){
        res.writeHead(200, {"content-type": "text/html"})
        res.end('<h1>Hello world</h1>')

    }else if(req.url === '/api'){
        res.writeHead(200, {'content-type': "application/json"})
        res.end(JSON.stringify({message: 'hello Api'}))
    }else{
        res.writeHead(404)
        res.end("not found")
    }
})

// start server
const PORT = 3000
server.listen(PORT, ()=>{
    console.log("Server running on http://localhost:", PORT)
})

const https = require('https')
https.get("", (res)=>{
    let data = '';
    res.on("data", (chunk)=>{
        data += chunk
    })
    res.on("end", ()=>{
        console.log(JSON.parse(data))

    })
}).on("error", err=>{
    console.log("Error: ", err)
})