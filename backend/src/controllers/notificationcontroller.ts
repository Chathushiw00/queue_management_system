import { Request,Response } from "express"
import { AppDataSource } from "../index"
import { Issue } from "../models/Issue"
import { Notification } from "../models/Notification"



export const getNotifications = async (req:Request, res:Response) => {

    try{
        
        const currentIssue = await AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .where("issue.nuser = :nuser",{nuser: req.body.userId})
        .andWhere("issue.isDone = :done",{done : 0})
        .getOne()

        //console.log(currentIssue)
        const notificationRepository = await AppDataSource.getRepository(Notification)
        .createQueryBuilder("notification")
        .where("notification.nuser = :nuser", { nuser: req.body.userId })
        .where("notification.issue = :issue", { issue: currentIssue?.id})
        .orderBy("notification.id", "DESC")
        .getManyAndCount()

        //console.log(notificationRepository)

        res.json({
            notifications: notificationRepository
        })

    }catch (error) {

        res.status(500).json({message:error.message})
    }
}