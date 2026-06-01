const jwt = require("jsonwebtoken")

const generateJWT = (username = "", role = "") =>{
    return new Promise( (resolve, reject)=>{
        const payload = { username, role }
        jwt.sign(payload, process.env.SECRET_KEY ,{
            expiresIn: "4h"
        }, (error, token)=>{
            if(error){
                console.log(error);
                reject("No se pudo generar el token")
            }else{
                resolve(token);
            }
        })
    } )
}

module.exports = {generateJWT} ;