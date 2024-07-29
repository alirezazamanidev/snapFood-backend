import { BaseEntity } from 'src/common/entity/Base.entity';
import { EntityName } from 'src/common/enums/entityName.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { UserAddressEntity } from './address.entity';
import { OtpEntity } from './otp.entity';

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  first_name: string;
  @Column({ nullable: true })
  last_name: string;
  @Column({ unique: true })
  phone: string;
  @Column({ nullable: true, unique: true })
  email: string;
  @Column({ unique: true,nullable:true })
  invite_code: string;
  @Column({ default: 0 })
  score: number;
  @Column({nullable:true})
  otpId: number;
  @Column({default:false})
  phone_verify:boolean
  @Column({ nullable: true })
  agentId: number;
  @CreateDateColumn({ type: 'time with time zone' })
  created_at: Date;
  @UpdateDateColumn({ type: 'time with time zone' })
  updated_at: Date;
  @OneToOne(() => OtpEntity, (otp) => otp.user)
  @JoinColumn()
  otp: OtpEntity;
  @OneToMany(() => UserAddressEntity, (address) => address.user)
  addressList: UserAddressEntity[];
}
