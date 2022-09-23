import React,{useEffect,useState} from 'react'
import { Col, Container,Row,Badge,Card,Button} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/App.css';
import NotificTag from './NotificTag';
import axios,{BASE_URL} from '../api/axios';



export default function Notifications() {

    const { auth,setAuth } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [username,setUsername]=useState('')
    const [nullvalue,setNull]=useState(false)  //night


    const Token=auth?.accessToken

    const authAxios = axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization :`Bearer ${Token}`
      }
    })

   
    useEffect(() => {

      setUsername(auth?.username)

      const fetchNotification = async (page) => {
        try {
         
         const response = await authAxios.get('nuser/getnotifications');  //postman url

         if(!response.data[0].length==0)
         {  
          setNotifications(response.data[0]);
        }
         else{
           setNull(true)
         }
        } catch (error) {
               console.log(error);         
        }
      }


      fetchNotification();
    }, [])

    
      const rendernotifylist = notifications.map((notification) =>(
      <NotificTag
      notification={notification}
      key={notification.id}
    
      />
    )) 

    
    const logout = async () => {
        try {

          localStorage.clear();
          setAuth();
        } 
       catch (error) {
              console.log(error);         
       }
      }

  return (
    <div>
    <Container>
    <br></br>
    <Row>
      
    <Col>
    
        <Button id='backbtn' variant="primary" type="submit" 
            onClick={() => navigate(-1)}>
            Back
       </Button>
        
      
        <Card.Body id="profilename"  border="primary" style={{ width: '10rem' }}>
        <Badge pill bg="primary"><h6>{username}</h6></Badge>
        <Button id='logoutbtn' variant="danger"
          onClick={() => logout()}
        >Logout</Button>
        </Card.Body>
        
        
      </Col> </Row>
      <Row>
        
      
      </Row>
      <br></br>
                <Row>
                    <Col md={{ span: 6, offset: 2 }}>
                    <div className='issues'>
             <> 
                {nullvalue ? ( <section>
                  <Card   border="secondary" style={{width: '40rem', borderRadius:'40px', borderWidth: '3px'}}>
         
                    <h3>No Notifications to display</h3>
                   </Card>
                </section>
            ) : (  
              <section>
              {rendernotifylist}
              </section> )}
    </>
    </div>
                   
                    </Col>
                </Row>
            </Container>
            </div>

  )
}