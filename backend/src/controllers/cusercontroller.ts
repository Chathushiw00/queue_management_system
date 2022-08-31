import { Request,Response } from "express"
import { AppDataSource } from "../index"
import { Cuser } from "../models/Cuser"
import jwt, { JsonWebTokenError } from "jsonwebtoken"
import { Counter } from "../models/Counter"



/* export const createCuser = async (req:Request,res:Response) => {

    try{
        const{username,password} =req.body

        const cuser = new Cuser();
        cuser.username = username
        cuser.password = password

        cuser.password=await cuser.encryptPassword(cuser.password);
        const saveduser=await cuser.save()

        //token
        const token = jwt.sign({id :saveduser.id}, process.env.TOKEN_SECRECT || 'tokentest');
        res.header('auth-token',token).json(saveduser);
   
    }catch (error) {
        //res.status(500).json ({message:error.message})
    }
}

export const getCusers = async (req:Request, res:Response) => {
    try{
        const cusers = await Cuser.find()
        res.json(cusers)
        console.log(req.body.userId);
    }catch (error) {

        //res.status(500).json({message:error.message})
    }
}

export const getCuser = async (req:Request,res:Response) => {

    try{
        const {id} = req.params
        console.log(req.body.userId);
        const cuser = await Cuser.findOneBy({id: parseInt(id)})
        res.json(cuser)

    }catch (error) {
        //res.status(500).json ({message: error.message})
    }
}

export const updateCusers = async (req: Request,res:Response) => {
    try{
        const {id} = req.params;
        const user = await Cuser.findOneBy({id:parseInt(req.params.id)})

        if(!user) return res.status(404).json({message: "user does not exists"});

        await Cuser.update({id: parseInt(id)},req.body)
        return res.json({message:"successfully updated"});

    }catch (error) {
        return res.status(500).json({
            //message:error.message
        })
    }
}

export const deleteCusers = async (req:Request,res:Response) => {

    try{
        const {id} = req.params;
        const result = await Cuser.delete({id: parseInt(id)})

        if(result.affected === 0) {
            return res.status(404).json({message: "user does not exists"});
        }

        return res.json({message:"successfully deleted"});
    
    }catch(error){
        return res.status(500).json({
            //message:error.message
        })
    }
} */



export const counterclose =async (req:Request,res:Response) =>{
    
    try {
     
       
       const counterRepository = await AppDataSource.getRepository(Counter) 
         
              .createQueryBuilder("counter")
              .update(Counter)
              .set({ isOnline: false })
              .where("cuser = :cuser", { cuser: req.body.userId })
              .execute()

               
              res.json({message:"Counter closed"})
     
    
         } catch (error) {
     
            res.status(500).json({message:error.message})
         }
     
 }


export const getcurrentnext2 = async (): Promise<Counter[]> =>{

    try{

        const issueRepository = await AppDataSource.getRepository(Counter)

        .createQueryBuilder("counter")
        .where("counter.id = :id", {id: 2})
        .getRawOne();

        return(issueRepository)

    }catch (error) {

        return[]

    }
 
}


export const getcurrentnext3 = async (): Promise<Counter[]> =>{

    try{

        const issueRepository = await AppDataSource.getRepository(Counter)

        .createQueryBuilder("counter")
        .where("counter.id = :id", {id: 3})
        .getRawOne();

        return(issueRepository)

    }catch (error) {

        return[]

    }
  
}

export const getcurrentnext4 = async (): Promise<Counter[]> =>{

    try{

        const issueRepository = await AppDataSource.getRepository(Counter)

        .createQueryBuilder("counter")
        .where("counter.id = :id", {id: 4})
        .getRawOne()

        return(issueRepository)

    }catch (error) {

        return[]

    }

    
}