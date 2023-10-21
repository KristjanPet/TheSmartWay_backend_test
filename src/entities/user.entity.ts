import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class User extends Base {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  // @OneToMany(() => Quote, (quote) => quote.author)
  // quote: Quote[]

  // @OneToMany(() => Vote, (vote) => vote.user)
  // vote: Vote[]
}
