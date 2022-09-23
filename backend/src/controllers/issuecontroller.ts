 import { Request,Response } from "express"
import { AppDataSource } from "../index"
import { Issue } from "../models/Issue"
import { Counter } from "../models/Counter"
import { Notification } from "../models/Notification"


export const doneandnext =async (req:Request,res:Response) =>{
    
    try {
    
        const {id}= req.params;
         //req.body.isCalled="true";
        const user = await Issue.findOneBy({id: parseInt(req.params.id)})
 
        if(!user)  return res.status(404).json({ message: "issue does not exists"});
 
        
               const issueRepository = await AppDataSource.getRepository(Issue)
                .createQueryBuilder()
                .update(Issue)
                .set({ isDone: true })
                .where("id = :id", { id: id })
                .execute();
 
                const getnext = await AppDataSource.getRepository(Issue)
                .createQueryBuilder("Issue")
                .where("id = :id", { id: id })
                .getOne();
 
                return res.json(getnext);
 
     } catch (error) {
 
       return res.status(500).json({message:error.message})
     }
} 





export const issuecreate = async (req:Request,res:Response) => {
    try{
        let{name,contact,email,issue,counter,userId,queueNo} =req.body

        const issues = new Issue()
        issues.name = name
        issues.contact = contact
        issues.email = email
        issues.issue = issue
        issues.nuser = userId
        issues.counter = counter
        issues.queueNo = queueNo

        const savedissue = await issues.save()

            res.json(savedissue)

    }catch (error) {

        res.status(500).json({messae: error.messae})
    } 
}



export const getissueQDetails =async (req:Request,res:Response) =>{

    try{

        const issueRepository = await AppDataSource.getRepository(Issue)

        .createQueryBuilder("issue")
        .loadAllRelationIds()
        .where("issue.nuser = :nuser", {nuser: req.body.userId })
        .andWhere("issue.isDone = :isDone", { isDone: false})
        .getOne()

        const counterDetails = await AppDataSource.getRepository(Counter)
        .createQueryBuilder("counter")
        .where("counter.id = :counter", {counter: issueRepository?.counter})
        .getOne()

        console.log(counterDetails)

        if(issueRepository?.queueNo == counterDetails?.next_num) //check both db
        {
            res.json({
                counter_num: counterDetails?.id,
                message: "You' re Next"
            })
        }else{

            res.json({
                counterNo: counterDetails?.id,
                current_num: counterDetails?.current_num,
                next_num: counterDetails?.next_num,
                my_num: issueRepository?.queueNo
            })
        }

       // res.json(issueRepository.length) count of issues have for that nuser
    
    }catch(error){

        res.status(500).json({message:error.message })
    }

}


export const cancelissue1 = async (req:Request,res:Response) => {

    try{

        const result = await Issue.delete({nuser: req.body.userId})

        if(result.affected ===0){
            return res.status(404).json({message: "user does not exists"})
        }

        res.cookie('jwt','',{maxAge: 1})

        req.body.userId = null

        return res.json({message:"successfully deleted and logged out "})

    }catch(error) {
        
        return res.status(500).json({
            message:error.message
        })

    }
 }

 export const issuecancel = async (req:Request,res:Response) => {

    try{

        const remNoti = await Notification.delete({nuser: req.body.userId}) //new

        const result = await Issue.delete({nuser: req.body.userId})

        if(result.affected ===0){
            return res.status(404).json({message: "user does not exists"})
        }

        return res.json({message:"deleted"})

    }catch(error) {
        
        return res.status(500).json({
            message:error.message
        })

    }
 }

export const issuesgetcounter = async (req:Request,res:Response) => {

    const page: number = parseInt(req.query.page as any) || 1
    const perPage = 5
    const skip = (page-1) * perPage

    try{
  
      const counterRepository = await AppDataSource.getRepository(Counter)

            .createQueryBuilder("counter")
            .where("counter.cuser = :cuser", { cuser: req.body.userId })
            .getRawOne()


            const issueRepository = await AppDataSource.getRepository(Issue)
            .createQueryBuilder("issue")
            .loadAllRelationIds()
            .where("issue.counter = :counter", { counter: counterRepository.counter_id})
            .andWhere("issue.isDone =:isDone", {isDone: false })
            .orderBy("issue.queueNo", "ASC")
            .limit(perPage)
            .offset(skip)
            .getManyAndCount()

            res.json({
                issues:issueRepository[0],
                page: page,
                totalIssues: issueRepository[1],
                lastPage: Math.ceil(issueRepository[1]/perPage)
            })

    }catch(error) {

        res.status(500).json({message: error.message })
    }
}


export const getsingleissue = async ( req:Request,res:Response) => {

    try{

        const {id}=req.params

        const issueRepository = await AppDataSource.getRepository(Issue)

            .createQueryBuilder("issue")
            .loadAllRelationIds()
            .where("issue.id = :id", { id: parseInt(id) })
            .getOne()

            res.json(issueRepository)

    }catch (error){

        res.status(500).json({message:error.message})
    }
}


//here we call an issue-> change isCalled 0 into 1
export const issuecalled = async (req:Request,res:Response) => {

    try{
        
        const{id} = req.params;
        
         const issue = await AppDataSource.getRepository(Issue)
         .createQueryBuilder("issue")
         .loadAllRelationIds() //ask
         .where("issue.id = :id", { id: parseInt(req.params.id ) })
         .getOne()
         
         if(!issue) return res.status(404).json({message: "issue does not exists"})

         const callnotify = new Notification()
         callnotify.message = "Hello!!, Move on to the Counter "+issue.counter+" Now!"
         callnotify.issue = issue
         callnotify.nuser = issue.nuser //check user/nuser

         const savedissue = await callnotify.save()


         const getNextIssue = await AppDataSource.getRepository(Issue)
         .createQueryBuilder("issue")
         .where("issue.queueNo > :qN", {qN: issue.queueNo}) //ask
         .andWhere("issue.isCalled = :called",{called : false})
         .andWhere("issue.isDone = :done",{done : false})
         .andWhere("issue.counterId = :counter",{counter : issue.counter})
         .getOne()

         if(!getNextIssue){

            const updateCounter = await AppDataSource.getRepository(Counter)
            .createQueryBuilder()
            .update(Counter)
            .set({current_num: issue.queueNo, next_num: 0 })
            .where("id = :cid",{cid: issue.counter})
            .execute()
         }else{

            const nextnotify = new Notification()
            nextnotify.message = "Hello!!, Move on to the Counter"+getNextIssue.counter+" Now!"
            nextnotify.issue = getNextIssue
            nextnotify.nuser = getNextIssue.nuser

            const savedissue = await callnotify.save()

            const updateCounter = await AppDataSource.getRepository(Counter)
            .createQueryBuilder()
            .update(Counter)
            .set({current_num: issue.queueNo, next_num:getNextIssue?.queueNo })
            .where("id = :cid",{cid: issue.contact})
            .execute()
         }

            const issueRepository = await AppDataSource.getRepository(Issue)
            .createQueryBuilder()
            .update(Issue)
            .set({isCalled: true })
            .where("id = :id", {id: id })
            .execute()

            return res.json({message: " successfully updated "})

    }catch(error) {

        return res.status(500).json({message:error.message})
    }
}




//here we complete/done the issue, change isDone 0 into 1
export const issuedone = async (req:Request,res:Response) => {

    try{

        const {id} = req.params
       
        const user = await Issue.findOneBy({ id: parseInt(req.params.id )})

        if(!user) return res.status(404).json({message: "issue does not exists"})

            const remNoti = await AppDataSource.getRepository(Notification)
            .createQueryBuilder()
            .delete()
            .from(Notification)
            .where("issueId = :id", {id: id}) //ckeck issueid and id
            .execute()


            const issueRepository = await AppDataSource.getRepository(Issue)
            .createQueryBuilder()
            .update(Issue)
            .set({ isDone: true })
            .where("id = :id", { id: id})
            .execute()

            //update counter next number 2022-9-21 created

            const counterRepository = await AppDataSource.getRepository(Counter)

            .createQueryBuilder("counter")
            .where("counter.cuser = :cuser", { cuser: req.body.userId }) //counter.userId or counter.cuser check
            .getOne()
    
            console.log(counterRepository)

            // const nextissue = await AppDataSource.getRepository(Issue)
            // .createQueryBuilder("issue")
            // .where("issue.queueNo = :queueNo", { queueNo: counterRepository?.next_num })
            // .andWhere("issue.counterId = :counter", { counter:counterRepository?.id })
            // .getOne()

            // console.log(nextissue)

        
            const nextnum = await AppDataSource.getRepository(Issue)
            .createQueryBuilder("issue")
            .select("MIN(issue.queueNo)","min")
            .where("issue.counterId = :counter", { counter:counterRepository?.id })
            .andWhere("issue.isCalled = :isCalled", { isCalled: false })
            .andWhere("issue.isDone = :isDone", { isDone: false }) 
            .getRawOne()
    
            let nextnumber=nextnum.min
            const current = counterRepository?.next_num //check nextNum or next_num
    
            if(nextnumber == null){
    
                nextnumber = 0
            }
    
            console.log(nextnumber)
            console.log(current)
    
    
            const counterassign = await AppDataSource.getRepository(Counter)
            
            .createQueryBuilder()
            .update(Counter)
            .set({current_num:current, next_num:nextnumber })
            .where("counter.id = :id", {id: counterRepository?.id })
            .execute()
    
            console.log(counterassign)
    
            //res.json(nextissue)





            return res.json({message: "successfully updated "})

    }catch(error) {

        return res.status(500).json({message:error.message})
    }
}






/* export const nextissuecalled = async (req:Request,res:Response) => {

    try{
        
        const counterRepository = await AppDataSource.getRepository(Counter)
        .createQueryBuilder("counter")
        .where("counter.cuser = :cuser", {cuser: req.body.userId})
        .getRawOne()
        
        console.log(counterRepository.counter_id)
        //res.json(counterRepository.counter_id)

        const nextnum = await AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .select("MIN(issue.queueNo)","min") //check queueNo or queue_num
        .where("issue.counter = :counter", {counter:counterRepository.counter_id})
        .andWhere("issue.isCalled = :isCalled", {isCalled:false })
        .andWhere("issue.isDone = :isDone", {isDone: false })
        .getRawOne()

        let nextnum1 = nextnum.min
        const current = parseInt(req.params.id)

        if(nextnum1==null){
            nextnum1=0
        }

        const counterassign = await AppDataSource.getRepository(Counter)
        .createQueryBuilder()
        .update(Counter)
        .set({ current_num:current,next_num:nextnum1 })
        .where("counter.id = :id", {id: counterRepository.counter_id })
        .execute()

        res.json(counterassign)

    }catch(error){

        res.status(500).json({message:error.message})
    }

} */
   
export const getDoneNextissue = async (req:Request,res:Response) => {

    try{

        const {id}= req.params;
        
        const issueRepository = await AppDataSource.getRepository(Issue)

        .createQueryBuilder()
        .update(Issue)
        .set({ isDone: true })
        .where("id = :id", { id: id })
        .execute()

        const remNoti = await AppDataSource.getRepository(Notification)
        .createQueryBuilder()
        .delete()
        .from(Notification)
        .where("issueId = :id", {id: id}) //ckeck issueid and id
        .execute()


        const counterRepository = await AppDataSource.getRepository(Counter)

        .createQueryBuilder("counter")
        .where("counter.cuser = :cuser", { cuser: req.body.userId }) //counter.userId or counter.cuser check
        .getOne()

        console.log(counterRepository)


        const nextCall = await AppDataSource.getRepository(Issue)
        .createQueryBuilder()
        .update(Issue)
        .set({ isCalled: true })
        .where("queueNo = :queueNo", { queueNo: counterRepository?.next_num}) //check nextNum or next_num
        .andWhere("counterId = :counter", {counter:counterRepository?.id })
        .execute()


        const nextissue = await AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .loadAllRelationIds()
        .where("issue.queueNo = :queueNo", { queueNo: counterRepository?.next_num })
        .andWhere("issue.counterId = :counter", { counter:counterRepository?.id })
        .getOne()

        console.log(nextissue)


        if(nextissue){
        const callnotify = new Notification()
        callnotify.message = "Hello!!, Move on to the Counter"+nextissue.counter+" Now!"
        callnotify.issue = nextissue
        callnotify.nuser = nextissue.nuser //check user/nuser

        const savedissue = await callnotify.save()
        }
        

        const nextnum = await AppDataSource.getRepository(Issue)
        .createQueryBuilder("issue")
        .select("MIN(issue.queueNo)","min")
        .where("issue.counterId = :counter", { counter:counterRepository?.id })
        .andWhere("issue.isCalled = :isCalled", { isCalled: false })
        .andWhere("issue.isDone = :isDone", { isDone: false }) 
        .getRawOne()

        let nextnumber=nextnum.min
        const current = counterRepository?.next_num //check nextNum or next_num

        if(nextnumber == null){

            nextnumber = 0
        }

        console.log(nextnumber)
        console.log(current)


        const counterassign = await AppDataSource.getRepository(Counter)
        
        .createQueryBuilder()
        .update(Counter)
        .set({current_num:current, next_num:nextnumber })
        .where("counter.id = :id", {id: counterRepository?.id })
        .execute()

        console.log(counterassign)

        res.json(nextissue)

    } catch (error) {
 
        res.status(500).json({message:error.message})

     }
      
}
     





