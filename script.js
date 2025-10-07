function performSearch() {
    const query = document.getElementById('search-input').value;

    if (query.trim() === '') {
        alert('Por favor, ingresa un servicio o negocio a buscar.');
        return;
    }

    console.log('Búsqueda iniciada para:', query);
    alert(`Buscando: "${query}". (En un entorno real, aquí verías los resultados.)`);
    
    document.getElementById('search-input').value = '';
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
}