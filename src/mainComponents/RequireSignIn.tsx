import React, { ReactNode, useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { NavbarComponent } from "./Navbar";
import SignUpForm from "../Auth/SignUp";
import HomeComponent from "../home";

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
        return <NavbarComponent><HomeComponent/></NavbarComponent>
    } else {
        return <>{children}</>
    }
}
