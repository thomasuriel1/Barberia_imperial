// =================================================================
// 🚨 CONFIGURACIÓN: URL DE TU SERVIDOR POCKETBASE 🚨
// =================================================================
const POCKETBASE_URL = "http://127.0.0.1:8090";
// =================================================================

// Variables de estado
let selectedServiceId = null;
let selectedServiceName = null;
let selectedBarberId = null;
let selectedBarberName = null;
let selectedDate = null;
let selectedTime = null;

// Reglas Fijas
const FIXED_DURATION_MINUTES = 30; // Duración estándar de un servicio
const FIXED_START_HOUR = 10;
const FIXED_END_HOUR = 20;

// Referencias a elementos
// 🚨 CAMBIO 2: Corregida la búsqueda usando querySelector (clase) o getElementById (ID nuevo) 🚨
const servicesGrid = document.getElementById("services-grid");
const barbersGrid = document.querySelector(".barbers-grid"); // Se asume que el contenedor de barberos también se llenará dinámicamente
const timeSlotsGrid = document.querySelector(".time-slots-grid"); // Corregido selector
const confirmBtn = document.getElementById("confirm-btn");

// --- 1. CARGA DINÁMICA DE SERVICIOS ---

async function loadServices() {
  if (!servicesGrid) {
    console.error("No se encontró el elemento con ID 'services-grid'.");
    return;
  }

  try {
    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/servicios/records`
    );
    if (!response.ok) throw new Error("Error al cargar servicios.");
    const data = await response.json();

    // Limpiar el contenedor antes de añadir el contenido dinámico
    servicesGrid.innerHTML = "";

    data.items.forEach((service) => {
      const card = document.createElement("div");
      card.classList.add("selection-card", "service-card");

      card.dataset.id = service.id;
      card.dataset.name = service.nombre;

      // Seleccionar el primer servicio por defecto si no hay ninguno seleccionado
      if (!selectedServiceId) {
        selectedServiceId = service.id;
        selectedServiceName = service.nombre;
        card.classList.add("active");
      }

      // Estructura HTML de la tarjeta
      const serviceNameUrl = service.nombre.toLowerCase().replace(/ /g, "-");
      card.innerHTML = `
                <div class="card-image-placeholder" 
                     style="background-image: url('placeholder-${serviceNameUrl}.jpg');">
                </div>
                <div class="card-title">${service.nombre}</div>
                <div class="service-details">
                </div>
            `;

      card.addEventListener("click", () =>
        handleServiceSelection(card, service)
      );
      servicesGrid.appendChild(card);
    });

    // Si ya hay barbero y fecha (por defecto), intenta generar los slots
    if (selectedBarberId && selectedDate) {
      generateTimeSlots(selectedDate, selectedBarberId);
    }
  } catch (error) {
    servicesGrid.innerHTML =
      '<p class="error">🚨 Error al cargar Servicios. Verifica PocketBase y el CORS.</p>';
    console.error("Error al cargar servicios:", error);
  }
}

// 🚨 NUEVO: Carga dinámica de barberos 🚨
async function loadBarbers() {
  if (!barbersGrid) {
    console.error("No se encontró el elemento con la clase 'barbers-grid'.");
    return;
  }

  try {
    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/barberos/records`
    );
    if (!response.ok) throw new Error("Error al cargar barberos.");
    const data = await response.json();

    barbersGrid.innerHTML = "";

    data.items.forEach((barber) => {
      const card = document.createElement("div");
      card.classList.add("selection-card", "barber-card");

      card.dataset.id = barber.id;
      card.dataset.name = barber.nombre;

      // Seleccionar el primer barbero por defecto
      if (!selectedBarberId) {
        selectedBarberId = barber.id;
        selectedBarberName = barber.nombre;
        card.classList.add("active");
      }
      // Estructura HTML de la tarjeta
      const barberNameUrl = barber.nombre.toLowerCase().replace(/ /g, "-");
      card.innerHTML = `
        <div class="card-image-placeholder" 
             style="background-image: url('placeholder-${barberNameUrl}.jpg');">
        </div>
        <div class="card-title">${barber.nombre}</div>
      `;

      card.addEventListener("click", () => handleBarberSelection(card, barber));
      barbersGrid.appendChild(card);
    });

    // Si ya hay servicio y fecha (por defecto), intenta generar los slots
    if (selectedServiceId && selectedDate) {
      generateTimeSlots(selectedDate, selectedBarberId);
    }
  } catch (error) {
    barbersGrid.innerHTML =
      '<p class="error">🚨 Error al cargar Barberos. Verifica la colección `barberos`.</p>';
    console.error("Error al cargar barberos:", error);
  }
}

// --- 2. MANEJO DE SELECCIONES ---

function handleServiceSelection(card, service) {
  document
    .querySelectorAll(".service-card")
    .forEach((c) => c.classList.remove("active"));
  card.classList.add("active");

  selectedServiceId = service.id;
  selectedServiceName = service.nombre;
  selectedTime = null; // Resetear la hora al cambiar de servicio

  if (selectedBarberId && selectedDate) {
    generateTimeSlots(selectedDate, selectedBarberId);
  }
  updateConfirmButtonState();
}

function handleBarberSelection(card, barber) {
  document
    .querySelectorAll(".barber-card")
    .forEach((c) => c.classList.remove("active"));
  card.classList.add("active");

  selectedBarberId = barber.id;
  selectedBarberName = barber.nombre;
  selectedTime = null; // Resetear la hora al cambiar de barbero

  if (selectedServiceId && selectedDate) {
    generateTimeSlots(selectedDate, selectedBarberId);
  }
  updateConfirmButtonState();
}

// 🚨 NUEVO: Manejo de la selección de fecha 🚨
function handleDateSelection(card) {
  document
    .querySelectorAll(".date-option")
    .forEach((c) => c.classList.remove("active"));
  card.classList.add("active");

  selectedDate = card.dataset.date;
  selectedTime = null; // Resetear la hora al cambiar de fecha

  // 💡 Actualizar el header de la fecha (opcional)
  const dateText = card.textContent.trim();
  document.querySelector(
    ".date-header"
  ).innerHTML = `<i class="fas fa-calendar-alt"></i> ${dateText.replace(
    /\s+/g,
    " "
  )}`;

  if (selectedServiceId && selectedBarberId) {
    generateTimeSlots(selectedDate, selectedBarberId);
  }
  updateConfirmButtonState();
}

// --- 3. GENERACIÓN Y BLOQUEO DE HORARIOS (CON FETCH) ---

async function generateTimeSlots(date, barberId) {
  if (!timeSlotsGrid) return;
  timeSlotsGrid.innerHTML = "";

  const startTime = FIXED_START_HOUR * 60;
  const endTime = FIXED_END_HOUR * 60;
  const interval = FIXED_DURATION_MINUTES;

  if (!barberId || !date || !selectedServiceId) {
    timeSlotsGrid.innerHTML =
      '<p class="info-message">Selecciona Servicio, Barbero y Fecha.</p>';
    return;
  }

  try {
    // Consulta PocketBase para citas existentes (filtrando por fecha y barbero)
    const filterString = `fecha='${date}' && barbero='${barberId}'`;
    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/citas/records?filter=(${filterString})`
    );

    if (!response.ok) throw new Error("Error al obtener citas.");

    const citasExistentes = await response.json();
    const reservedSlots = [];

    // Mapear citas existentes a minutos de inicio y fin
    citasExistentes.items.forEach((cita) => {
      const [h, m] = cita.hora.split(":").map(Number);
      const startMin = h * 60 + m;
      // Nota: Asume que 'cita.duracion_minutos' está en PocketBase. Si no, usa FIXED_DURATION_MINUTES.
      const duration = cita.duracion_minutos || FIXED_DURATION_MINUTES;
      const endMin = startMin + duration;
      reservedSlots.push({ start: startMin, end: endMin });
    });

    let hasAvailableSlots = false;

    for (let i = startTime; i < endTime; i += interval) {
      const slotStartMin = i;
      const slotEndMin = i + interval;

      const hour = Math.floor(i / 60);
      const minute = i % 60;
      const timeString = `${String(hour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;

      // Chequeo de solapamiento con reservas existentes
      const isReserved = reservedSlots.some((reserva) => {
        return slotStartMin < reserva.end && slotEndMin > reserva.start;
      });

      const statusClass = isReserved ? "reserved" : "available";
      const statusText = isReserved ? "RESERVADO" : "DISPONIBLE";

      const timeSlotDiv = document.createElement("div");
      timeSlotDiv.classList.add("time-slot", statusClass);
      timeSlotDiv.dataset.time = timeString;
      timeSlotDiv.innerHTML = `
                ${timeString}
                <span class="status">${statusText}</span>
                ${
                  !isReserved
                    ? `<span class="duration">${interval} min</span>`
                    : ""
                }
            `;
      timeSlotsGrid.appendChild(timeSlotDiv);

      if (!isReserved) {
        hasAvailableSlots = true;
        timeSlotDiv.addEventListener("click", (e) => {
          document
            .querySelector(".time-slot.selected")
            ?.classList.remove("selected");
          e.currentTarget.classList.add("selected");
          selectedTime = timeString;
          updateConfirmButtonState();
        });
      }
    }

    if (!hasAvailableSlots) {
      timeSlotsGrid.innerHTML =
        '<p class="info-message">No hay horarios disponibles para esta selección.</p>';
    }
  } catch (error) {
    console.error("Error en la generación de slots:", error);
    timeSlotsGrid.innerHTML =
      '<p style="text-align:center; color:red;">🚨 Error al cargar horarios.</p>';
  }
}

// --- 4. MANEJO DEL BOTÓN DE CONFIRMACIÓN ---

function updateConfirmButtonState() {
  if (confirmBtn) {
    const isReady =
      selectedServiceId && selectedBarberId && selectedDate && selectedTime;
    confirmBtn.disabled = !isReady;
    confirmBtn.textContent = isReady
      ? "Continuar con la Reserva"
      : "Selecciona todo para continuar";
  }
}

// 🚨 NUEVO: Función para enviar la reserva a PocketBase 🚨
async function handleConfirmation() {
  if (
    !selectedServiceId ||
    !selectedBarberId ||
    !selectedDate ||
    !selectedTime
  ) {
    alert(
      "Por favor, completa todas las selecciones (Servicio, Barbero, Fecha y Hora)."
    );
    return;
  }

  // Aquí puedes incluir la lógica para obtener el ID del usuario actual si tienes un sistema de login
  const clientUserId = "some_client_id_from_session";

  const reservationData = {
    servicio: selectedServiceId, // ID del servicio
    barbero: selectedBarberId, // ID del barbero
    fecha: selectedDate, // Formato 'YYYY-MM-DD'
    hora: selectedTime, // Formato 'HH:MM'
    duracion_minutos: FIXED_DURATION_MINUTES,
    cliente: clientUserId, // Reemplaza con el ID real del usuario
    estado: "pendiente", // Estado inicial
  };

  confirmBtn.disabled = true;
  confirmBtn.textContent = "Reservando...";

  try {
    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/citas/records`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from PocketBase:", errorData);
      throw new Error(`Error ${response.status}: No se pudo crear la cita.`);
    }

    const data = await response.json();
    alert(
      `¡Cita reservada con éxito! Detalles:\nServicio: ${selectedServiceName}\nBarbero: ${selectedBarberName}\nHora: ${data.hora} del ${data.fecha}`
    );
    // Opcional: Recargar o redirigir
    // window.location.reload();
  } catch (error) {
    console.error("Error al reservar:", error);
    alert(
      "Hubo un error al intentar reservar la cita. Revisa la consola y tu base de datos."
    );
    confirmBtn.disabled = false;
    confirmBtn.textContent = "Continuar con la Reserva";
  }
}

// --- 5. INICIALIZACIÓN ---

document.addEventListener("DOMContentLoaded", () => {
  // 1. Cargar datos desde PocketBase
  loadServices();
  loadBarbers();

  // 2. Configurar la fecha inicial y listeners para las tarjetas de fecha estáticas
  const dateOptions = document.querySelectorAll(".date-option");
  dateOptions.forEach((card) => {
    card.addEventListener("click", () => handleDateSelection(card));
    // Establecer la fecha inicial activa
    if (card.classList.contains("active")) {
      selectedDate = card.dataset.date;
    }
  });

  // 3. Listener para el botón de confirmar
  if (confirmBtn) {
    confirmBtn.addEventListener("click", handleConfirmation);
  }

  // 4. Actualizar el estado inicial del botón
  updateConfirmButtonState();
});
