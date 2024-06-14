import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { StatusDto } from './dto/status.dto';

@Table({ tableName: 'requests' })
export class RequestModel extends Model<RequestModel, any> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  name: string;
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  email: string;
  @Column({ type: DataType.ENUM('atWork', 'complete') })
  status: StatusDto;
}
