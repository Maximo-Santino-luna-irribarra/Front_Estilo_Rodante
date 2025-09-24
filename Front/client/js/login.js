import { CLIENTES } from "./constantes/rutas.js";

const buttonLogin = document.querySelector('.btn-login');
const nombreUsuario = document.getElementById('nombre');

buttonLogin.addEventListener('click', async (e) => {
    e.preventDefault();
    const nombre = nombreUsuario.value;

    if (!nombre) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    if (nombre.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres.');
        return;
    }

    localStorage.setItem('nombreCliente', nombre);
    window.location.href = './home.html';
    

    try {
        const response = await fetch(CLIENTES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombreCliente: nombre })
        });

        if (!response.ok) {
            throw new Error('Error en el inicio de sesión');
        }

        window.location.href = './home.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Credenciales incorrectas. Inténtalo de nuevo.');
    }
})