import { Entity, Column, PrimaryGeneratedColumn ,ManyToOne,JoinColumn,BaseEntity} from "typeorm"
import { Nuser } from "./Nuser"
import { Issue } from "./Issue"

@Entity()
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    message: string


    @ManyToOne(() => Issue, (issue) => issue.notifications)
    issue: Issue

    @ManyToOne(() => Nuser, (nuser) => nuser.notifications)
    nuser: Nuser

}