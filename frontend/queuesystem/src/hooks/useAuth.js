
import { useContext ,useDebugValue} from "react";
import AuthContext from "../context/AuthProvider";


const useAuth = () => {
    const { auth } = useContext(AuthContext) //setAuth
    
     /* useEffect(()=>{
     const data =JSON.parse(localStorage.getItem('user'))
         
      setAuth(data)
    console.log(data)
      },[]) */
    

    useDebugValue(auth, auth => auth?.username ? "Logged In" : "Logged Out") //changed auth?.user as auth?.username 
    return useContext(AuthContext);
}

export default useAuth