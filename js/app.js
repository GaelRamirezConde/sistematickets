// Cargar tickets al abrir la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarTickets();
});

// Guardar ticket en LocalStorage
function guardarTicket(ticket) {
    ticket.leido = false; // nuevo atributo para marcar como leído
    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    tickets.unshift(ticket); // agrega arriba como chat real
    localStorage.setItem("tickets", JSON.stringify(tickets));
}

// Mostrar tickets guardados
function mostrarTickets() {
    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    const lista = document.getElementById("ticketList");
    lista.innerHTML = "";

    tickets.forEach((ticket, index) => {
        agregarTicketHTML(ticket, index);
    });

    actualizarUrgentes();
}

// Imprimir ticket en pantalla
function agregarTicketHTML(ticket, index) {
    const lista = document.getElementById("ticketList");

    const item = document.createElement("div");
    // Clase con tamaño reducido y centrado
    item.className = `card p-3 mb-3 border border-dark mx-auto ${ticket.leido ? "bg-light text-muted" : ""}`;
    item.style.textDecoration = ticket.leido ? "line-through" : "none";
    item.style.width = "50%"; // la mitad del ancho
    item.style.minWidth = "300px"; // ancho mínimo para pantallas pequeñas

    item.innerHTML = `
        <strong>${ticket.nombre}</strong> — ${ticket.email}<br>
        <small>${ticket.fecha}</small>
        <p>${ticket.texto}</p>
        <span class="badge bg-${ticket.prioridad === "alta" ? "danger" : ticket.prioridad === "normal" ? "warning" : "success"}">
            ${ticket.prioridad.toUpperCase()}
        </span>
        <div class="mt-2 d-flex gap-2 justify-content-center">
            <button class="btn btn-primary btn-sm" onclick="marcarLeido(${index})">
                ${ticket.leido ? "Desmarcar" : "Marcar como leído"}
            </button>
            <button class="btn btn-danger btn-sm" onclick="eliminarTicket(${index})">Eliminar</button>
        </div>
    `;

    lista.appendChild(item);
}

// Captura del formulario
document.getElementById("ticketForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const texto = document.getElementById("message").value.trim();
    const prioridad = document.getElementById("priority").value;
    const fecha = new Date().toLocaleString();

    const ticket = { nombre, email, texto, prioridad, fecha };

    guardarTicket(ticket);
    mostrarTickets();
    e.target.reset();
});

// Filtro de tickets
function filterTickets(filtro) {
    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    const lista = document.getElementById("ticketList");
    lista.innerHTML = "";

    let filtrados = tickets;

    if (filtro !== "todos") {
        filtrados = tickets.filter(t => t.prioridad === filtro);
    }

    filtrados.forEach((ticket, index) => {
        agregarTicketHTML(ticket, index);
    });
}

// Eliminar ticket
function eliminarTicket(index) {
    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    tickets.splice(index, 1);
    localStorage.setItem("tickets", JSON.stringify(tickets));
    mostrarTickets();
}

// Marcar ticket como leído
function marcarLeido(index) {
    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    tickets[index].leido = !tickets[index].leido; // alterna entre leído/no leído
    localStorage.setItem("tickets", JSON.stringify(tickets));
    mostrarTickets();
}

// Contador de urgentes (alta prioridad)
function actualizarUrgentes() {
    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    const urgentes = tickets.filter(t => t.prioridad === "alta").length;
    document.getElementById("countUrgent").textContent = urgentes;
}
