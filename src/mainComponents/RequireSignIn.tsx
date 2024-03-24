import React, { ReactNode, useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { NavbarComponent } from "./Navbar";
import SignUpForm from "../Auth/SignUp";

interface childrenProp {
  children: ReactNode;
}

export const RequireSignIn: React.FC<childrenProp> = ({children}) => {
    const {user, setUser} = useContext(UserContext);
    
    if (!user.isAuthenticated) { 
        return <NavbarComponent><SignUpForm/></NavbarComponent>
    } else {
        return <>{children}</>
    }
}

export const NotRequireSignIn: React.FC<childrenProp> = ({children}) => {
    const {user, setUser} = useContext(UserContext);
    
    if (user.isAuthenticated) { 
        return <NavbarComponent><h1 className='text-green-500 text-3xl text-center'>Home</h1></NavbarComponent>
    } else {
        return <>{children}</>
    }
}
