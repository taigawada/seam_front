import {
  differenceInWeeks,
  getDay,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  eachWeekOfInterval,
  eachDayOfInterval,
  getDate,
  addMonths,
} from 'date-fns';

export interface CyclePeriod {
  weekIndex: number;
  dayOfWeekIndex: number;
}
const nowDateInJST = new Date(
  Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
);
const today: CyclePeriod = {
  weekIndex: differenceInWeeks(nowDateInJST, startOfMonth(nowDateInJST)),
  dayOfWeekIndex: getDay(nowDateInJST),
};

const cycleToDate = (cycle: CyclePeriod) => {
  const addMonth =
    cycle.weekIndex < today.weekIndex &&
    cycle.dayOfWeekIndex <= today.dayOfWeekIndex
      ? 1
      : 0;
  // 週初めの配列を取得
  const weekStartDate = eachWeekOfInterval({
    start: startOfMonth(addMonths(nowDateInJST, addMonth)),
    end: endOfMonth(addMonths(nowDateInJST, addMonth)),
  });
  // 週初め日付からその週の全ての日付の配列を取得
  const getWeeksArray = (startDate: Date) =>
    eachDayOfInterval({
      start: startDate,
      end: endOfWeek(startDate),
    });
  let weekIndex = cycle.weekIndex;
  if (
    7 * (weekIndex + 1) <
    getDate(getWeeksArray(weekStartDate[weekIndex])[cycle.dayOfWeekIndex])
  ) {
    weekIndex++;
  }
  return getWeeksArray(weekStartDate[weekIndex])[cycle.dayOfWeekIndex];
};
const compareFunction = (
  a: CyclePeriod,
  b: CyclePeriod,
  key: 'dayOfWeekIndex' | 'weekIndex'
) => {
  if (a[key] > b[key]) return 1;
  if (a[key] < b[key]) return -1;
  return 0;
};

export const useRemainingDays = (cyclePeriod: CyclePeriod[]) => {
  cyclePeriod.push(today);
  cyclePeriod
    .sort((a, b) => compareFunction(a, b, 'dayOfWeekIndex'))
    .sort((a, b) => compareFunction(a, b, 'weekIndex'));
  let resultIndex =
    cyclePeriod.findIndex(
      (el) =>
        el.weekIndex === today.weekIndex &&
        el.dayOfWeekIndex === today.dayOfWeekIndex
    ) + 1;
  if (cyclePeriod[resultIndex] === undefined) resultIndex = 0;
  return cycleToDate(cyclePeriod[resultIndex]);
};
