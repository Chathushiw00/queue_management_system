import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';
import {Badge,Button,Row,Col,Card,Container} from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import axios,{BASE_URL} from '../api/axios';
import Issuetag from './IssueTag';
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
         console.log(uid)
         
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
     
     
     const nextpage = async ()=>{

        fetchIssuesPage(page+1)
        setPage(page+1)
      }


      const prevpage = async ()=>{

        fetchIssuesPage(page-1)
        setPage(page-1)
      }


      const closecounter = async () => {
        try {
    
          //call close counter api
        const response = await authAxios.get('cuser/counterclose'); //postman url
        if(response.data.message === "closed"){
        localStorage.clear();
        setAuth();
            } 
        }
       catch (error) {
              console.log(error);         
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