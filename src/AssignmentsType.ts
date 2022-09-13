export interface CyclePeriod {
  weekIndex: number;
  dayOfWeekIndex: number;
}

export interface Assignment {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  id: number;
  status: 'draft' | 'active' | 'archived';
  releaseDate: Date | null;
  assignedClasses: string[];
  title: string;
  description: string;
  deadline: Date;
  submitMethod: string;
  otherSubmitMethod?: string;
  isRepeat: boolean;
  submitOnHoliday: boolean;
  cyclePeriod: Array<CyclePeriod> | [];
}
