import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Card } from './card.entity';

@Entity()
export class Note extends Base {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  teacher: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.note)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Card, (card) => card.note)
  card: Card[];
}
