import { BaseEntity } from "src/common/entity/Base.entity";
import { EntityName } from "src/common/enums/entityName.enum";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity(EntityName.Supplier)
export class SupplierEntity extends BaseEntity {

    @Column()
    manager_name:string
    @Column()
    manager_family:string
    @Column()
    phone:string
    @Column()
    store_name:string
    @ManyToOne(()=>CategoryEntity,catehory=>catehory.suppliers,{onDelete:'SET NULL'})
    category:CategoryEntity
    @Column()
    city:string
    @Column()
    invite_code:string
    @Column({nullable:true})
    agentId:number
    @ManyToOne(()=>SupplierEntity,suppler=>suppler.subsets)
    agent:SupplierEntity
    @OneToMany(()=>SupplierEntity,suppler=>suppler.agent)
    subsets:SupplierEntity[]
  

}