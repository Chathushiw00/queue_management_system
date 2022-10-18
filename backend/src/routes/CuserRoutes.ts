import {Router}  from "express"
import {issuesgetcounter,getsingleissue,issuecalled,issuedone,getDoneNextissue} from "../controllers/issuecontroller"
import {closecounter} from "../controllers/cusercontroller"

const router = Router();

//get issues for relevant counter
router.get('/getcounterissues',issuesgetcounter); 

//set isCalled=1 in issue,update counter queue
router.put('/issuecalled/:id',issuecalled); 

//view one issue along for issue id
router.get('/issue/:id',getsingleissue);

//set isdone=1 in issue
router.get('/issuedone/:id',issuedone); 

//set isDone=1 and iscalled=1 in previous and next issues
router.put('/getDoneNextissue/:id',getDoneNextissue); 

//set isOnline=0 in counter
router.get('/counterclose',closecounter); 

export default router;    
