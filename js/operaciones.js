let subtituloCalcular = document.getElementById('subtituloCalcular')
let planillaZonas = document.getElementById('logdeZonas')
let cancelarSolicitud = document.getElementById(`cancelarSolicitud`)
let divformularioDeContacto = document.getElementById(`divformularioDeContacto`)
let formularioDeContacto = document.getElementById(`formularioDeContacto`)
let botonPusheador = document.getElementById('nuevaZona')
let offCanvasCheckout = document.getElementById(`offCanvasCheckout`)
let checkoutCalculo = document.getElementById('mostrarCalculo')
let botonCalculador = document.getElementById('calcular')

//DECLARO PROYECTO DE RIEGO QUE TOMO DEL STORAGE Y UTILIZO EN OPERACIONES.
let proyectoRiego = []
proyectoRiego = JSON.parse(localStorage.getItem('proyecto'))
if (proyectoRiego == undefined) {
  proyectoRiego = []
  localStorage.setItem('proyecto', JSON.stringify(proyectoRiego));
} else { proyectoRiego = JSON.parse(localStorage.getItem('proyecto')) }

function resetProject() {
  proyectoRiego = []
  localStorage.setItem('proyecto', JSON.stringify(proyectoRiego))
}

//DECLARO ASPERSOR CON CUYOS DATOS SE HARAN LOS CALCULOS
let aspersorDeCalculo = JSON.parse(localStorage.getItem('elegido'))
if (aspersorDeCalculo == undefined) {
  aspersorDeCalculo = 0
} else {
  aspersorDeCalculo = JSON.parse(localStorage.getItem('elegido'))
  subtituloCalc()
}

//DEFINO ASPERSOR A USAR, DESDE EL DOM, CON EL BOTON EN CADA CARD
//let botonSeleccionador = document.querySelectorAll('.boton-select')

function selectById(EAN) {
  aspersorElegido = catalogoAspersores.find((asp) => asp.id == EAN) // buscar EAN de todos los productos
  console.log(aspersorElegido)
  localStorage.setItem('elegido', JSON.stringify(aspersorElegido));
  aspersorDeCalculo = JSON.parse(localStorage.getItem('elegido'))
  resetCalc()
  subtituloCalc()
}

/* Muestro con qué aspersor estoy dimensionando */


function subtituloCalc(){
  if(
    (aspersorDeCalculo == 0)
  ){
    subtituloCalcular.innerHTML=``
  }else{
    subtituloCalcular.innerHTML=`<p>Calculando con Aspersor ${aspersorDeCalculo.nombre}</p>`
  }
}


//Cargar objetos al array
//Constructor

class Zona {
  constructor(id, largo, ancho, distancia) {
    this.id = id;
    this.largo = largo;
    this.ancho = ancho;
    this.distancia = distancia;
  }
}

//Funcion Constructora

function agregarZona(proyectoRiego) {

  let id = 0;

  let largo = parseInt(document.getElementById('LargoZona').value)
  if (isNaN(largo) || largo < 10) { largo = 10 }
  if (largo > 100) { largo = 100 }

  let ancho = parseInt(document.getElementById('AnchoZona').value)
  if (isNaN(ancho) || ancho < 10) { ancho = 10 }
  if (ancho > 100) { ancho = 100 }

  let distancia = parseInt(document.getElementById('DistanciaZona').value)
  if (isNaN(distancia) || distancia < 5) { distancia = 5 }

  const nuevaZona = new Zona(id, largo, ancho, distancia)

  proyectoRiego.push(nuevaZona)
  proyectoRiego = proyectoRiego.map((item, i) => {
    return {
      ...item,
      id: i + 1,
    }
  });
  localStorage.setItem('proyecto', JSON.stringify(proyectoRiego));
  console.log(proyectoRiego);
  resetCalc()
}

//Funcion add() para cargar zona al array
function add() {
  agregarZona(proyectoRiego);
}



function imprimirMapZonas() {
  proyectoRiego = JSON.parse(localStorage.getItem('proyecto'))
  planillaZonas.innerHTML = ""
  for (let object of proyectoRiego) {
    //Creo un div padre de la card
    let nuevaLinea = document.createElement("tr")
    nuevaLinea.innerHTML = `
    <th scope="row"><button type="button" class="btn btn-dark" onclick="deleteById(${object.id})" href="#logdeZonas">#${object.id}</button></th>
    <td>${object.largo} m.</td>
    <td>${object.ancho} m.</td>
    <td>${object.distancia} m.</td>
          `
    planillaZonas.appendChild(nuevaLinea)
  }
}

imprimirMapZonas()

//FUNCTION PARA RESETEAR EL AREA DE CALCULOS
function resetCalc() {
  totalCantAspersores = 0
  totalManguera = 0
  checkoutCalculo.innerHTML = ``
}

//DEFINIR BOTON PUSH QUE ME VA A CARGAR LAS NUEVAS ZONAS AL ARRAY


botonPusheador.addEventListener('click', function (e) { e.preventDefault() });
botonPusheador.addEventListener('click', add)
botonPusheador.addEventListener('click', imprimirMapZonas)

//BOTON PARA ELIMINAR ZONAS POR ID -- LLAMADO POR ONCLICK DESDE EL DOM
function deleteById(x) {
  proyectoRiego.splice((x - 1), 1);
  proyectoRiego = proyectoRiego.map((item, i) => {
    return {
      ...item,
      id: i + 1,
    }
  });
  localStorage.setItem('proyecto', JSON.stringify(proyectoRiego));
  imprimirMapZonas()
  resetCalc()
}






/////////////////////////////////////////////////////////////////////
////////////////////////////CÁLCULOS/////////////////////////////////
/////////////////////////////////////////////////////////////////////


let totalCantAspersores = 0 //ASPERSORES X PRECIO UNITARIO
let totalCaudalM3Hora = 0 //ASPERSORES X CAUDAL M3 / HORA
let caudalBomba = 0 //ASPERSORES X CAUDAL M3 / HORA
let diametroManguera = 0 //TOTALCAUDAL
let controllerElegido = {} //SEGUN LA CANTIDAD DE ESTACIONES
let valvulaElegida = {}
let totalManguera = 0 //FOR EACH ZONAS X METROS DE MANGUERA
let precioMateriales = 0
let precioFinal = 0

divformularioDeContacto.style.display = "none"

function calcular() {
  totalCantAspersores = 0
  totalManguera = 0
  offCanvasCheckout.style.display = "none";
  proyectoRiego = JSON.parse(localStorage.getItem('proyecto'))
  //console.log(proyectoRiego.length)
  if (aspersorDeCalculo == 0) {
    Swal.fire({
      icon: 'error',
      title: 'Error 404',
      text: 'Aspersor No Encontrado',
      footer: 'Por favor elija un aspersor antes de acceder al cálculo'
    })
  } else if (
    (proyectoRiego.length) == 0 || proyectoRiego == undefined
  ) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Somos ingenieros, no adivinos',
      footer: 'Necesitamos que nos indique el tamaño de las zonas que tenemos que dimensionar'
    })
  }
  else {

    offCanvasCheckout.style.display = "initial";

    for (let object of proyectoRiego) {
      let diametro = aspersorDeCalculo.radio * 2
      let cantCanales = Math.ceil(object.largo / diametro)
      let cantAspersores = Math.ceil(object.ancho / diametro) * cantCanales
      let ancho2 = 0
      let largo2 = 0
      if (object.ancho <= diametro) { ancho2 = diametro + 1 } else { ancho2 = object.ancho }
      if (object.largo <= diametro) { largo2 = diametro + 1 } else { largo2 = object.largo }
      let metrosManguera = Math.ceil((cantCanales * Math.abs(ancho2 - diametro) + 2 * Math.abs(largo2 - diametro) + object.distancia) * 1.1)
      //ACUMULADOR METROS MANGUERA
      totalManguera = totalManguera + metrosManguera
      //ACUMULADOR CANT ASPERSORES
      totalCantAspersores = totalCantAspersores + cantAspersores
      //BUSQUEDA DE VALVULA INDICADA PARA LA ZONA
    }

    totalCaudalM3Hora = totalCantAspersores * aspersorDeCalculo.caudalM3Hora
    controllerElegido = catalogoControllers.find((controller) => controller.maxEstaciones >= proyectoRiego.length)
    caudalBomba = Math.floor(totalCaudalM3Hora / (proyectoRiego.length))
    if (caudalBomba < 1) { caudalBomba = 1 }
    if (caudalBomba > 67) { caudalBomba = 67 }
    valvulaElegida = catalogoValvulas.find((valvula) => valvula.caudalM3Hora >= caudalBomba)
    diametroManguera = (Math.ceil(Math.sqrt((185 * caudalBomba) / Math.PI) / 5)) * 10

    precioMateriales = Math.ceil(proyectoRiego.length * 15 + totalCantAspersores * aspersorDeCalculo.precio + controllerElegido.precio + valvulaElegida.precio * proyectoRiego.length + diametroManguera * totalManguera * 0.1)

    precioFinal = Math.ceil(precioMateriales * 1.65)

    let loader = document.getElementById('loaderMostrarCalculo')

    loader.innerHTML = `
        <div class="spinner-border" role="status">
        </div>
        <div>
        <h4 class="sr-only">Calculando...</h4>
        </div>
          `


    setTimeout(() => {

      loader.innerHTML = ``

      checkoutCalculo.innerHTML = (`
          <p>Su proyecto está calculado. Para armarlo deberá emplear:</p>
          <p>-1 Central Programadora ${controllerElegido.nombre} de ${controllerElegido.maxEstaciones} estaciones</p>
          <p>-${(proyectoRiego.length)} válvulas solenide ${valvulaElegida.nombre}</p>
          <p>-${totalCantAspersores} aspersores ${aspersorDeCalculo.nombre}</p>
          <p>-1 colector de ${(proyectoRiego.length) + 2} bocas con ${(proyectoRiego.length) + 2} llaves esféricas</p>
          <p>-${(totalManguera)} metros de manguera de diametro interno minimo de ${diametroManguera} mm.</p>
          <p>-1 Bomba de ${caudalBomba} m3/h de 2 m/s de velocidad de impulsion</p>
          <p>El precio total de materiales es de <strong> U$S ${precioMateriales}</strong></p>
          <p>El precio final con instalacion es de <strong> U$S ${precioFinal}</strong></p>
          <p>Desea contratar la instalación con nosotros?</p>
          `
      )
      divformularioDeContacto.style.display = "initial"

    }, 1800)
  }
}

//BOTON PARA CALCULAR Y DIMENSIONAR EL SISTEMA DE RIEGO


botonCalculador.addEventListener('click', resetCalc)
botonCalculador.addEventListener('click', calcular)

function validarEmail() {
  // Input Email
  let emailField = document.getElementById('user-email');
  // Expresion a Validar
  let validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  // Validación
  if (validEmail.test(emailField.value)) {
    finalizar()
  } else {
      Swal.fire({
        icon: 'error',
        title: 'Email no Válido',
        text: 'Por favor ingrese una dirección de correo electrónico',
        timer: 2500
    })
  }
}

function finalizar() {
  resetCalc()
  resetProject()
  imprimirMapZonas()
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Su solicitud se ha cargado con éxito',
      text: 'Un ingeniero de nuestro equipo se pondrá en contacto con usted dentro de las próximas 72hs hábiles',
      showConfirmButton: false,
      timer: 5000
  })
  setTimeout(() =>{
  formularioDeContacto.reset()},5000)
}


function cancelarSol() {
  resetCalc()
  resetProject()
  imprimirMapZonas()
  let timerInterval
  Swal.fire({
    title: 'No hay problema!',
    html: 'Estamos eliminando <b></b> cálculos. Vuelva cuando quiera para calular su nuevo proyecto!',
    timer: 3500,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft()
      }, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    /* Read more about handling dismissals below */
    /* if (result.dismiss === Swal.DismissReason.timer) {
    } */
  })
}

cancelarSolicitud.addEventListener('click', cancelarSol)