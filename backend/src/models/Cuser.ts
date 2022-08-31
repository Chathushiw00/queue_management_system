import { Entity, Column, PrimaryGeneratedColumn ,OneToMany,BaseEntity} from "typeorm"
import { Counter } from "./Counter"
import { Issue } from "./Issue"
import { Notification } from "./Notification"
import * as bcrypt from 'bcryptjs';

@Entity()
export class Cuser extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @OneToMany(() => Counter, (counter) => counter.cuser) 
    counters: Counter[]


  //validating incoming password with password in the database
   async encryptPassword(password: string):Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password,salt);
  }

  async validatePassword(password:string): Promise<boolean> {
      return await bcrypt.compare(password,this.password);
  }
}