import {Router}  from "express"
import {issuesgetcounter,getsingleissue,issuecalled,issuedone,getDoneNextissue} from "../controllers/issuecontroller"
import {closecounter} from "../controllers/cusercontroller"

const router = Router();

//get issues for relevant counter
router.get('/getcounterissues',issuesgetcounter); //done

//set isCalled=1 in issue,update counter queue
router.put('/issuecalled/:id',issuecalled); //done

//view one issue along for issue id
router.get('/issue/:id',getsingleissue); //done

//set isdone=1 in issue
router.get('/issuedone/:id',issuedone); //done

//set isDone=1 and iscalled=1 in previous and next issues
router.put('/getDoneNextissue/:id',getDoneNextissue); //work-done

//set isOnline=0 in counter
router.get('/counterclose',closecounter); //done

export default router;    
