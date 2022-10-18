
import { Issue } from '../models/Issue'
import {Request,Response,NextFunction} from 'express'
import { AppDataSource } from "../index"
import { Counter } from '../models/Counter'




  //#id  //QueueId CountID
 //1        // 1    1
 //2       // 1     2
 //2        // 1     3
 //2       // 2      1
 //2       // 2      2
 //2       // 2      3
 //2       // 3      1
 //2       // 3      2
 //2       // 3      3

 

 // counter_id 1 | 
  // counter_id 2 | 
   // counter_id 3 | 


//new issue no = 2+1


/*const {Countersum}  = await AppDataSource.getRepository(Countern)
.createQueryBuilder("countern")
.select("counter_id","Countersum")
.orderBy("id","DESC")
.limit(1)

// .where("issue.id = :id", { id: 1 })
.getRawOne();

console.log("****Count_Id",Countersum);


 const Countersumm = parseInt(Countersum);

// const adddone = 1;*/



// const counter_nub = Countersumm + adddone;
// const counter_nubb =counter_nub.toString();
// console.log("****Count**ID",counter_nubb);
// const counter_nubbb = parseInt(counter_nubb);



export const Getqueue = async ( req:Request, res:Response, next:NextFunction) => {

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
                    .where("issue.counter = :counter", { counter: i }) 
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

                if(a<=b && a<=c)
                {    
                    freequeue=1

                }else if(b<=c){

                    freequeue=2

                }else{

                    freequeue=3
                } 

              

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

           
            req.body.queueNo=issueRepository.max  
            req.body.counter= freequeue

            return next()

    }catch ( error) {
      return  res.status(500).json({message:error.message})
    } 
} 

















