import {Router}  from "express"
import { loginNuser } from "../controllers/logincontroller"
import { loginCuser } from "../controllers/logincontroller"



const router = Router()

//normal user login routes
router.post('/nuser/login',loginNuser) //done 

//counter user login routes
router.post('/cuser/login',loginCuser) //done

export default router;   