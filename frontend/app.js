document.getElementById('presenca-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Capturando os valores dos campos
    const name = document.getElementById('name').value;
    const description = document.getElementById('situation').value; // Certifique-se que o ID do select é 'situation'
    const photoInput = document.getElementById('photo');

    // Verifica se o campo de foto está preenchido corretamente
    if (!photoInput.files || !photoInput.files[0]) {
        alert("Por favor, selecione uma foto.");
        return;
    }

    // Convertendo a imagem em Base64
    const photo = await convertImageToBase64(photoInput.files[0]);

    // Obtendo a localização do usuário
    navigator.geolocation.getCurrentPosition(async (position) => {
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        try {
            // Enviando a requisição para a API
            const response = await fetch('http://127.0.0.1:3000/api/presenca', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, description, location, photo })
            });

            if (response.ok) {
                document.getElementById('presenca-form').reset(); // Limpa o formulário após o sucesso
                fetchPresenca(); // Atualiza a lista de presenças
            } else {
                console.error('Erro ao adicionar presença:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao conectar com a API:', error);
        }
    }, (error) => {
        console.error('Erro ao obter localização:', error);
        alert('Erro ao obter localização, por favor ative o GPS.');
    });
});

// Função para converter imagem em Base64
async function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Função para buscar as presenças
async function fetchPresenca() {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/presenca'); // Requisição para buscar as presenças
        if (!response.ok) {
            throw new Error('Erro ao buscar presença');
        }
        const presenca = await response.json();
        const list = document.getElementById('presenca-list');
        list.innerHTML = ''; // Limpa a lista antes de atualizar
        presenca.forEach(p => {
            const item = document.createElement('div');
            item.innerHTML = `
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <img src="${p.photo}" alt="${p.name}" style="max-width: 100%; height: auto;">
            `;
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Erro ao carregar presença:', error);
    }
}

// Carregar a lista de presenças ao iniciar
fetchPresenca();
