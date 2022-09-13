import {
  differenceInWeeks,
  getDay,
  startOfMonth,
  isSameDay,
  addDays,
  set,
  getHours,
  getMinutes,
  isPast,
} from 'date-fns';
import { Holidays, useHolidays } from '@/store/modules/getHolidays';

export interface CyclePeriod {
  weekIndex: number;
  dayOfWeekIndex: number;
}
export const nowDateInJST = new Date(
  Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
);
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
  let currentDate = set(nowDateInJST, {
    hours: getHours(deadlineTime),
    minutes: getMinutes(deadlineTime),
    seconds: 0,
    milliseconds: 0,
  });
  while (
    !isInclude(currentDate) ||
    isHoliday(currentDate) ||
    isPast(currentDate)
  ) {
    currentDate = addDays(currentDate, 1);
  }
  return currentDate;
};
