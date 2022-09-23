import React from "react";
import {Badge,Card} from 'react-bootstrap';

const Notifictag = (props) => {

    const { id,message } = props.notification;
    
    return (
        <Card  id="id"   border="secondary" style={{width: '40rem', borderRadius:'40px'}} key={id}>

         
               
            
            <Card.Body>
            <Badge pill bg="secondary">
                Notification
            </Badge>
            </Card.Body>
            <Card.Body>
                <h7 id='issuename'>{message}</h7>


            </Card.Body>
        </Card>
    );
};

export default Notifictag;