let preguntas = [];
let preguntaActual = 0;
let respuestasCorrectas = 0;
let tiempoInicio = null;
let intervalo = null;

// Calcular la circunferencia del círculo
function calcularCircunferencia(radio) {
  return 2 * Math.PI * radio;
}

const radio = 46; // Radio del círculo
const circunferencia = calcularCircunferencia(radio);

// Cargar el JSON
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    preguntas = data.preguntas.sort(() => Math.random() - 0.5); // Aleatorizar preguntas
    iniciarCuestionario();
  })
  .catch(error => console.error('Error al cargar el JSON:', error));

function iniciarCuestionario() {
  tiempoInicio = new Date(); // Guardar el tiempo de inicio
  intervalo = setInterval(actualizarTiempo, 1000); // Actualizar el tiempo cada segundo

  // Inicializar el círculo de progreso
  const circle = document.querySelector('.progress-ring__circle');
  circle.style.strokeDasharray = `${circunferencia} ${circunferencia}`;
  circle.style.strokeDashoffset = circunferencia; // Ocultar el círculo al inicio

  mostrarPregunta();
}

function mostrarPregunta() {
  const pregunta = preguntas[preguntaActual];
  const opciones = pregunta.opciones.sort(() => Math.random() - 0.5); // Aleatorizar opciones

  // Mostrar la pregunta
  document.querySelector('.pregunta').textContent = pregunta.pregunta;

  // Mostrar las opciones
  const opcionesContainer = document.querySelector('.opciones-container');
  opcionesContainer.innerHTML = ''; // Limpiar opciones anteriores

  opciones.forEach((opcion, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';

    const label = document.createElement('label');
    label.htmlFor = `opcion-${index}`;

    const input = document.createElement('input');
    input.type = 'radio';
    input.id = `opcion-${index}`;
    input.name = 'radio-examples';
    input.value = index;

    // Escuchar el evento 'change' en los inputs
    input.addEventListener('change', () => verificarRespuesta(pregunta));

    const textSpan = document.createElement('span');
    textSpan.className = 'text';
    textSpan.textContent = opcion;

    label.appendChild(input);
    label.appendChild(textSpan);
    optionDiv.appendChild(label);
    opcionesContainer.appendChild(optionDiv);
  });

  // Actualizar el contador de preguntas
  document.querySelector('#contador-preguntas-texto').textContent = `${preguntaActual + 1}/${preguntas.length}`;

  // Cambiar el texto del botón en la última pregunta
  const boton = document.querySelector('#siguiente-btn');
  boton.textContent = preguntaActual === preguntas.length - 1 ? 'Finalizar' : 'Siguiente';
}

function verificarRespuesta(pregunta) {
  const opcionSeleccionada = document.querySelector('input[name="radio-examples"]:checked');

  if (!opcionSeleccionada) return; // Si no hay opción seleccionada, no hacer nada

  const esCorrecta = opcionSeleccionada.value == pregunta.opcion_correcta - 1;

  // Mostrar feedback
  const feedbackText = document.querySelector('#feedback-text');
  feedbackText.textContent = `${esCorrecta ? 'Correcto' : 'Incorrecto'}. ${pregunta.justificacion}`;
  feedbackText.style.display = 'block'; // Mostrar el feedback

  // Mostrar el botón "Siguiente"
  const boton = document.querySelector('#siguiente-btn');
  boton.style.display = 'inline-block'; // Mostrar el botón

  // Actualizar el contador de respuestas correctas
  if (esCorrecta) respuestasCorrectas++;

  // Actualizar el progreso del anillo
  actualizarProgreso();
}

function actualizarProgreso() {
  const progreso = (preguntaActual + 1) / preguntas.length; // Progreso actual (0 a 1)
  const offset = circunferencia - (progreso * (circunferencia / 2)); // Calcular el offset

  const circle = document.querySelector('.progress-ring__circle');
  circle.style.strokeDashoffset = offset;
}

function siguientePregunta() {
  // Ocultar feedback y botón "Siguiente"
  document.querySelector('#feedback-text').style.display = 'none';
  document.querySelector('#siguiente-btn').style.display = 'none';

  if (preguntaActual < preguntas.length - 1) {
    preguntaActual++;
    mostrarPregunta();
  } else {
    finalizarCuestionario();
  }
}

function finalizarCuestionario() {
  clearInterval(intervalo); // Detener el temporizador

  // Mostrar el puntaje final
  const puntajeFinal = document.querySelector('.puntaje-final');
  puntajeFinal.querySelector('strong').textContent = `${respuestasCorrectas}/${preguntas.length}`;
  puntajeFinal.style.display = 'block';

  // Ocultar otros elementos
  document.querySelector('.contenedor').classList.add('mostrar-puntaje');
}

function actualizarTiempo() {
  const tiempoTranscurrido = Math.floor((new Date() - tiempoInicio) / 1000);
  const minutos = Math.floor(tiempoTranscurrido / 60);
  const segundos = tiempoTranscurrido % 60;
  document.querySelector('#contador-tiempo-texto').textContent = `${minutos}:${segundos.toString().padStart(2, '0')}`;
}

// Asignar la función al botón
document.querySelector('#siguiente-btn').addEventListener('click', siguientePregunta);