const mongoose = require("mongoose");
const { seedCategories } = require("./seedCategories");

const connectDB = () =>{
    mongoose.connect(process.env.CONNECTION_STRING, {
        dbName: process.env.DB_NAME
    }).then(
        async ()=>{
            console.log("Conexión exitosa con la base de datos")
            await seedCategories();
        }
    ).catch(
        (error)=>{
            console.log("Error al conectar a la base de datos");
            console.log(error);
        }
    )
}

module.exports = connectDB;