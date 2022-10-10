import { createContext, useState ,useEffect} from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
   
    const [auth, setAuth] = useState(()=>
        JSON.parse(sessionStorage.getItem('user')))
  
    useEffect(()=>{
      if(auth==undefined)
      { }
      else{
        sessionStorage.setItem('user',JSON.stringify(auth))
      }
   
      },[auth])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;