const http = require('http')
const { bodyParser } = require('./lib/bodyParser')

let database = []

function getTaskHandler(req, res) {
    res.writeHead(200,{'Content-Type':'application/json'})
    res.write(JSON.stringify(database))
    res.end()
}

async function createTaskHandler(req, res) {
    try {
        await bodyParser(req)
        database.push(req.body)
        res.writeHead(200,{'Content-Type':'application/json'})
        // res.write(JSON.stringify(database))
        res.write(JSON.stringify(database))
        res.end()
    }catch (error) {
        res.writeHead(200,{'Content-Type':'text/plain'})
        res.write(JSON.stringify('Error al procesar la petición'))
        res.end()
    }
}

async function updateTaskHandler(req,res) {
    try{
        let { url } = req

        let idQuery = url.split("?")[1].split("=")

        if(idQuery[0]=="id"){
            await bodyParser(req)
            database[idQuery[1] - 1] = req.body
            res.writeHead(200,{'Content-Type':'application/json'})
            res.write(JSON.stringify(database))
            res.end()
        }else{
            res.writeHead(200,{'Content-Type':'text/plain'})
            res.write(JSON.stringify('Petición inválida'))
            res.end()
        }
    }catch (e) {
        res.writeHead(400,{'Content-Type':'text/plain'})
        res.write(JSON.stringify('No se pudo procesar la petición',e.message))
        res.end()
    }


}

async function deleteTaskHandler(req,res) {
    try{
        let { url } = req

        let idQuery = url.split("?")[1].split("=")

        if(idQuery[0]=="id"){
            // await bodyParser(req)
            database.splice(idQuery[1] - 1,1)
            res.writeHead(200,{'Content-Type':'application/json'})
            res.write(JSON.stringify(database))
            res.end()
        }else{
            res.writeHead(200,{'Content-Type':'text/plain'})
            res.write(JSON.stringify('Petición inválida'))
            res.end()
        }
    }catch (e) {
        res.writeHead(400,{'Content-Type':'text/plain'})
        res.write(JSON.stringify('No se pudo procesar la petición',e.message))
        res.end()
    }
}

const server = http.createServer((req,res)=>{
    const {url, method} = req

    // Logger
    console.log(`URL: ${url} - Method: ${method}`)

    switch (method) {
        case "GET":
            if(url==="/"){
                res.writeHead(200,{'Content-Type':'application/json'})
                res.write(JSON.stringify('Recibido'))
                res.end()
            }
            if(url==="/tasks"){
                getTaskHandler(req,res)
            }
            break
        case "POST":
            if(url === "/tasks"){
                createTaskHandler(req,res)
            }
            break
        case "PUT":
            updateTaskHandler(req,res)
            break
        case "DELETE":
            deleteTaskHandler(req,res)
            break
        default:
            res.writeHead(404,{'Content-Type':'text/plain'})
            res.write('Error en la petición')
            res.end()
    }
})

server.listen(3000)
console.log('Server listenning on port 3000')