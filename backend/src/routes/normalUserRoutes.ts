import { Router } from "express"
import { genarateQueueNum } from "../libs/GenerateQueue"
import { createissue,getissueDetails,cancelissue } from "../controllers/issuecontroller"
import { havingissue } from "../controllers/nusercontroller"
import { getNotifications } from "../controllers/notificationcontroller"

const router = Router();

router.get('/havingissue',havingissue) //done

router.post('/createissue',genarateQueueNum,createissue)  //done

router.get('/getissue',getissueDetails) //done

router.delete('/deleteissue',cancelissue) //done

router.get('/getnotifications',getNotifications) //notw

export default router;