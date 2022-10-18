import React,{useEffect,useState} from 'react'
import { Col, Container,Row,Badge,Card,Button,Modal} from 'react-bootstrap'
import { FaBell } from "react-icons/fa";
import useAuth from '../hooks/useAuth';
import { Link,useNavigate } from 'react-router-dom';
import axios ,{BASE_URL}from '../api/axios';
import Socket from './Socket';
import '../styles/App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Viewqueue(props) {

    const { auth } = useAuth();
    const { setAuth } = useAuth();
    const [current_num,setCurrent]=useState('')
    const [next_num,setNext]=useState('')
    const [counter,setCounter]=useState('')
    const [queue_num,setQueuenum]=useState('')
    const [username,setUsername]=useState('')
    const [show,setShow]=useState(false)
    const navigate = useNavigate()
 

    const Token=auth?.accessToken

    const authAxios = axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization :`Bearer ${Token}`
      }
    })
  
    const handleClose = () =>{
      setShow(false)
    }



    useEffect(() =>{
      setUsername(auth?.username)
     
      if(auth?.counter==undefined ||auth?.queue_num==undefined)
      {
       setCounter(props.counter)
       setQueuenum(props.queue_num)
      }
      else{
       setCounter(auth?.counter)
       setQueuenum(auth?.queue_num)
      }
      
     Socket.off("getNotification").on("getNotification", (data) => { 
    
      console.log(data)

      toast.info(data.type, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        })
    
  })
       
        const id=props.counter||auth?.counter
       

        if(id==1){

          Socket.on('getqueuenum1',(m)=>{
             setNext(m.counter_next_num)
             setCurrent(m.counter_current_num)
           })
           

        }
      if(id==2){

          Socket.on('getqueuenum2',(m)=>{
            setNext(m.counter_next_num)
             setCurrent(m.counter_current_num)
           })
           

        }
       if(id==3){

          Socket.on('getqueuenum3',(m)=>{
            setNext(m.counter_next_num)
             setCurrent(m.counter_current_num)
           })
          
        }
          
      },[])


      const logout = async () => {
        try {

          localStorage.clear();
          setAuth();
          navigate("/nuser")

          // localStorage.removeItem(auth?.username)
          // sessionStorage.clear()
          // setAuth();
        } 
       catch (error) {
              console.log(error);         
       }
      }
 
      const cancel = async () =>{
        try {

          const res = await authAxios.delete(`nuser/cancelissue`) //postman url
         
          if(res.data.message==="deleted")
          {
            Socket.emit("refreshIssues", {
              ref:1
            });

            window.location.reload()
          }
         
         } catch (error) {
                console.log(error)     
         }
      }

  return (
 
    <div>
    <>{queue_num === next_num ? (
      <section>
        
      <Container>

<Row>
      <Col>

            <Card.Body id="profilename"  border="primary" style={{ width: '11rem' }}>
              <Badge pill bg="primary"><h6>{username}</h6></Badge>
              <Button id='logoutbtn' variant="danger"
                onClick={() => logout()}
              >Logout</Button>
              <Link to="/notifications">
              <Button id='submitbtn' variant="primary" type="submit">  
                  <FaBell /> 
              </Button></Link>
            </Card.Body>
        </Col> 
  </Row>
          <Row>
              <Col md={{ offset: 4 }}>
              <Card id="issuequeue"  border="primary" style={{ width: '26rem', height: '22rem' }}>
  
  <Card.Title >
  <div class=" d-flex align-items-center justify-content-center">
      <Badge pill bg="info" >
      <h4>Counter 0{counter}</h4>
      </Badge>
      </div>
  </Card.Title>
<Card.Body>
          
      <div class=" d-flex align-items-center justify-content-center">
       <h1 id='currenttxt'>Next Your Turn!</h1>
       </div>  
 
</Card.Body>
   </Card>
              </Col>
          </Row>
         </Container>
      <ToastContainer          
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />

      </section>

    ):queue_num === current_num ?(

      <section>
      <Container>
<Row>
      <Col>

            <Card.Body id="profilename"  border="primary" style={{ width: '11rem' }}>
              <Badge pill bg="primary"><h6>{username}</h6></Badge>
              <Button id='logoutbtn' variant="danger"
                onClick={() => logout()}
              >Logout</Button>
              <Link to="/notifications">
              <Button id='submitbtn' variant="primary" type="submit">  
                  <FaBell /> 
              </Button></Link>
            </Card.Body>
        </Col> 
  </Row>
          <Row>
              <Col md={{ offset: 4 }}>
              <Card id="issuequeue"  border="primary" style={{ width: '26rem', height: '22rem' }}>
  
  <Card.Title >
  <div class=" d-flex align-items-center justify-content-center">
      <Badge pill bg="info" >
      <h4>Counter 0{counter}</h4>
      </Badge>
      </div>
  </Card.Title>
<Card.Body>
          
      <div class=" d-flex align-items-center justify-content-center">
       <h3 id='currentnum1'>Now under consideration</h3>
       </div>  
 
</Card.Body>
   </Card>
              </Col>
          </Row>
      </Container>

      <ToastContainer            
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />

      </section>
    ):(


    <section>
      <Container>
<Row>
<Col>

  <Card.Body id="profilename"  border="primary" style={{ width: '11rem' }}>
  <Badge pill bg="primary"><h6>{username}</h6></Badge>
  <Button id='logoutbtn' variant="danger"
    onClick={() => logout()}
  >Logout</Button>
  
  <Link to="/notifications">
  <Button id='submitbtn' variant="primary" type="submit">
    
<FaBell /> 
</Button></Link>
     
</Card.Body>
</Col> </Row>
          <Row>
              <Col md={{  offset: 4 }}>
              <Card id="issuequeue"  border="primary" style={{ width: '26rem', height: '22rem' }}>
  
  <Card.Title >
  <div class=" d-flex align-items-center justify-content-center">

      <Badge pill bg="secondary" >
      <h4>Counter 0{counter}</h4>
      </Badge>
      </div>
  </Card.Title>
<Card.Body>

      <div class=" d-flex align-items-center justify-content-center">
      <div id='currenttxt'>Current No:</div>
      </div>
      <div class=" d-flex align-items-center justify-content-center">
       <h1 id='currentnum'>0{current_num}</h1>
       </div>
       
  
</Card.Body>
<Card.Body>

    <div class=" d-flex align-items-center justify-content-center">
       <h1 id='nexttxt'>Next No:</h1>
       <h1 id='nextnum'>0{next_num}</h1>
     </div>

      <div class=" d-flex align-items-center justify-content-center">
      <div id='yourtext'>Your No:</div>
      <div id='yournum'>0{queue_num}</div>
      </div>

    

</Card.Body>
   </Card>
              </Col>
          </Row>
          <Row>
<Col>

  
  <Button id='cancelbtn' variant="danger"
    onClick={() => setShow(true)}
  >Cancel</Button>

     </Col> 
     </Row>
      </Container>
       <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cancel Issue</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to cancel the issue?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button variant="primary" onClick={cancel}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal> 

    <ToastContainer         
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />   
  
      </section>
    )}
    </>
  </div>

)
}