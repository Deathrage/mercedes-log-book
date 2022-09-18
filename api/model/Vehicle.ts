import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export default class Car {
  @ObjectIdColumn()
  id: ObjectID;
  @Column()
  vin: string;
  @Column()
  license: string;
  @Column()
  model: string;
}
