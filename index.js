var express  = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var app = express();


var credenciales = {
    user:"root",
    password:"",
    port:"3306",
    host:"localhost",
    database:"bd_onecode"
};

//Exponer una carpeta como publica, unicamente para archivos estaticos: .html, imagenes, .css, .js
app.use(express.static("public")); //Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({secret:"ASDFE$%#%",resave:true, saveUninitialized:true}));

var home = express.static("home");
app.use(
    function(peticion,respuesta,next){
        if (peticion.session.correo){
                home(peticion,respuesta,next);    
        }
        else
            return next();
    }
);

function verificarAutenticacion(peticion, respuesta, next) {
    if (peticion.session.correo)
        return next();
    else
        respuesta.send("ERROR, ACCESO NO AUTORIZADO");
}

app.post("/login", function(peticion, respuesta){
    var conexion = mysql.createConnection(credenciales);
    conexion.query("SELECT CODIGO_USUARIO, CODIGO_TIPO_USUARIO, CORREO, NOMBRE_USUARIO FROM tbl_usuario WHERE CORREO=? AND CONTRASENIA=sha1(?)",
        [peticion.body.correo, peticion.body.contrasenia],
        function(err, data, fields){
                if (data.length>0){
                    peticion.session.correo = data[0].CORREO;
                    peticion.session.codigoUsuario = data[0].CODIGO_USUARIO;
                    data[0].estatus = 0;
                    console.log(data[0].CORREO);
                    respuesta.send(data[0]); 
                }else{
                    respuesta.send({estatus:1, mensaje: "Login fallido"}); 
                }
            	
         }
    ); 
});

app.get("/obtener-sesion", function(peticion, respuesta){
    respuesta.send("Valor de la variable de sesion almacenado: " + peticion.session.correo);
 });

 app.get("/planes", function(request, response){
    var conexion = mysql.createConnection(credenciales);
    var sql = `SELECT CODIGO_PLAN, NOMBRE_PLAN FROM tbl_plan`;
    var planes = [];
    conexion.query(sql)
    .on("result", function(resultado){
        planes.push(resultado);
    })
    .on("end",function(){
        response.send(planes);
    });   
});

app.post("/insertar-usuario", function(request, response){
    var conexion = mysql.createConnection(credenciales);
    var sql = 'INSERT INTO tbl_usuario(CODIGO_TIPO_USUARIO, NOMBRE, APELLIDO, CORREO, CONTRASENIA, NOMBRE_USUARIO) VALUES (?,?,?,?,sha1(?),?)';
    
    conexion.query(
        sql,
        [request.body.tipousuario, request.body.nombre, request.body.apellido,request.body.correo, request.body.contrasenia, request.body.nombreusuario],
        function(err, result){
            if (err) throw err;
            response.send(result);
        }
    ); 
});

app.get("/salir", function(peticion, respuesta){
    peticion.session.destroy();
    respuesta.send("Sesión cerrada")
});

app.post("/guardar-archivo", function(request, response){
    var conexion = mysql.createConnection(credenciales);
    var sql = 'INSERT INTO tbl_archivo(CODIGO_USER_AUTOR, NOMBRE, FECHA_CREACION, CONTENIDO) VALUES (?,?,now(),?)';
    
    conexion.query(
        sql,
        [request.session.codigoUsuario, request.body.nombre, request.body.contenido],
        function(err, result){
            if (err) throw err;
            response.send(result);
        }
    ); 
});

app.post("/crear-carpeta", function(request, response){
    var conexion = mysql.createConnection(credenciales);
    var sql = 'INSERT INTO tbl_carpeta(CODIGO_USER_AUTOR, NOMBRE_CARPETA, FECHA_CREACION) VALUES (?,?,now())';
    
    conexion.query(
        sql,
        [request.session.codigoUsuario, request.body.nombrecarpeta],
        function(err, result){
            if (err) throw err;
            response.send(result);
        }
    ); 
});

app.get("/obtener-usuario", verificarAutenticacion, function(request, response){
    var conexion = mysql.createConnection(credenciales);
    var sql = `SELECT CODIGO_USUARIO, CODIGO_TIPO_USUARIO, NOMBRE,CORREO, NOMBRE_USUARIO FROM tbl_usuario WHERE CODIGO_USUARIO = ?`;
    var usuarios = [];
    conexion.query(sql, request.session.codigoUsuario)
    .on("result", function(resultado){
        usuarios.push(resultado);
    })
    .on("end",function(){
        response.send(usuarios);
    });   
});
//Crear y levantar el servidor web.
app.listen(3000);
console.log("Servidor iniciado");
