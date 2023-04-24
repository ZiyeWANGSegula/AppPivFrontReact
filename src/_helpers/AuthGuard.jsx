import { Navigate } from "react-router-dom";

/**
 * Fonction de vérification de token
 * Et fermetur partie admin
 * 
 * @param {Object} props{children} 
 * @returns {ReactNode}
 */
const AuthGuard = ({children}) => {
    const isLogged = false
    // if(!accountService.isLogged()){
    //     return <Navigate to="/auth/login"/>
    // }
    if(isLogged){
        return <Navigate to="/pages/authentication/sign-in"/>
        console.log("hope")
    }
   
    return children
};

export default AuthGuard;