import {User} from "../context/authContext";
import {Endpoint} from "../context/authContext";

export const localStorageExist = () => typeof window !== "undefined" && "localStorage" in window && window["localStorage"] !== null

export const setLocalStorage = (name: string, value: string) => {
    if (localStorageExist()) {
        localStorage.setItem(name, value);
    }
};

export const removeLocalStorage = (name: string) => {
    if (localStorageExist()) {
        localStorage.removeItem(name);
    }
};

export const getFromLocalStorage = (name: string) => localStorageExist() ? localStorage.getItem(name) : null;

export const setUser = (user: User) => {
    setLocalStorage("user", JSON.stringify(user))
};

export const setEndpoint = (endpoint: Endpoint) => {
    setLocalStorage("endpoint", JSON.stringify(endpoint))
};

export const resetUser = () => {
    removeLocalStorage("user")
};

export const getUser = () => {
    const user = getFromLocalStorage("user")
    return user ? JSON.parse(user) : null
};

export const getEndpoint = () => {
    const endpoint = getFromLocalStorage("endpoint")
    return endpoint ? JSON.parse(endpoint) : null
};