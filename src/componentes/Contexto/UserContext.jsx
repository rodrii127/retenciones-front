import { createContext, useEffect, useReducer } from "react";
import { authReducer } from "../../auth/AuthReducer";

export const UserContext = createContext();

const init = () => {
    return JSON.parse( localStorage.getItem('user')) || {logged: false};
}


export const UserProvider = ({ children }) => {

    const [user, dispatch] = useReducer(authReducer, {}, init) 

    useEffect(() => {
        if (!user) return;

        localStorage.setItem('user', JSON.stringify(user))
    }, [user])


    return (
        <UserContext.Provider value={{ user, dispatch }} >
            {children}
        </UserContext.Provider>
    )

}