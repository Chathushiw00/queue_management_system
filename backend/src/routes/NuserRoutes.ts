import { Router } from "express"
import { Getqueue } from "../libs/Getqueue"
import { issuecreate,getissueQDetails,issuecancel } from "../controllers/issuecontroller"
import { issuehave } from "../controllers/nusercontroller"
import { getNotifications } from "../controllers/notificationcontroller"

const router = Router();

//check issue have or not
router.get('/havingissue',issuehave)

//create new issue,generate queunum,assign to available counter
router.post('/createissue',Getqueue,issuecreate)  

//display counter,currentnum,nextnum & yournumber
router.get('/getQueueDetails',getissueQDetails) 

//delete issue
router.delete('/cancelissue',issuecancel)

//send notifications to nuser
router.get('/getnotifications',getNotifications) 

export default router;