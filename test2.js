const { Pool } = require("pg");

const config = {
user: "chris",
host: "localhost",
database: "test",
password: "chris1997",
port: 5432,
max: 20,
idleTimeoutMillis: 5000,
connectionTimeoutMillis: 2000,
};

const accion = process.argv[2]
const nombreEstu = process.argv[3]
const filtro = process.argv[3]
const rutEstu = parseInt(process.argv[4])
const cursoEstu = process.argv[5]
const nivelEstu = parseInt(process.argv[6])
console.log(`${accion}, ${nombreEstu}, ${rutEstu}, ${cursoEstu}, ${nivelEstu}`)
const pool = new Pool(config);

async function ingresar(nombreEstu, rutEstu, cursoEstu, nivelEstu) {
    const info = {
        name: 'fetch-estudiantes', // prepared statement
        // rowMode: 'array',
        text: `insert into estudiantes (nombre, rut, curso, nivel) values ($1, $2, $3, $4) RETURNING *`,
        values: [`${nombreEstu}`, `${rutEstu}`, `${cursoEstu}`, `${nivelEstu}`],
        }
        return info
}

async function consultar() {
    const info = {
        name: 'fetch-estudiantes', // prepared statement
        // rowMode: 'array',
        text: 'select * from estudiantes',
        // values: ['*', 'estudiantes'],
        }
        return info
}

async function consultarRut(rutEstu) {
    const info = {
        name: 'fetch-estudiantes', // prepared statement
        // rowMode: 'array',
        text: 'select * from estudiantes where rut = $1',
        values: [rutEstu],
        }
        return info
}

async function editar(nombreEstu, rutEstu, cursoEstu, nivelEstu) {
    const info = {
        name: 'fetch-estudiantes', // prepared statement
        // rowMode: 'array',
        text: 'UPDATE estudiantes SET nombre = $1, curso = $3, nivel = $4 WHERE rut = $2 RETURNING*;',
        values: [`${nombreEstu}`, `${rutEstu}`, `${cursoEstu}`, `${nivelEstu}`],
        }
    return info
}

async function eliminar(rutEstu) {
    const info = {
        name: 'fetch-estudiantes', // prepared statement
        // rowMode: 'array',
        text: 'DELETE FROM estudiantes where rut = $1',
        values: [rutEstu],
        }
        return info
}

function poolsql(queryObj){
pool.connect(async (error_conexion, client, release) => {
if (error_conexion) return console.error(error_conexion.code);
try {
    const res = await client.query(queryObj);
    // console.log("Ultimo registro agregado: ", res.rows);
    if (accion == 'nuevo'){
        console.log(`Estudiante ${nombreEstu} agregado con exito`)
    }
    if (accion == 'consulta'){
        console.log("Registros:", res.rows)
    }
    if (accion == 'editar'){
        console.log(`estudiante ${nombreEstu} editado con exito`)
    }
    if (accion == 'rut'){
        console.log(`Registro con el rut: ${filtro}`, res.rows[0])
    }
    if (accion == 'eliminar'){
        console.log(`registro de estudiante con rut ${filtro} eliminado`)
    }
} 
catch (error) {
    console.log(error.code);
}
    release();
    pool.end()
});
}

if (accion == 'nuevo'){
    ingresar(nombreEstu, rutEstu, cursoEstu, nivelEstu)
    .then( (queryObj) => poolsql(queryObj))
}
if (accion == 'consulta'){
    consultar()
    .then( (queryObj) => poolsql(queryObj))
}
if (accion == 'editar'){
    editar(nombreEstu, rutEstu, cursoEstu, nivelEstu)
    .then( (queryObj) => poolsql(queryObj))
}
if (accion == 'rut'){
    consultarRut(filtro)
    .then( (queryObj) => poolsql(queryObj))
}
if (accion == 'eliminar'){
    eliminar(filtro)
    .then( (queryObj) => poolsql(queryObj))
}