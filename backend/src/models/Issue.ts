import { Entity, Column, PrimaryGeneratedColumn,ManyToOne,BaseEntity, OneToMany } from "typeorm"
import { Counter } from "./Counter"
import { Nuser } from "./Nuser"
import { Notification } from "./Notification"

@Entity()
export class Issue extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
    })
    name: string

    @Column()
    contact: number

    @Column()
    email: string

    @Column("text")
    issue: string

    @Column()
    queueNo: number

    @Column({default:false})
    isCalled: Boolean

    @Column({default:false})
    isDone: Boolean

    @ManyToOne(() => Nuser, (nuser) => nuser.issues)
    nuser: Nuser

    @ManyToOne(() => Counter, (counter) => counter.issues)
    counter: Counter

    @OneToMany(() => Notification, (notification) => notification.issue)
    notifications : Notification[]
  
}