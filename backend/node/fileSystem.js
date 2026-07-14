const fs = require('fs')

//-------READ FILE 
//sync blocking
try {
    const data = fs.readFileSync('./file.txt','utf8')
    console.log(data)
} catch (error) {
    console.log(error)
}

//async non blocking 
fs.readFile('./file.txt', 'utf-8', (err,data)=>{
    if(err){
        console.error('Error: ',err)
        return
    }
    console.log(data)
})

//-----------write file
//sync 
fs.writeFileSync('./output.txt',"Hello World")

//async
fs.writeFile('./output.txt','Hello world',(err)=>{
    if(err) console.error(err)
    console.log('file saved')
})