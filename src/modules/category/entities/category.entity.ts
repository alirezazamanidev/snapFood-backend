import { BaseEntity } from "src/common/entity/Base.entity";
import { EntityName } from "src/common/enums/entityName.enum";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
@Entity(EntityName.Category)
export class CategoryEntity extends BaseEntity {

    @Column()
    title:string
    @Column({unique:true})
    slug:string
    @Column()
    image:string
    @Column()
    show:boolean
    @Column({nullable:true})
    parentId:number
    @ManyToOne(()=>CategoryEntity,category=>category.children,{onDelete:'CASCADE'})
    parent:CategoryEntity
    @OneToMany(()=>CategoryEntity,category=>category.parent)
    children:CategoryEntity[]

}