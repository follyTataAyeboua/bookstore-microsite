import api from "./api";
import TokenService from "./token.service";

const signup = (username, firstname, lastname, email, password) => {
    return api.post("/api/auth/signup", {username, firstname, lastname, email, password}).then((response) => {
            if (response.data.accessToken) {
                TokenService.setUser(response.data);
            }

            return response.data;
        });
};

const login = (username, password) => {
    return api.post("/api/auth/login", {username, password}).then((response) => {
            if (response.data.accessToken) {
                TokenService.setUser(response.data);
            }

            return response.data;
        });
};

const logout = () => {
    TokenService.removeUser();
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const authService = {
    signup,
    login,
    logout,
    getCurrentUser,
};

export default authService;