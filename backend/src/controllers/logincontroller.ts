import { Request,Response } from "express"
import { Nuser } from "../models/Nuser"
import { Cuser } from "../models/Cuser"
import jwt from "jsonwebtoken";
import { Counter } from "../models/Counter"
import { Issue } from "../models/Issue"
import { AppDataSource } from "../index"


//login Nuser
export const loginNuser = async (req:Request,res:Response) => {
    try{
        const{username,password} = req.body
        const nuser = await Nuser.findOneBy({username:username})
        if(!nuser) return res.status(400).json('username or password is wrong')

         const correctPassword: boolean =await nuser.validatePassword(password)
         if(!correctPassword) return res.status(400).json('invalid password')

        //token
        const token =jwt.sign({id :nuser.id },process.env.TOKEN_SECRECT || 'tokentest')
        //res.header('accessToken',token).json(nuser);


        const issue = await AppDataSource.getRepository(Issue)

        .createQueryBuilder("issue")
        .where("issue.nuser = :nuser", {nuser:nuser.id})
        .andWhere("issue.isDone = :isDone",{ isDone: false })
        .getRawOne()

        console.log(issue)
        if(issue){
            const counter=issue.issue_counterId
            const queue_num= issue.issue_counterId

            console.log(queue_num)
            
            return res.json({'accessToken' :token, 'counter' :issue.issue_counterId,'queue_num' :issue.issue_queueNo})

        }
        return res.json({'accessToken':token})

    }catch (error) {
        return res.status(500).json ({
            message:error.message
        })
    }
}


//login Cuser
export const loginCuser = async (req:Request,res:Response) => {

    try{
        const{username,password} = req.body
        const cuser = await Cuser.findOneBy({username:username})
        if(!cuser) return res.status(400).json('username or password is wrong')

        const correctPassword: boolean = await cuser.validatePassword(password)
        if(!correctPassword) return res.status(400).json('invalid password')

        //counter info

        const counterinfo = await AppDataSource.getRepository(Counter)

        .createQueryBuilder("counter")
        .where("counter.cuser = :cuser", { cuser: cuser.id})
        .andWhere("counter.isOnline = :online", { online: 0 })
        .getOne()

        if(!counterinfo){

            const newcounter = await AppDataSource.getRepository(Counter)

            .createQueryBuilder("counter")
            .where("counter.isOnline = :online", {online: 0 })
            .getOne()

            if(!newcounter) return res.json({'message': 'no counter available'})

            const updateCounter = await AppDataSource
            .createQueryBuilder()
            .update(Counter)
            .set({
                cuser : cuser, //user or cuser check
                isOnline : true
                })
            .where("id = :counter", {counter: newcounter.id})
            .execute()

            newcounter.isOnline= true

            const token = jwt.sign({id :cuser.id}, process.env.TOKEN_SECRECT || 'tokentest')

        return res.json({'accessToken':token,'counterinfo': newcounter})
            
        }else{
            
            const updateCounter = await AppDataSource
            .createQueryBuilder()
            .update(Counter)
            .set({
                cuser:cuser, //check user or cuser
                isOnline : true
                })
            .where("id = :counter", {counter: counterinfo.id})
            .execute()

            const token= jwt.sign({id :cuser.id }, process.env.TOKEN_SECRET|| 'tokentest')

                return res.json({'accessToken':token,'counterinfo':counterinfo})
        }
       

    }catch (error) {
        
        return res.status(500).json({
        
         })
    }
} 

