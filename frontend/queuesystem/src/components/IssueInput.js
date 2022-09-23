import React, { useEffect, useState } from 'react'
import '../styles/App1.css';
import {Form,Badge,Button,Row,Col,Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; //check
import useAuth from "../hooks/useAuth";
import axios ,{BASE_URL}from '../api/axios';
import ViewQueue from './ViewQueue';
import { useNavigate} from 'react-router-dom';


export default function IssueInput() {
 
  const { auth,setAuth } = useAuth();
  const [username,setUsername]=useState('')
  const [name,setName]=useState('')
  const [contact,setContact]=useState('')
  const [email,setEmail]=useState('')
  const [issue,setIssue]=useState('')
  const [sendissue,SetSendissue]=useState(false)
  const [counter,setCounter]=useState('')
  const [queuenum,setQueuenum]=useState('') //check queunum == queueNo
  const navigate = useNavigate();


  const Token=auth?.accessToken

  const authAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization :`Bearer ${Token}`
    }
  })


  useEffect(() => {

    const fetchuser = async () => {
       try {
        const res = await authAxios.get(`nuser/havingissue`) //havingissue==postman url


        if(res.data.havingissue==0) //nusercontroller-havingissue-see
        {
          SetSendissue(false)
        }
        else{
          SetSendissue(true)
        }
        
       setUsername(auth?.username)
       
       } catch (error) {
              console.log(error)     
       }
    } 

    fetchuser();
  },[])
 

  const logout = async () => {
    try {

      localStorage.clear();
      setAuth();
    } 
   catch (error) {
          console.log(error);         
   }
  }

  useEffect(()=>{

    const data =JSON.parse(localStorage.getItem('user'))
         
    setAuth(data)
  },[])
   

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      console.log(name,contact,issue,email)

      const res = await authAxios.post('nuser/createissue',
          JSON.stringify({ name:name,contact:contact,email:email,issue:issue }),
          {
            headers: { 'Content-Type': 'application/json' }
          
        }
          
          );

          setEmail('')
          setIssue('')
          setName('')
          setContact('')
         
          setCounter(res.data.counter)
          setQueuenum(res.data.queueNo)
          //navigate("/queuedisplay")
          SetSendissue(true)

  } catch (error) {
    console.log(error);
  }

  }


  return (
    <div className="issueinput">
    <div>
        <>{sendissue ? (
               <ViewQueue counter={counter} queue_num={queuenum}/>
            ) : (
                <section>

    <Row>
        <Col>
            <Card.Body id="profilename"  border="primary" style={{ width: '11rem' }}>
            <Badge pill bg="primary"><h6>{username}</h6></Badge>
            <Button id='logoutbtn' variant="danger"
                onClick={() => logout()}
              >Logout</Button>
            </Card.Body>
        </Col>
    </Row>
         <Row>
         <Col md={{ span: 8, offset: 2 }}>
         <form onSubmit={handleSubmit}>
           
        
        <h3> Add your issue details</h3>
             
  <Form.Group role="form" className="mb-3" controlId="formName">
    <Form.Control type="text" size="lg" placeholder="Enter Name"
    onChange={(e) => setName(e.target.value)}
    value={name}
    required />
    
 
<br></br>
  <Form.Group className="mb-3" controlId="formContact">
    <Form.Control type="text" size="lg" placeholder="Enter Contact"
    onChange={(e) => setContact(e.target.value)}
    value={contact}
    required   />
    
  </Form.Group>

  <Form.Group className="mb-3" controlId="formEmail">
    <Form.Control type="email" size="lg" placeholder="Enter Email"
     onChange={(e) => setEmail(e.target.value)}
     value={email}
     required />
   
  </Form.Group>

  <Form.Group className="mb-3" controlId="formIssue">
    <Form.Control as="textarea" size="lg" rows="5"  placeholder="Enter Issue"
     onChange={(e) => setIssue(e.target.value)}
     value={issue}
     required />
    
  </Form.Group>
  <Button id='submitbtn' variant="primary" type="submit"  size="sm">Submit</Button>

  </Form.Group>
        </form>
             </Col>
         </Row>
        
       
       </section>
       )}
       </>
        </div>
        </div>
   
  )
}