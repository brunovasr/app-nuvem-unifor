// Endereço da API. Vazio = mesmo domínio (npm start local ou proxy do Vite).
// Versão publicada no Azure Static Web Apps: API hospedada no Render.
window.API_URL = ['localhost', '127.0.0.1'].includes(location.hostname)
  ? ''
  : 'https://biblioteca-unifor-api.onrender.com';
