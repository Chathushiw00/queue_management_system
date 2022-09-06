import { Router } from "express"
import { genarateQueueNum } from "../libs/QueueGenerate"
import { createissue,getissueQDetails,cancelissue } from "../controllers/issuecontroller"
import { havingissue } from "../controllers/nusercontroller"
import { getNotifications } from "../controllers/notificationcontroller"

const router = Router();

router.get('/havingissue',havingissue) //done

router.post('/createissue',genarateQueueNum,createissue)  //done

router.get('/getQueueDetails',getissueQDetails) //done

router.delete('/cancelissue',cancelissue) //done

router.get('/getnotifications',getNotifications) //notw

export default router;