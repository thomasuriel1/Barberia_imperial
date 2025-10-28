document.addEventListener("DOMContentLoaded", () => {
  const finalConfirmBtn = document.getElementById("final-confirm-btn");
  const clientNameInput = document.getElementById("client-name");
  const clientPhoneInput = document.getElementById("client-phone");
  const clientDetailsForm = document.querySelector(".client-details-form");

  finalConfirmBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Evita el envío por defecto del formulario

    if (clientDetailsForm.checkValidity()) {
      // Aquí iría la lógica para enviar los datos de la reserva y del cliente
      // a tu backend. Por ahora, mostraremos un alert.
      const clientData = {
        name: clientNameInput.value,
        phone: clientPhoneInput.value,
        countryCode: document.getElementById("country-code").value,
      };

      // Recuperar los datos de la reserva almacenados localmente
      const reservationData = JSON.parse(
        localStorage.getItem("currentReservation")
      );

      if (reservationData) {
        alert(
          `¡Reserva Finalizada con éxito!\n\nCliente: ${clientData.name}\nTeléfono: ${clientData.countryCode} ${clientData.phone}\n\nServicio: ${reservationData.serviceName}\nBarbero: ${reservationData.barberName}\nFecha: ${reservationData.date}\nHora: ${reservationData.time}\nDuración: ${reservationData.duration}`
        );

        // Opcional: Limpiar los datos después de confirmar
        localStorage.removeItem("currentReservation");
        // Aquí podrías redirigir a una página de agradecimiento
      } else {
        alert(
          "Error: No se encontraron los datos de la reserva. Por favor, vuelve a la página anterior."
        );
      }
    } else {
      // Si la validación del navegador falla, muestra los mensajes de error.
      clientDetailsForm.reportValidity();
      alert("Por favor, completa todos los campos obligatorios.");
    }
  });
  /**
   * Bloquea la entrada de caracteres que no son dígitos en un campo de texto.
   * Se llama usando oninput="validateNumberInput(this)" en el HTML.
   */
  function validateNumberInput(inputElement) {
    // 1. Reemplaza cualquier carácter que NO sea un dígito (0-9) con una cadena vacía ('').
    //    Esto elimina letras, signos de puntuación, etc.
    inputElement.value = inputElement.value.replace(/[^0-9]/g, "");

    // 2. Aplica la restricción de longitud (aunque ya está en el HTML, es una buena práctica repetirlo en JS)
    if (inputElement.value.length > 10) {
      inputElement.value = inputElement.value.slice(0, 10);
    }
  }
});
