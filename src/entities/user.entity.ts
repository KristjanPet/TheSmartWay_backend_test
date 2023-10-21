import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Note } from './note.entity';
import { Mark } from './mark.entity';

@Entity()
export class User extends Base {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @OneToMany(() => Note, (note) => note.user)
  note: Note[];

  @OneToMany(() => Mark, (mark) => mark.user)
  mark: Mark[];
}
