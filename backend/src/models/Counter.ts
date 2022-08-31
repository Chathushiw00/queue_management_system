import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne,  BaseEntity, JoinColumn } from "typeorm"
import { Cuser } from "./Cuser"
import { Issue } from "./Issue"


@Entity()
export class Counter extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    counter_num: number

    @Column({default:true})
    isOnline: boolean

    @Column()
    current_num: number

    @Column()
    next_num: number

    @ManyToOne(() => Cuser,(cuser) => cuser.counters)
    cuser: Cuser

    @OneToMany(() => Issue, (issue) => issue.counter)
    issues: Issue[]
}