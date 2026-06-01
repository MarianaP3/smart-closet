const mongoose = require("mongoose");

const connectDB = () =>{
    mongoose.connect(process.env.CONNECTION_STRING, {
        dbName: process.env.DB_NAME
    }).then(
        ()=>{
            console.log("Conexión exitosa con la base de datos")
        }
    ).catch(
        (error)=>{
            console.log("Error al conectar a la base de datos");
            console.log(error);
        }
    )
}

module.exports = connectDB;