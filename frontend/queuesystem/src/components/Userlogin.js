
import React,{useRef,useState,useEffect} from 'react'
import axios from '../api/axios'
import '../styles/login.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Form,Button, Container} from 'react-bootstrap'
import useAuth from '../hooks/useAuth'
import { useLocation,useNavigate} from 'react-router-dom'
import Socket from './Socket'
const LOGIN_URL = '/nuser/login' //postman url


export default function UserLogin() {

    const {auth,setAuth } = useAuth()
    const navigate = useNavigate()
    const location =useLocation() 
    const from = "/issueinput" //after login redirect to issueinput page
   
  
    const userRef =useRef('')
    const errRef = useRef()
  
    const [username,setUsername] =useState('')
    const [password,setPassword] =useState('')
    const [errMsg,setErrMsg] =useState('')


    useEffect(()=> {
        userRef.current.focus()
        
      },[])
      
      useEffect(()=>{
        setErrMsg('')
      },[username,password])
    
      const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username:username,password:password }),
                {
                    headers: { 'Content-Type': 'application/json' }
                
                }
            );
            console.log(JSON.stringify(response?.data))
     
            const accessToken=(response?.data?.accessToken)
     
          
                const   counter=(response?.data?.counter)
                const  queue_num=(response?.data?.queue_num)
                const  receiverId =(response?.data?.userID) 
                
                console.log(receiverId);

      
                //sessionStorage.setItem('user',JSON.stringify({ username,accessToken,counter,queue_num,userType }))
                localStorage.setItem('user',JSON.stringify({ username,accessToken,counter,queue_num}))
                console.log(JSON.stringify({ username,accessToken,counter,queue_num}))

                Socket.emit("newUser", receiverId)
                console.log(Socket)
                //console.log(userType)
                
                setAuth({username,accessToken,counter,queue_num})
                console.log(accessToken)
      
                navigate(from) //redirect to issuinput page
      
            
        }catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response')
            } else if (err.response?.status === 400) {
                setErrMsg('Invalid Username or Password')
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized')
            } else if (err.response?.status === 501) {
                setErrMsg('No counters available')
            }else {
                setErrMsg('Login Failed')
            }
            errRef.current.focus()
        }
    }
        


     return (
                <div className="main">
                <div className="sub-main">

                
                <Container className='d-grid h-400'>

                    <Form onSubmit={handleSubmit} id='log-in-form' className='text-center w-100'>

                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}aria-live="assertive">{errMsg}</p>

                        <h1 className='mb-3 fs-3'> Customer Login</h1>
                      

                            <Form.Group role="form" id="formBasicEmail">
                        
                                <Form.Control
                                    className="position-relative"
                                    type="text"
                                    size="lg"
                                    placeholder="Username"
                                    id="username"
                                    ref={userRef}

                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                    required
                                 />
                                
                            </Form.Group>
                            <br></br>
                            <Form.Group id="formBasicPassword">
                            
                                <Form.Control
                                    className="position-relative mt-1"
                                    type="password"
                                    size="lg"
                                    placeholder="Password"
                                    id="password"
                                    
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    required
                                />
                            
                                <br></br>
                                  <Button variant="primary" size="lg" type="submit">Login</Button>
                                 
                            </Form.Group>
                           
                    </Form>
                </Container>
            </div>
            </div>
            
            )
     
}
    

    