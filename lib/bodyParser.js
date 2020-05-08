function bodyParser(request){
    return new Promise((resolve,reject)=>{
        let totalData =''
        request
                .on('data', chunk =>{
                    totalData += chunk
                })
                .on('end',()=>{
                    //Pudo haber sido cualquier nombre de propiedad
                    request.body = JSON.parse(totalData)
                    resolve()
                })
                .on('error', error =>{
                    console.log(error)
                    reject()
                })
    })
}

module.exports = { bodyParser }