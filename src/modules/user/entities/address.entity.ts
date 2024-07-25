import { BaseEntity } from "src/common/entity/Base.entity";
import { EntityName } from "src/common/enums/entityName.enum";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntityName.UserAddress)
export class UserAddressEntity extends BaseEntity{

    @Column()
    title:string
    @Column()
    provinve:string
    @Column()
    city:string
    @Column()
    address:string
    @Column({nullable:true})
    postal_code:string
    @Column()
    userId:number
    @CreateDateColumn({type:'time with time zone'})
    created_at:Date
    @ManyToOne(()=>UserEntity,user=>user.addressList,{onDelete:'CASCADE'})
    user:UserEntity

}