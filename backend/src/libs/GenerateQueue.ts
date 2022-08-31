
import { Issue } from '../models/Issue'
import {Request,Response,NextFunction} from 'express'
import { AppDataSource } from "../index"
import { Counter } from '../models/Counter'


export const GenarateQueueNum = async ( req:Request, res:Response, next:NextFunction) => {

    try{
        const countissue:number[]=[];

        for(let i = 1; i <= 3 ; i++) {


            const checkcounter = await AppDataSource.getRepository(Counter)

            .createQueryBuilder("counter")
            .where("id = :id", { id: i })
            .getOne()

            let conline : boolean = checkcounter!.isOnline
            console.log(i)
            console.log(conline)
                

                if(conline) {
                    
                    const checkissues = await AppDataSource.getRepository(Issue)
                    .createQueryBuilder("issue")
                    .select("COUNT(issue.id)","count")
                    .where("issue.counter = :counter", { counter: i }) //counter or counterId check db
                    .andWhere("issue.isDone = :isDone", { isDone: false })
                    .getRawOne()

                    countissue[i-1]=checkissues.count
                }
                else{
                    countissue[i-1]=Infinity
                }
        }

            let freequeue: number=0;

            console.log(countissue[0])
            console.log(countissue[1])
            console.log(countissue[2])

            let a: number = countissue[0]
            let b: number = countissue[1]
            let c: number = countissue[2]
            
            //console.log(a<b)

            if((a==Infinity && b==Infinity && c==Infinity)){

                return  res.status(500).json({message:'No counter available'})
            }

                if(a<b && a<c)
                {    
                    freequeue=1

                }else if(b<c){

                    freequeue=2

                }else{

                    freequeue=3
                } 

                //console.log(freequeue)

            const issueRepository = await AppDataSource.getRepository(Issue)

            .createQueryBuilder("issue")
            .select("MAX(issue.queueNo)","max") 
            .where("issue.counter = :counter", { counter: freequeue })
            .getRawOne()

            if(issueRepository.max==null)
            {
                issueRepository.max =1
            }
            else{
                issueRepository.max+=1;
            }

            //res.json(issueRepository.max)
            req.body.queueNo=issueRepository.max  
            req.body.counter= freequeue

            return next()

    }catch ( error) {
      return  res.status(500).json({message:error.message})
    } 
} 

















