/*// Importacion de modulos*/
const express = require('express');
/*const { redirect } = require('express/lib/response');
const res = require('express/lib/response')*/
const app = express()
/*const based = new (require('rest-mssql-nodejs'))({
    user: "programa",
    password: "programa",
    server: "25.81.172.46",
    database: "Tarea Programada 2",
    encrypt: true
})

// Variables
var admin = {};
let idGlobal;
let listaPuestos = [];
let listaEmpleados = [];
let listaTipoDoc = [];
let listaDepartamentos = [];
cargarPuestos();
cargarEmpleados();
cargarTipoDoc();
cargarDepartamentos();*/

// Establecimiento de parametros para la pagina web
app.use(express.urlencoded({extended: false}));
app.set('view-engine', 'ejs');

// Extensiones de la pagina web
app.get('/', (req, res) => {
    res.render('login.ejs',{mensaje:""});
})

app.get('/consultaPlanilla', (req, res) => {
    res.render('consultaPlanilla.ejs', {mensajeError : "",
    tipoDatos : "", datos : []});
})

app.post('/salir', (req, res) => {
    res.redirect('./');
})


// Funciones de las paginas web
app.post('/login', (req, res) => {
    admin = {
        user : req.body.name,
        password : req.body.pass
    };
    validarDatos(admin, res);
})
app.post('/consultarPlanillaSemanal', (req, res) => {
    //console.log(listaPuestos);
    res.render('consultaPlanilla.ejs', {mensajeError : "",
    tipoDatos : "planillaSemanal"});
})

app.post('/consultarPlanillaMensual', (req, res) => {
    //console.log(listaPuestos);
    res.render('consultaPlanilla.ejs', {mensajeError : "",
    tipoDatos : "planillaMensual"});
})


// Funciones logicas
function validarDatos (adminDatos, res) {
    setTimeout(async () => {
        const resultado = await based.executeStoredProcedure('ValidarAdministradores',
        null, {inUserName : adminDatos.user, inPassword : adminDatos.password,
        outResult : 0});
        if (resultado != undefined) {
            console.log(resultado.data[0][0]);
            if (resultado.data[0][0].outResult == 0)
                res.redirect("./consultaPlanilla");
            else
                if (resultado.data[0][0].outResult == 1002)
                    res.render("login.ejs",{mensaje:"Combinación de usuario/password no existe en la BD"});
        }
    }, 1500)
}

function filtrarNombre (nombre, res) {
    let empleadosFiltrados = [];
    setTimeout(async () => {
        const resFiltroNom = await based.executeStoredProcedure('FiltrarNombre', null,
        {inFiltroNom : nombre, outResult : 0});
        if (resFiltroNom != undefined) {
            for (empleado of resFiltroNom.data[0]) {
                if (listaEmpleados.find(existe =>
                    existe[0] === false && existe[1].Nombre === empleado.Nombre))
                    empleadosFiltrados.push([false, empleado]);
            }
            res.render('ventanaPrincipalAdmin.ejs', {mensajeError : "",
            tipoDatos : "empleados", datos : empleadosFiltrados});
        }
    }, 1500)
}

function cargarPuestos() {
    let nuevosPuestos = [];
    setTimeout(async () => {
        const resultado = await based.executeStoredProcedure('ListarPuestos',
        null, {outResult : 0});
        if (resultado != undefined) {
            console.log(resultado.data[0]);
            for (puesto of resultado.data[0]) {
                if (listaPuestos.length == 0) {
                    nuevosPuestos.push([false, puesto]);
                    continue;
                }
                else if (listaPuestos.find(existe =>
                    existe[0] === false && existe[1].Puesto === puesto.Puesto))
                    nuevosPuestos.push([false, puesto]);
                else if (listaPuestos.find(existe =>
                    existe[0] === true && existe[1].Puesto === puesto.Puesto))
                    nuevosPuestos.push([true, [puesto]]);
                else
                    nuevosPuestos.push([false, puesto]);
            }
            listaPuestos = nuevosPuestos;
        }
    }, 1500)
}

function cargarEmpleados() {
    let nuevosEmpleados = [];
    setTimeout(async () => {
        const resultado = await based.executeStoredProcedure('ListarEmpleados',
        null, {outResult : 0});
        if (resultado != undefined) {
            console.log(resultado.data[0]);
            for (empleado of resultado.data[0]){
                if (listaEmpleados.length == 0) {
                    nuevosEmpleados.push([false, empleado]);
                    continue;
                }
                else if (listaEmpleados.find(existe =>
                    existe[0] === false && existe[1].ID === empleado.ID))
                    nuevosEmpleados.push([false, empleado]);
                else if (listaEmpleados.find(existe =>
                    existe[0] === true && existe[1].ID === empleado.ID))
                    nuevosEmpleados.push([true, empleado]);
                else
                    nuevosEmpleados.push([false, empleado]);
            }
            listaEmpleados = nuevosEmpleados;
        }
    }, 1500)
}

function cargarTipoDoc() {
    setTimeout(async () => {
        const resultado = await based.executeStoredProcedure('ObtenerTipoDoc',
        null, {outResult : 0});
        if (resultado != undefined) {
            for (tipoDoc of resultado.data[0])
                listaTipoDoc.push(tipoDoc);
        }
        console.log(listaTipoDoc);
    }, 1500)
}

function cargarDepartamentos() {
    setTimeout(async () => {
        const resultado = await based.executeStoredProcedure('ObtenerDepartamento',
        null, {outResult : 0});
        if (resultado != undefined) {
            for (departamento of resultado.data[0])
                listaDepartamentos.push(departamento);
        }
        console.log(listaDepartamentos);
    }, 1500)
}


// Creacion del puerto para acceder la pagina web
app.listen(3000)