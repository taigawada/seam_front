export interface Assignment {
  userId: string; // ?
  createdAt: Date; // Timestamp
  updatedAt: Date; // Timestamp
  id: number; // char(10)
  title: string; // varchar(30)
  discription?: string; // text
}
