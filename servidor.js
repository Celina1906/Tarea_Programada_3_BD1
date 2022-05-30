/*// Importacion de modulos*/
const express = require('express');
const { redirect } = require('express/lib/response');
/*const { redirect } = require('express/lib/response');
const res = require('express/lib/response')*/
const app = express()
const based = new (require('rest-mssql-nodejs'))({
    user: "programa",
    password: "programa",
    server: "25.6.233.172",
    database: "Tarea Programada 3",
    encrypt: true
})

// Variables
var usuario = {};
var datosConsulta = {};
var datosDeduccion = {};
var IdEmpleado = 0;

// Establecimiento de parametros para la pagina web
app.use(express.urlencoded({extended: false}));
app.set('view-engine', 'ejs');

// Extensiones de la pagina web
app.get('/', (req, res) => {
    res.render('login.ejs',{mensaje:""});
})

app.get('/consultaPlanilla', (req, res) => {
    res.render('consultaPlanilla.ejs', {mensajeError : "",
    tipoDatos : "", datos : {}});
})

app.get('/deduccionesMes', (req, res) => {
    res.render('deduccionesMes.ejs',
        {datos : datosDeduccion});
})

app.get('/deduccionesSemana', (req, res) => {
    res.render('deduccionesSemana.ejs',
    );
})

app.get('/detalleSalarioBruto', (req, res) => {
    res.render('detalleSalarioBruto.ejs',
    );
})

app.get('/regresarDeduccion', (req, res) => {
    res.redirect('./consultaPlanilla');
})

app.post('/salir', (req, res) => {
    res.redirect('./');
})


// Funciones de las paginas web
app.post('/login', (req, res) => {
    usuario = {
        user : req.body.name,
        password : req.body.pass
    };
    validarDatos(usuario, res);
})
app.post('/consultarPlanillaSemanal', (req, res) => {
    obtenerSemanaPlanilla(res);
})

app.post('/consultarPlanillaMensual', (req, res) => {
    obtenerMesPlanilla(res);
})

app.post('/deducciones', (req, res) => {
    obtenerDeducciones(req.body.planillaMensualListBox, res);
})

app.post('/regresarDeduccion', (req, res) => {
    res.redirect("./consultaPlanilla");
})

// Funciones logicas
function validarDatos (usuarioDatos, res) {
    setTimeout(async () => {
        const resultado = await based.executeStoredProcedure('ValidarUsuario',
        null, {inUserName : usuarioDatos.user, inPassword : usuarioDatos.password,
        outResult : 0});
        if (resultado != undefined) {
            console.log(resultado.data);
            if (resultado.data[0][0].outResult == 0) {
                IdEmpleado = resultado.data[0][0].IdEmpleado;
                res.redirect("./consultaPlanilla");
            }
            else {
                if (resultado.data[0][0].outResult == 1002)
                    res.render("login.ejs",{mensaje:"Combinación de usuario/password no existe en la BD"});
            }
        }
    }, 1500)
}

function obtenerMesPlanilla (res) {
    setTimeout(async () => {
        const resultado = await based.executeStoredProcedure('MostrarMesPlanillaXEmpleado',
        null, {inIdEmpleado : IdEmpleado, outResult : 0});
        if (resultado != undefined) {
            datosConsulta = resultado.data[0].reverse();
            console.log(datosConsulta);
            res.render('consultaPlanilla.ejs', {mensajeError : "",
            tipoDatos : "planillaMensual",
            datos : datosConsulta});
        }
    }, 1500)
}

function obtenerDeducciones (IdMesPlanillaXEmpleado, res) {
    setTimeout(async () => {
        const resultado = await based.executeStoredProcedure('ObtenerDeduccionesXEmpleadoXMes',
        null, {inIdMesPlanillaXEmpleado : IdMesPlanillaXEmpleado, outResult : 0});
        if (resultado != undefined) {
            datosDeduccion = resultado.data[0];
            console.log(datosDeduccion);
            res.render('deduccionesMes.ejs', {
                datos : datosDeduccion});
        }
    }, 1500)
}

function obtenerSemanaPlanilla (res) {
    setTimeout(async () => {
        const resultado = await based.executeStoredProcedure('MostrarSemanaPlanilla',
        null, {inIdEmpleado : IdEmpleado, outResult : 0});
        if (resultado != undefined) {
            datosConsulta = resultado.data[0];
            console.log(datosConsulta);
            res.render('consultaPlanilla.ejs', {mensajeError : "",
            tipoDatos : "planillaSemanal",
            datos : datosConsulta});
        }
    }, 1500)
}

// Creacion del puerto para acceder la pagina web
app.listen(3000)