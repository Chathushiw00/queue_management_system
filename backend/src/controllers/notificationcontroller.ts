import { Request,Response } from "express"
import { AppDataSource } from "../index"
import { Issue } from "../models/Issue"
import { Notification } from "../models/Notification"



export class NotificationY {
    async handle(req:Request,res:Response){
       
  
         res.send('Hello!! Mister You are the next get ready');
    }
  } 



export const getNotifications = async (req:Request, res:Response) => {

    try{
        
        const currentIssue = await AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .where("issue.nuser = :nuser",{nuser: req.body.userId})
        .andWhere("issue.isCalled = :called", {called : true}) 
        .andWhere("issue.isDone = :done",{done : false})
        .getOne()

        //console.log(currentIssue)
        const notificationRepository = await AppDataSource.getRepository(Notification)
        .createQueryBuilder("notification")
        .loadAllRelationIds()
        .where("notification.nuser = :nuser", { nuser: req.body.userId })
        .where("notification.issue = :issue", { issue: currentIssue?.id})  
        .orderBy("notification.id", "DESC")
        .getManyAndCount()


        res.json(notificationRepository)

    }catch (error) {

        res.status(500).json({message:error.message})
    }
}