import React from "react";
import {Badge,Button,Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';




const Issuetag = (props) => {

    const { id, queueNo, name,contact,nuser,isCalled } = props.issue;   
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
          to={{ pathname: `/CounterCall/${id}`, 
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
  
  







 