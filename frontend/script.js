// Función para iniciar sesión
function login() {
    const usuario = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPass").value;

    fetch("/login", { // Usamos ruta relativa ya que el server sirve el front
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.mensaje === "Login correcto") {
            localStorage.setItem("usuario", data.usuario);
            localStorage.setItem("token", data.token);
            window.location.href = "lugares.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    })
    .catch(err => console.error("Error en login:", err));
}

// Función para cargar los lugares en la página
function cargarLugares() {
    const contenedor = document.getElementById("contenedor");
    if (!contenedor) return;

    fetch("/lugares")
    .then(res => res.json())
    .then(data => {
        contenedor.innerHTML = "";
        data.forEach(l => {
            contenedor.innerHTML += `
            <div class="card">
                <img src="/img/${l.imagen}" onerror="this.src='/img/default.jpg'">
                <div class="card-overlay">
                    <h3>${l.nombre}</h3>
                    <p>${l.descripcion}</p>
                    <p>Seguridad: ${l.seguridad}</p>
                </div>
                <h3 style="padding:10px">${l.nombre}</h3>
            </div>`;
        });
    })
    .catch(err => console.error("Error cargando lugares:", err));
}

// Ejecutar automáticamente al cargar la página
document.addEventListener("DOMContentLoaded", cargarLugares);