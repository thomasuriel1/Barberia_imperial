document.addEventListener('DOMContentLoaded', () => {
    const reservationData = JSON.parse(localStorage.getItem('currentReservation'));

    if (reservationData) {
        // --- Actualizar Servicio ---
        document.getElementById('selected-service-image').style.backgroundImage = `url('${reservationData.serviceImage}')`;
        document.getElementById('selected-service-name').textContent = reservationData.serviceName;

        // --- Actualizar Barbero ---
        document.getElementById('selected-barber-image').style.backgroundImage = `url('${reservationData.barberImage}')`;
        document.getElementById('selected-barber-name').textContent = reservationData.barberName;

        // --- Actualizar Detalles de Fecha/Hora ---
        // Formatear la fecha para mostrar el día de la semana largo
        const dateObj = new Date(reservationData.date + 'T00:00:00'); // Asegura que sea el día correcto sin problemas de zona horaria
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        document.getElementById('selected-date-display').textContent = dateObj.toLocaleDateString('es-ES', options);
        
        document.getElementById('selected-time-display').textContent = reservationData.time;
        document.getElementById('selected-duration-display').textContent = reservationData.duration;

        // --- Calcular Horas hasta la Cita ---
        const now = new Date();
        const appointmentDateTime = new Date(`${reservationData.date}T${reservationData.time}:00`);
        const diffMs = appointmentDateTime - now;
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60)); // Redondea hacia arriba

        if (diffHours > 0) {
            document.getElementById('hours-until-appointment').textContent = diffHours;
        } else {
            document.getElementById('hours-until-appointment').textContent = 'pocas'; // Ocultar si ya pasó o es muy pronto
        }

    } else {
        alert('No hay datos de reserva. Por favor, seleccione un turno primero.');
        // Opcional: Redirigir de vuelta a la página de reservas
        // window.location.href = 'reservar.html'; 
    }
});