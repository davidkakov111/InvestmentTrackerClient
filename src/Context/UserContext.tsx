import { ReactNode, createContext, useState, useEffect } from "react";

interface UserCPProps {
    children: ReactNode;
}

interface UserContextValue {
    user: {
        isAuthenticated: boolean;
        email: string;
    },
    setUser: React.Dispatch<React.SetStateAction<{
        isAuthenticated: boolean;
        email: string;
    }>>;
}

export const UserContext = createContext<UserContextValue>({
    user: { isAuthenticated: false, email: "" },
    setUser: ()=>{}
});

export const UserContextProvider: React.FC<UserCPProps> = ({children}) => {
    const [user, setUser] = useState({isAuthenticated: false, email: ""})

    useEffect(()=>{
        const JWT = localStorage.getItem('JWTToken');
        if (JWT) {
            const getUser = async () => {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/GetUserContext`, {
                    method: "GET",
                    headers: {
                        "Authorization": JWT
                    }
                });
                const result = await response.json()
                if (response.ok) {
                    setUser({isAuthenticated: true, email: result.result})
                }
            }
            getUser()
        }
    }, [])

    return(
        <UserContext.Provider value={{user: user, setUser: setUser}}>
            {children}
        </UserContext.Provider>
    );
}
