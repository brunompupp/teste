import React from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL:'https://api.instagram.com/oauth/access_token',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

export default api;