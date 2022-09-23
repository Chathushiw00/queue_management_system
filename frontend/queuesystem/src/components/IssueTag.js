import React from "react";
import {Badge,Button,Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';




const Issuetag = (props) => {

    const { id, queueNo, name,contact,nuser,isCalled } = props.issue;   //check user = nuser or cuser
    return (
     <Card id="id" border="secondary" style={{ width: '40rem', height: '9rem' }}
     key={id}>
   
        <Badge>
        {queueNo}
        </Badge>
    
  <Card.Body>
     <h4 id='issuename1'>{name}</h4>
     <h6>0{contact}</h6>



      <Link
          to={{ pathname: `/CounterCall/${id}`, //check where it is available
            }}
        >
        <>
        {isCalled === true ?(
      <section>   
      <Button id='viewbtn'  variant="outline-primary"
      onClick={() => props.clickHander(id,queueNo,nuser)}
      >Recall</Button>

      <Button id='viewbtn'  variant="outline-success">View</Button>
      
      </section>
      )
   :(
      <Button id='viewbtn'  variant="outline-primary"
      onClick={() => props.clickHander(id,queueNo,nuser)}
      >Call</Button>
   )
   }
      </>

      </Link>

  </Card.Body>
     </Card>
    );
  };
  
  export default Issuetag;
  
  







 /*import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custom.css';
import {Badge,Button,Row,Col,Card,Container} from 'react-bootstrap';
//import useAuth from '../hooks/useAuth';
import { useLocation,useParams } from 'react-router-dom';
import axios,{BASE_URL} from '../api/axios';
import { Link } from 'react-router-dom';


 const IssueView=(props)=> {

  console.log(useParams().id)
  const id=(useParams().id)
  const [issue,setIssue]=useState({})
  const [countname,setCountname]=useState('')
  const [countnum,setCountnum]=useState('')
  const [nulla,setNulla]=useState(false)

  const { auth } = useAuth();
  const { setAuth } = useAuth();
  
  const Token=auth?.accessToken
   console.log(auth?.user)

  const authAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization :`Bearer ${Token}`
    }
  })

  useEffect(() => {

    const fetchIssue = async () => {
       try {
        
        const response = await authAxios.get(`api/cuser/issue/${id}`);
        if(response.data==null)
        {setNulla(true)}
        else{
          setIssue(response.data);
          console.log(response.data)
        } 
        console.log(response.data) 
        
       
        
        setCountname(auth?.user)
        setCountnum(auth?.counterInfo[0].id)
         console.log(auth?.counterInfo[0].counter_num)
       } catch (error) {
              console.log(error);         
       }
    }  
    


    
    fetchIssue();
  },[])
  
      
  const issuedone = async (id) => {
    try {
    const res = await authAxios.put(`api/cuser/issuedone/${id}`);
   console.log(res.data)
  
   } 
   catch (error) {
          console.log(error);         
   }
  }
   
  const callnext = async (id) => {
    try {
    const res1 = await authAxios.put(`api/cuser/getnextissue/${id}`);
   
    if(res1.data==null)
    {setNulla(true)}
    else{
      setIssue(res1.data);
    } 
    
  
   } 
   catch (error) {
          console.log(error);         
   }
  }
  const logout = async () => {
    try {
      setAuth();
    } 
   catch (error) {
          console.log(error);         
   } 
  }


    return (
    <div className="mainqueue">

    <div className="sub-mainqueue">

            <Container>
            <Row>
          <Col md={{ offset:10 }}>
            
          <Card.Body id="profilename" border="primary" style={{ width: '7rem'}}>
             
            <Badge pill bg="primary"><h6>CUserName</h6></Badge>
             <Button id='logoutbtn' variant="danger" size="sm">Logout</Button>
            
           </Card.Body>
           
          </Col>
    </Row>
      
      <Row>
         <Col md={{ offset:13 }}> 
         <Badge pill bg="secondary" >
           <h6>Counter:00</h6>   
       </Badge>
        </Col>
        
      </Row>
                <Row>
                <Col md={{ span: 12, offset: 13 }}>
                <>
            
                <section>
                    <h3>No issues to display</h3>
                   
                </section>
         
              <section>
       <Card style={{ width: '50rem', borderRadius: '1em' , boxShadow: '0 0.188em 1.550em rgb(156, 156, 156)' }}>
            <Card.Body>
                <Card.Title>
                <Badge pill bg="primary">
                    <h6>queueNum</h6>
                </Badge>
                <Badge pill bg="primary">
                    <h6>userName</h6>
                </Badge>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Issue</Card.Subtitle>
                <Card.Text>
                <h6>issue display</h6>
                </Card.Text>
            
            </Card.Body>
        </Card>
        </section> 
        </>
            </Col>
            </Row>    
            
            <Row>
                <Col md={{ offset:5 }}>
       
                    <Button id='DoneNxtbtn' variant="warning">Done & Call Next</Button>
                    <Button id='Donebtn' variant="primary">Done</Button>
            
                </Col>
    
            </Row>    
    
        </Container>
        </div>
        </div>
      )
}
export default IssueView*/