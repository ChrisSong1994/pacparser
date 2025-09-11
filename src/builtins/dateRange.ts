import { Day, Month, GMT } from "../types";
import { MONTHS, MONTHS_NUM } from "../constants";
/**
 *
 * @param {String} day is the day of month between 1 and 31 (as an integer).
 * @param {String} month is one of the month strings: JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC
 * @param {String} year is the full year number, for example 1995 (but not 95). Integer.
 * @param {String} gmt is either the string "GMT", which makes time comparison occur in GMT timezone; if left unspecified, times are taken to be in the local timezone.
 * @return {Boolean}
 */

export function dateRange(...args: Array<Day | Month | number | GMT>) {
  const lastArg = args.pop();
  const useGMTzone = lastArg === "GMT";
  const currentDate = new Date();

  if (!useGMTzone) {
    args.push(lastArg);
  }

  let result = false;
  const noOfArgs = args.length;

  //   dateRange(day) or dateRange(month) or  dateRange(year)
  if (noOfArgs === 1) {
    if (isValidYear(args[0])) {
      result = getCurrentYear(useGMTzone, currentDate) === Number(args[0]);
    } else if (isValidMonth(args[0])) {
      result = getCurrentMonth(useGMTzone, currentDate) === MONTHS_NUM[args[0]];
    } else if (isValidDay(args[0])) {
      return getCurrentDay(useGMTzone, currentDate) === Number(args[0]);
    } else {
      return false;
    }
  }

  // dateRange(day, day) or dateRange(month, month) or  dateRange(year, year)
  if (noOfArgs === 2) {
    if (isValidYear(args[0]) && isValidYear(args[1])) {
      const [start, end] = args.map(Number);
      result = currentDate.getFullYear() >= start && currentDate.getFullYear() <= end;
    } else if (isValidMonth(args[0]) && isValidMonth(args[1])) {
      result =
        currentDate.getMonth() >= MONTHS_NUM[args[0]] &&
        currentDate.getMonth() <= MONTHS_NUM[args[1]];
    } else if (isValidDay(args[0]) && isValidDay(args[1])) {
      const [start, end] = args.map(Number);
      result = currentDate.getDate() >= start && currentDate.getDate() <= end;
    } else {
      return false;
    }
  }
  // dateRange(day, month,day, month) or dateRange(month, year,month, year)
  if (noOfArgs === 4) {
    if (
      isValidDay(args[0]) &&
      isValidMonth(args[1]) &&
      isValidDay(args[2]) &&
      isValidMonth(args[3])
    ) {
      const day = getCurrentDay(useGMTzone, currentDate);
      const month = getCurrentMonth(useGMTzone, currentDate);
      result =
        day >= Number(args[0]) &&
        month >= MONTHS_NUM[args[1]] &&
        day <= Number(args[2]) &&
        month <= MONTHS_NUM[args[3]];
    } else if (
      isValidMonth(args[0]) &&
      isValidYear(args[1]) &&
      isValidMonth(args[2]) &&
      isValidYear(args[3])
    ) {
      const month = getCurrentMonth(useGMTzone, currentDate);
      const year = getCurrentYear(useGMTzone, currentDate);
      result =
        year >= Number(args[1]) &&
        month >= MONTHS_NUM[args[0]] &&
        year <= Number(args[3]) &&
        month <= MONTHS_NUM[args[2]];
    } else {
      return false;
    }
  }

  // dateRange(day, month,year,day, month,year)
  if (noOfArgs === 6) {
    if (
      isValidDay(args[0]) &&
      isValidMonth(args[1]) &&
      isValidYear(args[2]) &&
      isValidDay(args[3]) &&
      isValidMonth(args[4]) &&
      isValidYear(args[5])
    ) {
      const day = getCurrentDay(useGMTzone, currentDate);
      const month = getCurrentMonth(useGMTzone, currentDate);
      const year = getCurrentYear(useGMTzone, currentDate);

      result =
        day >= Number(args[0]) &&
        month >= MONTHS_NUM[args[1]] &&
        year >= Number(args[2]) &&
        day <= Number(args[3]) &&
        month <= MONTHS_NUM[args[4]] &&
        year <= Number(args[5]);
    } else {
      return false;
    }
  }

  return result;
}

export function isValidDay(day: any) {
  const dayNum = parseInt(day, 10);
  if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
    return false;
  } else {
    return true;
  }
}

export function isValidMonth(month: any) {
  return MONTHS.includes(month);
}

export function isValidYear(year: number | string): boolean {
  // 转换为数字
  const yearNum = typeof year === "string" ? parseInt(year, 10) : year;

  if (isNaN(yearNum) || !Number.isInteger(yearNum)) {
    return false;
  }

  // 年份范围检查：1000-9999之间的四位数年份，保证是四位数
  return yearNum >= 1000 && yearNum <= 9999;
}

export function getCurrentDay(gmt: boolean, currentDate: Date) {
  return gmt ? currentDate.getUTCDate() : currentDate.getDate();
}

export function getCurrentMonth(gmt: boolean, currentDate: Date) {
  return gmt ? currentDate.getUTCMonth() : currentDate.getMonth();
}

export function getCurrentYear(gmt: boolean, currentDate: Date) {
  return gmt ? currentDate.getUTCFullYear() : currentDate.getFullYear();
}
