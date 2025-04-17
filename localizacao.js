// Seleciona os elementos HTML
const cityInput = document.getElementById('cityInput');
const cepInput = document.getElementById('cep');
const weatherButton = document.getElementById('weatherBtn');
const weatherDisplayDiv = document.getElementById('weatherDisplay');
const porCidadeRadio = document.getElementById('porCidade');
const porCEPRadio = document.getElementById('porCEP');
const inputCidadeDiv = document.getElementById('inputCidade');
const inputCEPDiv = document.getElementById('inputCEP');

porCidadeRadio.addEventListener('change', function() {
    if(this.checked) {
        inputCidadeDiv.style.display = 'block';
        inputCEPDiv.style.display = 'none';
    }
});

porCEPRadio.addEventListener('change', function() {
    if(this.checked) {
        inputCidadeDiv.style.display = 'none';
        inputCEPDiv.style.display = 'block';
    }
});

//Função principal para buscar o clima
 
async function fetchWeather() {
    // Verifica qual método de consulta está selecionado
    if(porCidadeRadio.checked) {
        await fetchByCity();
    } else {
        await fetchByCEP();
    }
}
//Busca por nome da cidade
async function fetchByCity() {
    const cityName = cityInput.value.trim();

    if (!cityName) {
        showError('Por favor, digite o nome de uma cidade.');
        return;
    }

    startLoading();

    try {
        const apiUrl = `https://goweather.herokuapp.com/weather/${encodeURIComponent(cityName)}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Falha na requisição (Status: ${response.status})`);
        }

        const data = await response.json();
        
        if (data && data.temperature) {
            showWeather(`
                <p><strong>Cidade:</strong> ${cityName}</p>
                <p><strong>Temperatura:</strong> ${data.temperature}</p>
                <p><strong>Vento:</strong> ${data.wind}</p>
                <p><strong>Descrição:</strong> ${data.description}</p>
            `);
        } else {
            throw new Error(`Não foi possível encontrar a previsão para "${cityName}"`);
        }
    } catch (error) {
        showError(error.message);
    } finally {
        stopLoading();
    }
}

//Busca por CEP
 
async function fetchByCEP() {
    const cep = cepInput.value.replace(/\D/g, '');

    if (cep.length !== 8) {
        showError('CEP inválido. Digite 8 números.');
        return;
    }

    startLoading();

    try {
        // Consulta o endereço pelo CEP
        const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const endereco = await viaCepResponse.json();
        
        if (endereco.erro) {
            throw new Error("CEP não encontrado");
        }
        
        // Consulta o clima pela cidade
        const cityName = endereco.localidade;
        const apiUrl = `https://goweather.herokuapp.com/weather/${encodeURIComponent(cityName)}`;
        const weatherResponse = await fetch(apiUrl);
        const data = await weatherResponse.json();
        
        if (data && data.temperature) {
            showWeather(`
                <p><strong>Endereço:</strong> ${endereco.logradouro || 'Não informado'}, ${endereco.bairro || 'Não informado'}</p>
                <p><strong>Cidade:</strong> ${endereco.localidade} - ${endereco.uf}</p>
                <p><strong>Temperatura:</strong> ${data.temperature}</p>
                <p><strong>Vento:</strong> ${data.wind}</p>
                <p><strong>Descrição:</strong> ${data.description}</p>
            `);
        } else {
            throw new Error(`Não foi possível encontrar a previsão para ${endereco.localidade}`);
        }
    } catch (error) {
        showError(error.message);
    } finally {
        stopLoading();
    }
}

// Funções auxiliares
function startLoading() {
    weatherButton.disabled = true;
    weatherDisplayDiv.innerHTML = 'Buscando informações...';
    weatherDisplayDiv.classList.add('loading');
    weatherDisplayDiv.classList.remove('error');
}

function stopLoading() {
    weatherButton.disabled = false;
}

function showError(message) {
    weatherDisplayDiv.innerHTML = `Erro: ${message}`;
    weatherDisplayDiv.classList.add('error');
    weatherDisplayDiv.classList.remove('loading');
}

function showWeather(content) {
    weatherDisplayDiv.innerHTML = content;
    weatherDisplayDiv.classList.remove('loading', 'error');
}