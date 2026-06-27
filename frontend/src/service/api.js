import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({ baseURL: BASE });

export default api;