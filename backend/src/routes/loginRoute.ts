import {Router}  from "express"
import { loginNuser } from "../controllers/logincontroller"
import { loginCuser } from "../controllers/logincontroller"



const router = Router()

//nuser routes
router.post('/nuser/login',loginNuser) //done

//cuser routes
router.post('/cuser/login',loginCuser) //done

export default router;   