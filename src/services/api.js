import axios from 'axios';

const api = axios.create({
  baseURL:'',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

export default api;