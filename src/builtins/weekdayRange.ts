import { Weekday, GMT } from "../types";
import { isGMT } from "../helper";

/**
 * 基于时间的判断函数
 * wd1 和 wd2: "SUN"|"MON"|"TUE"|"WED"|"THU"|"FRI"|"SAT"
 */

const weekdays: Weekday[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
export function weekdayRange(wd1: Weekday, wd2?: Weekday | GMT, gmt?: GMT): boolean {
  let useGMTzone = false;
  let wd1Index = -1;
  let wd2Index = -1;
  let wd2IsGmt = false;

  if (isGMT(gmt)) {
    useGMTzone = true;
  } else if (isGMT(wd2)) {
    useGMTzone = true;
    wd2IsGmt = true;
  }

  wd1Index = weekdays.indexOf(wd1);

  if (!wd2IsGmt && isWeekday(wd2)) {
    wd2Index = weekdays.indexOf(wd2);
  }

  const todaysDay = getTodaysDay(useGMTzone);
  let result: boolean;

  if (wd2Index < 0) {
    result = todaysDay === wd1Index;
  } else if (wd1Index <= wd2Index) {
    result = valueInRange(wd1Index, todaysDay, wd2Index);
  } else {
    result = valueInRange(wd1Index, todaysDay, 6) || valueInRange(0, todaysDay, wd2Index);
  }

  return result;
}

function getTodaysDay(gmt: boolean): number {
  return gmt ? new Date().getUTCDay() : new Date().getDay();
}

// start <= value <= finish
function valueInRange(start: number, value: number, finish: number): boolean {
  return start <= value && value <= finish;
}

function isWeekday(v?: string): v is Weekday {
  if (!v) return false;
  return (weekdays as string[]).includes(v);
}
