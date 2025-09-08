import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true, // MUITO IMPORTANTE pros cookies irem junto
});

// intercepta respostas 401 e tenta refresh
api.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const { data } = await axios.post(
          "http://localhost:4000/auth/login",
          {},
          { withCredentials: true }
        )
        // salva novo token
        localStorage.setItem("token", data.token)
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`
        error.config.headers["Authorization"] = `Bearer ${data.token}`
        return api(error.config) // re-executa a request original
      } catch (err) {
        localStorage.removeItem("token")
        window.location.href = "/login"
        console.error("An error occurred:", err)
      }
    }
    return Promise.reject(error)
  }
)

export default api;