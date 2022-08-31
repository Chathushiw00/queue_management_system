/*import { Request,Response } from "express";
//import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { Counter } from "../models/Counter";
import { Issue } from "../models/Issue";

import { AppDataSource } from "../index"


export const loginUser =async (req:Request,res:Response) =>{
   
     try {
        
       const{username,password} = await req.body */

      /*  const user = await User.findOne({where:{username:username},relations:['role']});
       if(!user) return res.status(400).json('username or password is wrong')
 
       const correctPassword: boolean =await user.validatePassword(password)
       if(!correctPassword) return res.status(400).json('invalid password');
    
       const role = user.role.id 
  
        if(role == 1){
             //counter info
            const counterinfo = await AppDataSource.getRepository(Counter) 
            .createQueryBuilder("counter")
            .where("counter.user = :user", { user: user.id })
            .getMany();
            console.log(counterinfo[0].id)
            
            //token
            const token= jwt.sign({id :user.id }, process.env.TOKEN_SECRET|| 'tokentest');

            return res.json({'accessToken':token,'counterinfo':counterinfo});
        
        }else{
            
            //token
            const token= jwt.sign({id :user.id }, process.env.TOKEN_SECRECT|| 'tokentest');
       
            //issue info
            const issue = await AppDataSource.getRepository(Issue) 
     
            .createQueryBuilder("issue")
            .where("issue.user = :user", { user: user.id })
            .andWhere("issue.isDone = :isDone", { isDone: false })
            .getRawOne();

            console.log(issue)
            if(issue){
                const counter=issue.issue_counterId
                const queue_num=issue.issue_counterid
                
                console.log(queue_num)
                return res.json({'accessToken':token,'counter':issue.issue_counterId,'queue_num':issue.issue_queue_num});
            }

            return res.json({'accessToken':token}); 
   
        }   
 
    } catch (error) { 
 
        return  res.status(500).json({
            message:error.message
        })
    } 
    
 }*/