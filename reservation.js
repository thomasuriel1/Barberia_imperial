document.addEventListener("DOMContentLoaded", () => {
  const servicesGrid = document.querySelector(".services-grid");
  const barbersGrid = document.querySelector(".barbers-grid");
  const dateOptions = document.querySelectorAll(".date-option");
  const timeSlotsGrid = document.querySelector(".time-slots-grid");
  const dateHeader = document.querySelector(
    ".time-slots-container .date-header"
  );
  const confirmButton = document.getElementById("confirm-btn");

  let selectedService =
    document.querySelector(".service-card.active")?.dataset.service || null;
  let selectedBarber =
    document.querySelector(".barber-card.active")?.dataset.barber || null;
  let selectedDate =
    document.querySelector(".date-option.active")?.dataset.date || null;
  let selectedTime = null;

  // --- Funciones para manejar la selección de tarjetas (servicios/barberos) ---
  function handleCardSelection(container, className, datasetKey, card) {
    container.querySelectorAll(`.${className}`).forEach((item) => {
      item.classList.remove("active");
    });
    card.classList.add("active");
    if (datasetKey === "service") {
      selectedService = card.dataset[datasetKey];
    } else if (datasetKey === "barber") {
      selectedBarber = card.dataset[datasetKey];
    }
    updateConfirmButtonState();
    console.log(`Selected ${datasetKey}:`, card.dataset[datasetKey]);
    generateTimeSlots(selectedDate, selectedBarber); // Regenerar horarios al cambiar barbero
  }

  servicesGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".service-card");
    if (card) {
      handleCardSelection(servicesGrid, "service-card", "service", card);
    }
  });

  barbersGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".barber-card");
    if (card) {
      handleCardSelection(barbersGrid, "barber-card", "barber", card);
    }
  });

  // --- Funciones para manejar la selección de fecha ---
  dateOptions.forEach((option) => {
    option.addEventListener("click", () => {
      dateOptions.forEach((opt) => opt.classList.remove("active"));
      option.classList.add("active");
      selectedDate = option.dataset.date;
      dateHeader.innerHTML = `<i class="fas fa-calendar-alt"></i> ${option.textContent}`;
      generateTimeSlots(selectedDate, selectedBarber);
      selectedTime = null; // Resetear hora al cambiar de día
      updateConfirmButtonState();
    });
  });

  // --- Generación de Horarios (10:00 a 20:00) ---
  function generateTimeSlots(date, barber) {
    timeSlotsGrid.innerHTML = ""; // Limpiar horarios existentes
    const startTime = 10 * 60; // 10:00 AM en minutos
    const endTime = 20 * 60; // 08:00 PM en minutos
    const interval = 30; // Turnos cada 30 minutos

    // Ahora, todos los turnos están libres, ya que la lista de reservados es un array vacío.
    const currentReserved = [];

    for (let i = startTime; i < endTime; i += interval) {
      const hour = Math.floor(i / 60);
      const minute = i % 60;
      const timeString = `${String(hour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;

      const isReserved = currentReserved.includes(timeString);
      const statusClass = isReserved ? "reserved" : "available";
      const statusText = isReserved ? "RESERVADO" : "DISPONIBLE";

      const timeSlotDiv = document.createElement("div");
      timeSlotDiv.classList.add("time-slot", statusClass);
      timeSlotDiv.dataset.time = timeString;
      timeSlotDiv.innerHTML = `
                ${timeString}
                <span class="status">${statusText}</span>
                ${!isReserved ? '<span class="duration">30 min</span>' : ""}
            `;
      timeSlotsGrid.appendChild(timeSlotDiv);

      if (!isReserved) {
        timeSlotDiv.addEventListener("click", () => {
          if (selectedTime) {
            document
              .querySelector(`.time-slot.selected`)
              ?.classList.remove("selected");
          }
          timeSlotDiv.classList.add("selected");
          selectedTime = timeString;
          updateConfirmButtonState();
          console.log("Hora seleccionada:", selectedTime);
        });
      }
    }
  }

  // --- Habilitar/Deshabilitar botón de confirmar ---
  function updateConfirmButtonState() {
    if (selectedService && selectedBarber && selectedDate && selectedTime) {
      confirmButton.disabled = false;
      confirmButton.style.opacity = "1";
      confirmButton.style.cursor = "pointer";
    } else {
      confirmButton.disabled = true;
      confirmButton.style.opacity = "0.5";
      confirmButton.style.cursor = "not-allowed";
    }
  }

  // --- Evento del botón Confirmar Reserva ---
  // Evento del botón Continuar (Confirmar)
  // Evento del botón Continuar (Confirmar) en reservar.html
  confirmButton.addEventListener("click", () => {
    if (selectedService && selectedBarber && selectedDate && selectedTime) {
      // PREPARAR Y GUARDAR LOS DATOS EN localStorage
      const reservationDetails = {
        serviceId: selectedService,
        serviceName: document.querySelector(
          `.service-card[data-service="${selectedService}"] .card-title`
        ).textContent,
        serviceImage: document
          .querySelector(
            `.service-card[data-service="${selectedService}"] .card-image-placeholder`
          )
          .style.backgroundImage.slice(5, -2), // Extrae la URL de la imagen

        barberId: selectedBarber,
        barberName: document.querySelector(
          `.barber-card[data-barber="${selectedBarber}"] .card-title`
        ).textContent,
        barberImage: document
          .querySelector(
            `.barber-card[data-barber="${selectedBarber}"] .card-image-placeholder`
          )
          .style.backgroundImage.slice(5, -2),

        date: selectedDate,
        dateDisplay: document.querySelector(".date-option.active").textContent, // Ej: Mar 28 Oct
        time: selectedTime,
        duration:
          document.querySelector(".time-slot.selected .duration")
            ?.textContent || "30 min", // O un valor por defecto
      };

      localStorage.setItem(
        "currentReservation",
        JSON.stringify(reservationDetails)
      );

      // REDIRIGIR A LA PÁGINA DE CONFIRMACIÓN
      window.location.href = "confirmacion.html";
    } else {
      alert(
        "Por favor, selecciona un servicio, un barbero, una fecha y una hora."
      );
    }
  });
  // Inicialización al cargar la página
  generateTimeSlots(selectedDate, selectedBarber);
  updateConfirmButtonState();
});
