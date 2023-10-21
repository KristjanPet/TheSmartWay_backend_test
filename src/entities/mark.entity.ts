import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Note } from './note.entity';
import { Card } from './card.entity';

@Entity()
export class Mark extends Base {
  @Column({ nullable: false })
  value: number;

  @Column({ nullable: false, default: true })
  active: boolean;

  @ManyToOne(() => Card, (card) => card.mark)
  @JoinColumn({ name: 'markId' })
  card: Card;

  @ManyToOne(() => User, (user) => user.mark)
  @JoinColumn({ name: 'userId' })
  user: User;
}
