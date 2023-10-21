import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Note } from './note.entity';
import { Mark } from './mark.entity';

@Entity()
export class Card extends Base {
  @Column({ nullable: false })
  question: string;

  @Column({ nullable: false })
  answer: string;

  @Column({ nullable: false, default: false })
  finished: boolean;

  @ManyToOne(() => Note, (note) => note.card)
  @JoinColumn({ name: 'noteId' })
  note: Note;

  @OneToMany(() => Mark, (mark) => mark.card)
  mark: Mark[];
}
