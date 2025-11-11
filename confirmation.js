// =================================================================
// 🚨 CONFIGURACIÓN: URL DE TU SERVIDOR POCKETBASE 🚨
// =================================================================
const POCKETBASE_URL = "http://127.0.0.1:8090";
// =================================================================

document.addEventListener("DOMContentLoaded", () => {
  const finalConfirmBtn = document.getElementById("final-confirm-btn");
  const clientNameInput = document.getElementById("client-name");
  const clientPhoneInput = document.getElementById("client-phone");
  const clientDetailsForm = document.querySelector(".client-details-form");

  // Cargar y mostrar datos de localStorage (ESTO SE MANTIENE IGUAL PARA LA ESTÉTICA)
  const reservationData = JSON.parse(
    localStorage.getItem("currentReservation")
  );
  // ... (Código para inyectar datos en los spans del HTML) ...
  if (reservationData) {
    document.getElementById("selected-service-name").textContent =
      reservationData.serviceName;
    document.getElementById("selected-barber-name").textContent =
      reservationData.barberName;
    document.getElementById("selected-date-display").textContent =
      reservationData.dateDisplay;
    document.getElementById("selected-time-display").textContent =
      reservationData.time;
    document.getElementById("selected-duration-display").textContent =
      reservationData.duration + " min";
  } else {
    alert("Error: No se encontraron datos de reserva. Volviendo al inicio.");
    window.location.href = "index.html";
    return;
  }

  finalConfirmBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    if (clientDetailsForm.checkValidity()) {
      const clientData = {
        name: clientNameInput.value,
        phone: clientPhoneInput.value,
      };

      finalConfirmBtn.disabled = true;
      finalConfirmBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Confirmando...';

      try {
        // 1. FETCH POST: GUARDAR EL CLIENTE
        const clientResponse = await fetch(
          `${POCKETBASE_URL}/api/collections/clientes/records`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: clientData.name,
              telefono: clientData.phone,
            }),
          }
        );

        if (!clientResponse.ok) throw new Error(`Error al guardar cliente.`);

        const newClient = await clientResponse.json();
        const clientId = newClient.id; // ID del nuevo cliente

        // 2. FETCH POST: GUARDAR LA CITA (USANDO IDs)
        const citaPayload = {
          cliente: clientId,
          fecha: reservationData.date,
          hora: reservationData.time,
          duracion_minutos: parseInt(reservationData.duration),

          barbero: reservationData.barberId,
          servicio: reservationData.serviceId,

          barbero_nombre: reservationData.barberName,
          servicio_nombre: reservationData.serviceName,
        };

        const citaResponse = await fetch(
          `${POCKETBASE_URL}/api/collections/citas/records`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(citaPayload),
          }
        );

        if (!citaResponse.ok) throw new Error(`Error al guardar la cita.`);

        // 3. ÉXITO
        localStorage.removeItem("currentReservation");
        alert(`🎉 ¡Reserva Finalizada con ÉXITO!`);

        window.location.href = "index.html";
      } catch (error) {
        console.error("Error durante la confirmación:", error);
        alert(
          "🚨 Error al conectar con el servidor o guardar la reserva. Revisa tu PocketBase y permisos."
        );
        finalConfirmBtn.disabled = false;
        finalConfirmBtn.innerHTML = '<i class="fas fa-check"></i> Confirmar';
      }
    } else {
      clientDetailsForm.reportValidity();
      alert(
        "Por favor, completa todos los campos obligatorios antes de confirmar."
      );
    }
  });
});
