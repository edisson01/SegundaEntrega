const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const resp = require('./helpers');

const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');
app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/crearCurso', (req, res) => {
    res.render('crearCurso');
});

app.get('/verCurso', (req, res) => {
    res.render('verCursos');
});

app.get('/inscribirse', (req, res) => {
    res.render('inscribirse');
});

app.get('/verInscritos', (req, res) => {
	res.render('verInscritos');
});

app.get('/inicio', (req, res) => {
    res.render('index');
});


app.post('/adicionarCurso', (req, res) => {
    let curso = {
        id: parseInt(req.body.id),
        nombre: req.body.nombre,
        modalidad: req.body.modalidad,
        valor: req.body.valor,
        descripcion: req.body.descripcion,
        intensidad: req.body.intensidad,
        estado: 'Disponible'
    }

    res.render('addCurso', {curso});
});

app.post('/cambiarEstado', (req, res) => {
    id = parseInt(req.body.cursos)
    res.render('cambiarEstado', {id});
});


app.post('/eliminarInscrito', (req, res) => {
	info = req.body.boton.split('|');
    id = parseInt(info[0])
	documento = parseInt(info[1])		
	resp.elmInscrito(id, documento)	
    res.render('verInscritos', {});
});

app.post('/inscribirCurso', (req, res) => {
	
	let ins = {
		documento: parseInt(req.body.documento),
		email: req.body.email,
		nombre: req.body.nombre,
		telefono: req.body.telefono,
		id: parseInt(req.body.cursos)
	}
	
	res.render('inscripcionCurso', {ins})
})


app.get('*', (req, res) => {
    res.render('error', {
        estudiante: 'error'
    });
});
 
app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});