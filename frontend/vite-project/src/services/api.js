// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Health check
// export const checkHealth = async () => {
//   const response = await api.get('/health');
//   return response.data;
// };

// // Get model information
// export const getModelInfo = async () => {
//   const response = await api.get('/model-info');
//   return response.data;
// };

// // Get feature options (for dropdowns)
// export const getFeatureOptions = async () => {
//   const response = await api.get('/feature-options');
//   return response.data;
// };

// // Predict car price
// export const predictPrice = async (carData) => {
//   const response = await api.post('/predict', carData);
//   return response.data;
// };

// // Get visualization image URL
// export const getVisualizationUrl = (vizType) => {
//   return `${API_BASE_URL}/visualizations/${vizType}`;
// };

// // Get analytics stats
// export const getAnalyticsStats = async () => {
//   const response = await api.get('/analytics/stats');
//   return response.data;
// };

// // Chatbot
// export const sendChatMessage = async (message) => {
//   const response = await api.post('/chatbot', { message });
//   return response.data;
// };

// export default api;


// API Configuration
const API_BASE = 'http://localhost:5000/api';

// Helper function for fetch requests
const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

// Health Check
export const checkHealth = () => {
  return apiRequest('/health');
};

// Model Information
export const fetchModelInfo = () => {
  return apiRequest('/model-info');
};

// Feature Options
export const fetchFeatureOptions = () => {
  return apiRequest('/feature-options');
};

// Predict Price
export const predictPrice = (carData) => {
  return apiRequest('/predict', {
    method: 'POST',
    body: JSON.stringify(carData),
  });
};

// Batch Prediction
export const batchPredict = (carsArray) => {
  return apiRequest('/predict/batch', {
    method: 'POST',
    body: JSON.stringify({ cars: carsArray }),
  });
};

// Analytics Stats
export const fetchAnalytics = () => {
  return apiRequest('/analytics/stats');
};

// Chatbot Message
export const sendChatMessage = (sessionId, message) => {
  return apiRequest('/chatbot', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      message: message,
    }),
  });
};

// Visualizations
export const getVisualizationUrl = (type) => {
  return `${API_BASE}/visualizations/${type}`;
};

export default {
  checkHealth,
  fetchModelInfo,
  fetchFeatureOptions,
  predictPrice,
  batchPredict,
  fetchAnalytics,
  sendChatMessage,
  getVisualizationUrl,
};