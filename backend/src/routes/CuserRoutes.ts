import {Router}  from "express"
import {getcounterissues,getsingleissue,issuecalled,issuedone,getDoneNextissue} from "../controllers/issuecontroller"
import {counterclose} from "../controllers/cusercontroller"

const router = Router();

router.get('/getcounterissues',getcounterissues); //done

router.put('/issuecalled/:id',issuecalled); //done

router.get('/issue/:id',getsingleissue); //done

router.get('/issuedone/:id',issuedone); //done

router.put('/getDoneNextissue/:id',getDoneNextissue); //work-done

router.get('/counterclose',counterclose); //done

export default router;    
