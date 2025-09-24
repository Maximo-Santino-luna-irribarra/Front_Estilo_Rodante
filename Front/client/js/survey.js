import { ENCUESTAS } from "./constantes/rutas.js";
import { ENCUESTASOMITIDAS} from "./constantes/rutas.js";

document.getElementById('encuesta-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const opinion = document.getElementById('opinion').value.trim();
  const email = document.getElementById('email').value.trim();
  const terminos = document.getElementById('terminos').checked;
  const puntuacion = document.getElementById('slider').value;

  if (!opinion || !email || !terminos) {
    alert("Por favor completa todos los campos requeridos.");
    return;
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!email || !emailValido) {
    alert("Por favor ingresa un email válido.");
    return;
  }

  const slider = document.getElementById('slider').value;

  if (slider < 1 || slider > 10) {
    alert("La puntuación debe estar entre 1 y 10.");
    return;
  }

  const datos = {
    nombre: localStorage.getItem('nombreCliente'),
    opinion,
    email,
    puntuacion,
    fecha: new Date().toISOString()
  };

  try {
    const resp = await fetch(ENCUESTAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    if (resp.ok) {
      document.getElementById('modal').classList.add('show');
      setTimeout(function() {
          window.location.href = './login.html';
      }, 1500);
    } else {
      alert("Hubo un error al enviar la encuesta.");
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión.");
  }
});

document.getElementById('omitir-btn').addEventListener('click', async () => {
  try {
      const resp = await fetch(ENCUESTASOMITIDAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({nombre:localStorage.getItem('nombreCliente')})
      });

      if (!resp.ok) {
        alert("Hubo un error al enviar la encuesta.");
      }
      window.location.href = './login.html';
    } catch (err) {
      console.error(err);
      alert("Error de conexión.");
    }
});

const slider = document.getElementById('slider');
const valorSlider = document.getElementById('valor-slider');

slider.addEventListener('input', () => {
  valorSlider.textContent = slider.value;
});
