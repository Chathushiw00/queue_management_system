import { Router } from "express"
import { GenarateQueueNum } from "../libs/GenerateQueue"
import { createissue,getissue,deleteissue } from "../controllers/issuecontroller"
import { havingissue } from "../controllers/nusercontroller"

const router = Router();

router.post('/createissue',GenarateQueueNum,createissue)  //done

router.get('/havingissue',havingissue) //done

router.post('/getissue',getissue) //done

router.delete('/deleteissue',deleteissue) //done

export default router;