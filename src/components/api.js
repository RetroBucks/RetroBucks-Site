import axios from 'axios';

const openaiApi = axios.create({
  baseURL: 'https://api.openai.com/v1/completions',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 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',
  },
});

export default openaiApi;
