import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';
import {Badge,Button,Row,Col,Card,Container,Modal} from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import axios,{BASE_URL} from '../api/axios';
import Issuetag from './IssueTag';
import { useNavigate} from 'react-router-dom';
import Socket from './Socket';


export default function Counter(props) {

    const { auth } = useAuth();

    const [issues,setIssues]=useState([])
    const [countname,setCountname]=useState('')
    const [countnum,setCountnum]=useState('')
    const [issueid,setIssueid]=useState('')
    const [nullvalue,setNull]=useState(false)
    const [counter,setCounter]=useState(true)
    const [page,setPage]=useState(1)
    const [lp,setLP]=useState()
    const [show,setShow]=useState(false)
    const navigate = useNavigate();

    const { setAuth } = useAuth();
    const Token=auth?.accessToken

    const authAxios = axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization : `Bearer ${Token}`
        }
    })

    const viewIssueHandler = async(id,queueNo,uid) => {
        try {
          const res = await authAxios.put(`cuser/issuecalled/${id}`); //postman url
         //console.log(uid)
         console.log(res)

         Socket.emit("sendNotification", {
          receiverId:uid,
          type:'Hello!!, Move on to the Counter '+countnum+' Now! .  Check your Notifications!',
          id:id
        });
         } 
         catch (error) {
                console.log(error);         
         }
      };


      // useEffect(()=> {

      //   if(auth){
      //       if(auth.userType!="counterUser"){
      //           navigate("/issueinput")
      //       }
      //   }
      // },[])

      useEffect(() => {

        const fetchIssues = async (page) => {
           try {
            
            const response = await authAxios.get('cuser/getcounterissues?page='+page);  //postman url
            if(!response.data.issues.length==0)
            {
              setIssues(response.data.issues)
              setLP(response.data.lastPage)  
            }
            else{
              setNull(true)
            }
           
          
        
            setCountname(auth?.username)
            setCountnum(auth?.counterInfo.id) //data from backend login cuser
           
           } catch (error) {
                  console.log(error);         
           }
        }  
         
        fetchIssues(page);
      },[])


      const fetchIssuesPage = async (page) => {
        try {
         
         const response = await authAxios.get('cuser/getcounterissues?page='+page);
         if(!response.data.issues.length==0)
         {
           setIssues(response.data.issues)
           setLP(response.data.lastPage) }
         else{
           setNull(true)
         }
        
        console.log(response)
        
        } catch (error) {
               console.log(error);         
        }
     } 
     

     Socket.off("refresh").on("refresh", (data) => {
      const refresh = data.ref
      if(refresh==1)
      {
        window.location.reload()
      }
  })

     
     const nextpage = async ()=>{

        fetchIssuesPage(page+1)
        setPage(page+1)
      }


      const prevpage = async ()=>{

        fetchIssuesPage(page-1)
        setPage(page-1)
      }


      const handleClose = () =>{
        setShow(false)
      }
    

      const closecounter = async () => {
        try {
    
          //call close counter api
        const response = await authAxios.get('cuser/counterclose'); //postman url
        if(response.data.message === "closed"){
        sessionStorage.clear();
        setAuth();


        sessionStorage.clear();
        setAuth();
        Socket.emit("refreshIssues", {
          ref:1
        });
        Socket.emit("refreshDisplay", {
          ref:1
        }); 
        navigate("/cuser")    
            } 
        }
       catch (error) {
              console.log(error); 
              setShow(true)          
       }
      }


      const renderissuelist = issues.map((issue) =>(
        <Issuetag
        issue={issue}
        key={issue.id}
        clickHander={viewIssueHandler}
        />
      )) 

      return(

        <div>
        <Container> 
  <Row>
     <Col> 
      <Badge pill bg="secondary" >
           <h6>Counter:0{countnum}</h6>   
       </Badge>
    </Col>
    <Col>
   
    <Card.Body id="profilename"  border="primary" style={{ justifyContent:'center', width: '10rem' }}>
    <Badge pill bg="primary"><h6>{countname}</h6></Badge>
    <Button id='closebtn1' variant="danger"
      onClick={() => closecounter()}
    >Close Counter</Button>
    </Card.Body>

    <Modal show={show}>
        <Modal.Header closeButton>
          <Modal.Title>Can't Close Counter</Modal.Title>
        </Modal.Header>
        <Modal.Body>No Online Counters Available !</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal> 
 
    </Col>
  </Row>
    <Row>
    <Col md={{ span: 4, offset: 2 }}>
    
    <div className='issues'>
    <>
            {nullvalue ? (
                <section>
                    <h3>No issues to display</h3>
                   
                </section>
            ) : (  
              <section>
              {renderissuelist}
               
               <>
               {page === 1 ?
               (
                <Button onClick={() => prevpage()} disabled>Prev</Button>
               ):(
                <Button onClick={() => prevpage()}>Prev</Button>
                )}
               </>
               {page}/{lp} 
               <>
               {page ===  lp?
               (
                <Button onClick={() => nextpage()} disabled>Next</Button>
               ):(
                <Button onClick={() => nextpage()}>Next</Button>
                )}
               </>
                
               
               </section> )}
    </>
         </div>  
       
      </Col>

    </Row>
     
    </Container>
    </div>
    
      )

}