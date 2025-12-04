// Exemple d'appel API vers le backend
document.addEventListener('DOMContentLoaded', function() {
    const testBtn = document.getElementById('testBtn');
    const responseDiv = document.getElementById('response');
    
    testBtn.addEventListener('click', async function() {
        try {
            const response = await fetch('/api/hello');
            const data = await response.json();
            
            responseDiv.style.display = 'block';
            responseDiv.innerHTML = `
                <strong>Réponse de l'API:</strong><br>
                Message: ${data.message}<br>
                Status: ${data.status}
            `;
        } catch (error) {
            responseDiv.style.display = 'block';
            responseDiv.innerHTML = `<strong>Erreur:</strong> ${error.message}`;
        }
    });
});
