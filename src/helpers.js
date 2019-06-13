const hbs = require('hbs');
const fs = require('fs');


hbs.registerHelper('addCurso', (curso) => {
    listaCursos = getListarCurso()
    
    let duplicado = listaCursos.find(buscar => buscar.id == curso.id)

    if(!duplicado){
        listaCursos.push(curso);
        guardarCurso(listaCursos);
        let texto = "<p><b>Curso de " + curso.nombre + " creado con éxito</b></p> \
                    <h6>A continuacion se presenta la lista de curso creados hasta la fecha</h6>";
                    texto = texto + mostraCursos(listaCursos);
        return texto;
    }else{
        return '<p>Ya existe un curso creado con el id: ' + curso.id + '</p>' + 
               '<p> <a href=\"/crearCurso\"> Regresar </a> </p>';
    }
});

const guardarCurso = (listaCursos) => {
    let datos = JSON.stringify(listaCursos)
    fs.writeFile('./src/listaCursos.json', datos, (err) => {
        if(err) throw (err);
        console.log('Curso creado con éxito');
    });
}


const getListarCurso = () => {
    try{
        listaCursos = require('./listaCursos.json');    
    }catch(error){
        listaCursos = []; 
    }  
    return listaCursos;  
}

const getListarInscritos = () => {
    try{
		listaInscritos = JSON.parse(fs.readFileSync('./src/listaInscritos.json', 'utf8'));
    }catch(error){
        listaInscritos = []; 
    }  

    return listaInscritos;  
}

const mostraCursos = (listaCursos) => {
    let texto = "<table class='table table-hover'> \
                <thead class='thead-light'>  \
                <th scope='col'> Id </th> \
                <th scope='col'> Nombre </th> \
                <th scope='col'> Modalidad </th> \
                <th scope='col'> Valor </th> \
                <th scope='col'> Descripcion </th> \
                <th scope='col'> Intensidad </th> \
				<th scope='col'> Estado </th> \
                </thead> \
                <tbody>";
    listaCursos.forEach(curso => {
         texto = texto +
                '<tr>' +
                '<td scope=\'/row\'/>' + curso.id + '</td>' +
                '<td>' + curso.nombre + '</td>' +
                '<td>' + curso.modalidad + '</td>' +
                '<td>' + curso.valor + '</td>' + 
                '<td>' + curso.descripcion + '</td>' +
                '<td>' + curso.intensidad + '</td>' +
                '<td>' + curso.estado + '</td></tr>'
     });           
     texto = texto + '</tbody></table>';
     return texto                
}

hbs.registerHelper('mostrarListaCursos', () => {
    listaCursos = getListarCurso()

    if(listaCursos.length > 0){
        let texto = "<p><b>Ver cursos como administrador</b></p>";

                    texto = texto + "<div class='container'>";
                    texto = texto + mostraCursos(listaCursos);
                    texto = texto + "</div>";
        return texto;
    }else{
        return '<p>No existen cursos disponibles</p>';
    }
});



hbs.registerHelper('mostrarListaCursosDisp', () => {
    listaCursos = getListarCurso()

    let texto = "<h2><b>Ver cursos como Interesado</b></h2>";
    texto = texto + "<div class='container'>";
        texto = texto + "<div class='accordion' id='accordionExample'>";

    i=1;
    listaCursos.forEach(curso => {

        if(curso.estado != "Cerrado"){
            texto = texto +
                `<div class="card">
                    <div class="card-header" id="heading${i}">
                    <h2 class="mb-0">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                        <b>Nombre del curso ${curso.nombre} </b><br>
                        Valor: $${curso.valor}
                        </button>
                    </h2>
                    </div>
                
                    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                    <div class="card-body">
                        <b>Nombre:</b> ${curso.nombre} <br>
                        <b>Valor:</b> ${curso.valor} <br>
                        <b>Descripcion:</b> ${curso.descripcion} <br>
                        <b>Modalidad:</b> ${curso.modalidad} <br>
                        <b>Intensidad:</b> ${curso.intensidad} <br>
                    </div>
                    </div>
                </div>`
                i=i+1;
            }
     });           
     texto = texto + '</div></div>';
     return texto

});

 
hbs.registerHelper('selectLstCursos', () => {

    listaCursos = getListarCurso()

    let texto = "<select class='form-control' name='cursos'>;"
    if(listaCursos.length > 0){
        listaCursos.forEach(curso => {
            texto = texto + 
                "<option value=" + curso.id + ">" + curso.nombre + "</option>";
        });        
    }else{
        texto = texto + 
        "<option value='0'>Seleccione un curso</option>";
    }
    texto = texto + "</select>";

    return texto;
    
});


const guardarInscrito = (listaInscritos) => {
	
    let datos = JSON.stringify(listaInscritos)
    fs.writeFile('./src/listaInscritos.json', datos, (err) => {
        if(err) throw (err);
        console.log('Inscripcion creado con éxito');
    });
}


hbs.registerHelper('inscripcion', (ins) => {

	listaCursos = getListarCurso()
	listaInscritos = getListarInscritos()
	
	let curso = listaCursos.find(buscar => buscar.id == ins.id);

    if(!curso){
        return "<h2><p>Debe seleccionar un curso</p></h2>" + 
                "<br><a href=\"/inscribirse\"> Regresar </a><br><br><br>";
    }else if(listaInscritos.length == 0){
		listaInscritos.push(ins)
		guardarInscrito(listaInscritos)
	}else{
		let duplicado = listaInscritos.find(inscritos => inscritos.documento == ins.documento);
		
		if (!duplicado) {
			listaInscritos.push(ins)
			guardarInscrito(listaInscritos)	
			return "<h2><p>Estudiante " + ins.nombre + " inscrito con exito en el curso de " + curso.nombre + "</p></h2><br><br>" + 
                        "<br><a href=\"/inscribirse\"> Regresar </a><br><br><br>";
		} else {
			return "<h2><p>Ya esta registrado en este curso</p></h2>" + 
                "<br><a href=\"/inscribirse\"> Regresar </a><br><br><br>";
		}
	
	}
});

hbs.registerHelper('verListaInscritos', () => {
    listaCursos = getListarCurso()
	listaInscritos = getListarInscritos()	
    let texto = "<h2><b>Ver Inscritos en los cursos disponibles</b></h2>";
    i=1;
    listaCursos.forEach(curso => {	
			let listaInscritosCurso = listaInscritos.filter(cur => cur.id == curso.id)			
			//if(listaInscritosCurso.length > 0){
				texto = texto +
                `<div class="card">
                    <div class="card-header" id="heading${i}">
                    <h2 class="mb-0">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                        <b>Nombre del curso ${curso.nombre} </b><br>
                        </button>
                    </h2>
                    </div>
                
                    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                    <div class="card-body">
                        ${mostraInscritos(listaInscritosCurso)} <br>
                    </div>
                    </div>
                </div>`
                i=i+1;
			//}            
     });          
     texto = texto + '</div></div>';
     return texto
});


const elmInscrito = (id, documento) => {
	listaInscritos = getListarInscritos()	
    let inscritos = listaInscritos.filter(buscar => (buscar.documento != documento || buscar.id != id));	
	if (inscritos.length == listaInscritos.length){
        console.log('Ningún estudiante tiene el documento ' + documento);
    } else {
      listaInscritos = inscritos;
	  guardarInscrito(listaInscritos) 
	}
	
}

const mostraInscritos = (listaInscritosCurso) => {

let texto = "<form action='eliminarInscrito' method='post'> \
			<table class='table table-hover'> \
                <thead class='thead-light'>  \
                <th scope='col'> Documento </th> \
                <th scope='col'> Nombre </th> \
                <th scope='col'> Telefono </th> \
                <th scope='col'> Correo </th> \
                <th scope='col'> Eliminar </th> \
                </thead> \
                <tbody>";
    listaInscritosCurso.forEach(curso => {
         texto = texto +
                '<tr>' +
                '<td scope=\'/row\'/>' + curso.documento + '</td>' +
                '<td>' + curso.nombre + '</td>' +
                '<td>' + curso.telefono + '</td>' +
                '<td>' + curso.email + '</td>' + 
				'<td>' +  
					'<div class="form-group row">' + 
					'<div class="col-sm-1">' + 
					'<button type="submit"name="boton" value=' +  curso.id + '|' + curso.documento + ' class="btn btn-primary">Eliminar</button>' + 
					'</div>' + 
				'<td>' + 
            '</div>'
     });           
     texto = texto + '</tbody></table></form>';
     return texto                
}

const guardar = () => {
	listaCursos = require('./listaCursos.json');
    let datos = JSON.stringify(listaCursos);
    fs.writeFile('./src/listaCursos.json', datos, (err) => {
        if (err) throw (err);
        console.log('Archivo almacenado con éxito');
    })
}


hbs.registerHelper('cambiarEstadoCurso', (id) => {
	listaCursos = getListarCurso()
    let curso = listaCursos.find(buscar => buscar.id == id);
	if(curso){
		if(curso.estado == 'Cerrado'){
			curso.estado = 'Disponible';
		}else{
			curso.estado = 'Cerrado';
		}
		guardar()
		let texto = "<p><b>Ver cursos como administrador</b></p>";
		texto = texto + "<div class='container'>";
		texto = texto + mostraCursos(listaCursos);		
		texto = texto + "<br><p> <a href=\"/verCurso\"> Regresar </a> </p>";
		texto = texto + "</div>";
        return texto;
	}else{
		return '<p>Seleccione un curso</p> \
		<p> <a href=\"/verCurso\"> Regresar </a> </p>';
	}
});









module.exports = {
	elmInscrito
};