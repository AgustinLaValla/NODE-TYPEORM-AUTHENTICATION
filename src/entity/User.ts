import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { MinLength, IsNotEmpty, IsEmail, Matches } from 'class-validator';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

@Entity()
@Unique(['email'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @MinLength(6)
    username: string;

    @Column()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Column()
    @IsNotEmpty()
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/, {
        message: "At least one number, one lowercase and one uppercase letter, six characters that are letters, numbers or the underscore"
    })
    password: string;

    @Column({ default: 'USER' })
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    hashPassword(): void {
        const salt = genSaltSync(10);
        this.password = hashSync(this.password, salt);
    }

    chechPassword(password:string): boolean {
        return compareSync(password, this.password);
    }
}
