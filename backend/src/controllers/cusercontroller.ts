import { Request,Response } from "express"
import { AppDataSource } from "../index"
import { Cuser } from "../models/Cuser"
import { Issue } from "../models/Issue"
import { Counter } from "../models/Counter"
import jwt from "jsonwebtoken";


export const createCuser = async (req:Request,res:Response) => {

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
} 


export const closecounter =async (req:Request,res:Response) =>{
    
    try {
     
        const cuserIdentify = req.body.userId

        const skipcounter = await AppDataSource.getRepository(Counter)
        .createQueryBuilder("counter")
        .where("counter.id = :cuser", { cuser: cuserIdentify })
        .getOne()

       
        const onlineAvailable = await AppDataSource.getRepository(Counter) 
        .createQueryBuilder("counter")
        .select("COUNT(counter.id)","count")
        .where("isOnline = :online", { online: true }) 
        .getRawOne()

        console.log(onlineAvailable.count)

        if(onlineAvailable.count>1){
            const counterRepository = await AppDataSource.getRepository(Counter)     
            .createQueryBuilder("counter")
            .update(Counter)
            .set({ isOnline: false })
            .where("counter.id = :cuser", { cuser: cuserIdentify })
            .execute()
        }else{
            return  res.status(500).json({message:'No counter available'})
        }

        let countissue: number[] =[]
        
        for(let i = 1; i <= 3; i++)
        {
            const checkcounter = await AppDataSource.getRepository(Counter)
            .createQueryBuilder("counter")
            .where("id = :id",{id: i})
            .getOne()

            let conline : boolean = checkcounter!.isOnline

            if(conline) {
                
                const checkissues = await AppDataSource.getRepository(Issue) 
                .createQueryBuilder("issue")
                .select("COUNT(issue.id)","count")
                .where("issue.counter = :counter", { counter: i })
                .andWhere("issue.isDone = :isDone", { isDone: false })
                .getRawOne()

                countissue[i-1]=checkissues.count 
                
            }else{
                countissue[i-1]=Infinity
            }
        }

        let freequeue:number=0;

        let a: number = countissue[0]
        let b: number = countissue[1]
        let c: number = countissue[2] 

        if((a==Infinity && b==Infinity && c==Infinity)){
            return  res.status(500).json({message:'No counter available'})
        }
  
        if(a<=b && a<=c)
        {    
            freequeue=1

        }else if(b<=c){

            freequeue=2

        }else{
            freequeue=3
        }  
        
        const freeCounter = await Counter.findOne({where:{id: freequeue}})

        const changingIssues = await AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .where("issue.counterId = :id",{id: skipcounter?.id})
        .andWhere("issue.isDone = :done",{done: false})
        .getManyAndCount()

        console.log(changingIssues)

        for(let n=0; n< changingIssues[1]; n++){

            let issueIdentity = changingIssues[0][n].id

            const issueRepository = await AppDataSource.getRepository(Issue) 
            .createQueryBuilder("issue")
            .select("MAX(issue.queueNo)","max")
            .where("issue.counter = :counter", { counter: freequeue })
            .getRawOne()
        
            if(issueRepository.max==null){

                issueRepository.max =1

            }else{
                issueRepository.max+=1;
            } 

            const updateIssue = await AppDataSource.getRepository(Issue)
            .createQueryBuilder("issue")
            .update(Issue)
            .set({queueNo: issueRepository.max, counter: freeCounter! })
            .where("issue.id = :isId",{isId : issueIdentity}) 
            .execute()
        }

        // res.cookie('jwt','',{maxAge: 1})
        // req.body.userId = null

        return res.json({message:"closed"})
     

         } catch (error) {
     
           return  res.status(500).json({message:error.message})
         }
 }


export const getcurr_next1 = async (): Promise<Counter[]> =>{

    try{

        const issueRepository = await AppDataSource.getRepository(Counter)

        .createQueryBuilder("counter")
        .where("counter.id = :id", {id: 1})
        .getRawOne();

        return(issueRepository)

    }catch (error) {

        return[]

    }
 
}


export const getcurr_next2 = async (): Promise<Counter[]> =>{

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

export const getcurr_next3 = async (): Promise<Counter[]> =>{

    try{

        const issueRepository = await AppDataSource.getRepository(Counter)

        .createQueryBuilder("counter")
        .where("counter.id = :id", {id: 3})
        .getRawOne()

        return(issueRepository)

    }catch (error) {

        return[]

    }

    
}