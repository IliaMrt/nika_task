import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  @ApiProperty({ example: 1, description: 'Unique identify' })
  id: number;
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  @ApiProperty({ example: 'user@example.org', description: 'Unique email' })
  email: string;
  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ example: "jk!!'21kED!1#dK", description: 'Password' })
  password: string;
}
