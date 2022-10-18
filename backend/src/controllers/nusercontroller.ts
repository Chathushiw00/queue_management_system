import { Request,Response } from "express"
import { AppDataSource } from "../index"
import { Issue } from "../models/Issue"
import { Nuser } from "../models/Nuser"
import jwt, { JsonWebTokenError } from "jsonwebtoken"


export const createNuser = async (req:Request,res:Response) => {

    try{

        const{username,password} = req.body

        const cuser = new Nuser();
        cuser.username = username
        cuser.password = password

        cuser.password=await cuser.encryptPassword(cuser.password);
        const saveduser =await cuser.save()

        //token
        const token= jwt.sign({id :saveduser.id }, process.env.TOKEN_SECRECT || 'tokentest');
        res.header('auth-token',token).json(saveduser);

    }catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getNusers = async (req:Request,res:Response) => {

    try{
        const nusers = await Nuser.find()
        res.json(nusers)
        console.log(req.body.userId);
    }catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getNuser = async (req:Request,res:Response) => {

    try{
        const {id} =req.params
        console.log(req.body.userId);
        const cuser = await Nuser.findOneBy({id: parseInt(id)})
        res.json(cuser)
    }catch (error) {

        res.status(500).json({message:error.message})
    }
} 


export const issuehave = async (req:Request,res:Response)=> {
    try{
        const {id} = req.body.userId
       
        let haveIssue
        const havingissue = await AppDataSource.getRepository(Issue)

        .createQueryBuilder("issue")
        .loadAllRelationIds()
        .where("nuserId = :nuserId", { nuserId: req.body.userId }) 
        .andWhere("isDone = 0")
        .getOne()
       // res.json(havingissue.nuser_havingissue)

       if(havingissue){
        haveIssue = 1
       }
       else{
        haveIssue = 0
       }

       res.json({havingissue: haveIssue,issue:havingissue})

    }catch (error) {
        res.status(500).json({message:error.message})
    }
}

 
