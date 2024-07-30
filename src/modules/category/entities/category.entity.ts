import { BaseEntity } from "src/common/entity/Base.entity";
import { EntityName } from "src/common/enums/entityName.enum";
import { SupplierEntity } from "src/modules/supplier/entities/supplier.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
@Entity(EntityName.Category)
export class CategoryEntity extends BaseEntity {

    @Column()
    title:string
    @Column({unique:true})
    slug:string
    @Column()
    image:string
    @Column({nullable:true})
    imageKey:string
    @Column({default:false})
    show:boolean
    @Column({nullable:true})
    parentId:number
    @ManyToOne(()=>CategoryEntity,category=>category.children,{onDelete:'CASCADE'})
    parent:CategoryEntity
    @OneToMany(()=>CategoryEntity,category=>category.parent)
    children:CategoryEntity[]
    @OneToMany(()=>SupplierEntity,supplier=>supplier.category)
    suppliers:SupplierEntity[]
    @CreateDateColumn()
    created_at:Date
    @UpdateDateColumn()
    updated_at:Date

}