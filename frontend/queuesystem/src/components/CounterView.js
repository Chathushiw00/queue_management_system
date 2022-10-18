import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';
import {Badge,Button,Row,Col,Card,Container} from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import { useParams } from 'react-router-dom';
import axios,{BASE_URL} from '../api/axios';
import { Link,useNavigate } from 'react-router-dom';
import Socket from './Socket';

const Counterview=(props)=> {

    const id=(useParams().id)
    const [issue,setIssue]=useState({})
    const navigate = useNavigate();
    const [countname,setCountname]=useState('')
    const [countnum,setCountnum]=useState('')
    const [nulla,setNulla]=useState(false)

    const { auth } = useAuth();
    const { setAuth } = useAuth();
    
    const Token=auth?.accessToken
  
    const authAxios = axios.create({
        baseURL: BASE_URL,
        headers: {
          Authorization :`Bearer ${Token}`
        }
      })

  
      useEffect(() => {

        const fetchIssue = async () => {
           try {
            
            const response = await authAxios.get(`cuser/issue/${id}`);
            if(response.data==null)
            {setNulla(true)}
            else{
              setIssue(response.data)
            } 
         
            setCountname(auth?.username)
            setCountnum(auth?.counterInfo.counter_num) 
            
           } catch (error) {
                  console.log(error);         
           }
        } 
        
        fetchIssue();
  },[])


  const issuedone = async (id) => {
    try {
    const res = await authAxios.get(`cuser/issuedone/${id}`); //postman url
   console.log(res.data)

   window.location.reload()
   } 
   catch (error) {
          console.log(error);         
   }
  }

  const callnext = async (id) => {
    try {
    const res1 = await authAxios.put(`cuser/getDoneNextissue/${id}`); //postman url
   
    if(res1.data==null)
    {setNulla(true)}
    else{

      Socket.emit("sendNotification", {
        receiverId:res1.data.nuser,
        type:'Hello!!, Move on to the Counter'+res1.data.counter+' Now!',
        id:res1.data.id
      });

      setIssue(res1.data);
    } 
    
  
   } 
   catch (error) {
          console.log(error);         
   }
  }



  return (
    <div>
        <Container>
   
  <Row>
     <Col> 
     <Badge pill bg="secondary" >
       <h6>Counter:0{countnum}</h6>   
   </Badge>
   <Button id='backbtn' variant="primary" type="submit" 
    onClick={() => navigate(-1)}>
      
 Back
  </Button>
    
    
    </Col>
    <Col>
   
    <Card.Body id="profilename"  border="primary" style={{ width: '11rem' }}>
    <Badge pill bg="primary"><h6>{countname}</h6></Badge>

    </Card.Body>
   
    </Col>
  </Row>
            <Row>
            <Col md={{ span: 8, offset: 2 }}>
            <>
        {nulla ? (
            <section>
              <Card border="secondary"  style={{ width: '43rem' }}>
                <h3>No issue to display</h3>
              </Card>
            </section>
        ) : (  
          <section>
            <br></br><br></br><br></br>
   <Card border="secondary"  style={{ width: '43rem' }}>
          <Badge>
              {issue.queueNo}
          </Badge>
      <Card.Body>
        
          <Card.Title>
          <h4 id='issuename1'> {issue.name}</h4>
           0{issue.contact}
                
          </Card.Title>
          <br></br><br></br>
           <Card.Subtitle className="mb-2 text-muted">Issue</Card.Subtitle>
        <Card.Text>
          <div id="issueview">
          {issue.issue}
          </div>
       
        </Card.Text>
      
      </Card.Body>
    </Card>
    </section> )}
    </>
        </Col>
        </Row>    
        
        <Row>
            <Col>
   
    <Button id='DoneNxtbtn' variant="warning"
    onClick={() => callnext( issue.id)}
    >Done & Call Next</Button>
    
    <Link to="/counter">
    <Button id='Donebtn' variant="primary"
     onClick={() => issuedone(issue.id)}
    >Done</Button>
    </Link>
    </Col>

 </Row>    
    
    
     
    </Container>
    </div>
    
    
  )
}

export default Counterview