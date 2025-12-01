import axios from "axios";

const API_URL = "https://tajwork.softclub.tj/";

export async function logIn(data: { username: string; password: string }) {
    try {
        const response = await axios.post(`${API_URL}auth/login/`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Сохраняем токены в localStorage
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);

        return response.data; // Возвращаем данные из ответа
    } catch (error: any) {
        console.error("Login error:", error.response?.data || error.message);
        throw error; // Пробрасываем ошибку выше
    }
}
