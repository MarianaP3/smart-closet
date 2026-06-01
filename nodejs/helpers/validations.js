class Validations{

    static username(username){
        if(typeof username !== 'string') throw new Error("El nombre de usuario debe de ser una cadena");
        if(username.length < 5) throw new Error ("El nombre del usuario debe tener mínimo 5 carácteres");
    }

    static password(password){
        if(typeof password !== 'string') throw new Error("La contraseña debe de ser una cadena");
        if(password.length < 8) throw new Error ("La constraseña debe tener mínimo 8 carácteres");
    }

}

module.exports = {Validations}