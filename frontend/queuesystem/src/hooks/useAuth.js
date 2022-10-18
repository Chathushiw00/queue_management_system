
import { useContext ,useDebugValue} from "react";
import AuthContext from "../context/AuthProvider";


const useAuth = () => {
    const { auth } = useContext(AuthContext) //setAuth
    
    

    useDebugValue(auth, auth => auth?.username ? "Logged In" : "Logged Out") //changed auth?.user as auth?.username 
    return useContext(AuthContext);
}

export default useAuth