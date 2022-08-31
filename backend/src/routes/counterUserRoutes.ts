import {Router}  from "express"
import {getcounterissues,getsingleissue,issuecalled,issuedone,getnextissue,nextissuecalled} from "../controllers/issuecontroller"
import {counterclose} from "../controllers/cusercontroller"

const router = Router();

router.get('/getcounterissues',getcounterissues); //done

router.put('/issuecalled/:id',issuecalled); //done

router.get('/issue/:id',getsingleissue); //done

router.get('/issuedone/:id',issuedone); //done

router.put('/nextissuecalled/:id',nextissuecalled); //check

router.put('/getnextissue/:id',getnextissue); //check

router.put('/counterclose',counterclose); //done

export default router;    
