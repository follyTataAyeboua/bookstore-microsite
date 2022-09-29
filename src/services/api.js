import axios from "axios";
import TokenService from "./token.service";

const instance = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = TokenService.getLocalAccessToken();
        const username = TokenService.getUsername();
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
            config.headers["Username"] = username;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (err.response) {
            // access token expired
            if (err.response.status === 401 && !originalConfig._retry) {
                // handle infinite loop
                originalConfig._retry = true;

                try {
                    const rs = await instance.post("/api/auth/token/refresh", {
                        refreshToken: TokenService.getLocalRefreshToken(),
                    });

                    console.log("response", rs);

                    const { accessToken } = rs.data;

                    console.log("updateNewAccessToken", accessToken);
                    TokenService.updateNewAccessToken(accessToken);

                    return instance(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }

        }

        return Promise.reject(err);
    }
);

export default instance;