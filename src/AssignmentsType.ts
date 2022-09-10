export interface CyclePeriod {
  weekIndex: number;
  dayOfWeekIndex: number;
}

export interface Assignment {
  userId: string; // ?
  createdAt: Date; // timestamp
  updatedAt: Date; // timestamp
  id: number; // serial
  title: string; // varchar(30)
  discription?: string; // text (HTMLDivElement)
  deadline: Date; // timestamp
  isRepeat: boolean; // boolean
  cyclePeriod?: Array<CyclePeriod>;
}
