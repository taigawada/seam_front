import {
  differenceInWeeks,
  getDay,
  isSameDay,
  startOfMonth,
  addDays,
  set,
  getHours,
  getMinutes,
} from 'date-fns';
import { Holidays, useHolidays } from '@/store/modules/getHolidays';
import SimpleDate from '@/utilities/SimpleDate';

export interface CyclePeriod {
  weekIndex: number;
  dayOfWeekIndex: number;
}
const dateToToCycle = (date: Date) => ({
  weekIndex: differenceInWeeks(date, startOfMonth(date)),
  dayOfWeekIndex: getDay(date),
});
export const useRemainingDays = async (
  cyclePeriod: CyclePeriod[],
  deadlineTime: Date,
  submitOnHoliday: boolean
) => {
  let holidays: Holidays[] = [];
  if (submitOnHoliday) {
    holidays = await useHolidays();
  }
  const isHoliday = (date: Date) =>
    holidays.findIndex((holiday) => isSameDay(date, holiday[0])) !== -1;
  const isInclude = (date: Date) =>
    cyclePeriod.findIndex(
      (cycle) =>
        cycle.weekIndex === dateToToCycle(date).weekIndex &&
        cycle.dayOfWeekIndex === dateToToCycle(date).dayOfWeekIndex
    ) !== -1;
  let currentDate = set(SimpleDate.now(), {
    hours: getHours(deadlineTime),
    minutes: getMinutes(deadlineTime),
    seconds: 0,
    milliseconds: 0,
  });
  while (
    !isInclude(currentDate) ||
    isHoliday(currentDate) ||
    SimpleDate.isPast(currentDate)
  ) {
    currentDate = addDays(currentDate, 1);
  }
  return currentDate;
};
