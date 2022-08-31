import { Entity, Column, PrimaryGeneratedColumn, OneToMany,BaseEntity} from "typeorm"
import { Issue } from "./Issue"
import { Counter } from "./Counter"
import { Notification } from "./Notification"
import * as bcrypt from 'bcryptjs';

@Entity()
export class Nuser extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

   /*  @Column({default:false})
    havingissue!: Boolean */

    @OneToMany(() => Notification, (notification) => notification.nuser) 
    notifications: Notification[]

    @OneToMany(() => Issue, (issue) => issue.nuser) 
    issues: Issue[]

      async encryptPassword(password: string):Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password,salt);
      }
    
      async validatePassword(password:string): Promise<boolean> {
          return await bcrypt.compare(password,this.password);
      } 
}