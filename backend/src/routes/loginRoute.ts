import {Router}  from "express"
import { loginNuser } from "../controllers/nusercontroller"
import { loginCuser } from "../controllers/cusercontroller"



const router = Router()

//nuser routes
router.post('/nuser/login',loginNuser) //done

//cuser routes
router.post('/cuser/login',loginCuser) //done

export default router;   