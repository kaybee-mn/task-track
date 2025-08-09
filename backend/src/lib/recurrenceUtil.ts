
import rrule from "rrule";
const { RRule, Weekday } = rrule;
type WeekdayType = InstanceType<typeof Weekday>;
import type { RecurrenceInfo } from "../types/taskTypes";


//maps to help parse recurrence object into RRule
const freqMap: Record<RecurrenceInfo["type"], number> = {
  DAILY: RRule.DAILY,
  WEEKLY: RRule.WEEKLY,
  MONTHLY: RRule.MONTHLY,
  YEARLY: RRule.YEARLY,
  HOURLY: RRule.HOURLY,
  MINUTELY: RRule.MINUTELY,
  BYMONTHDAY: RRule.MONTHLY, //BYMONTHDAY is technically a monthly freq with extra params
};

const weekdayMap: Record<string, WeekdayType> = {
  mo: RRule.MO,
  tu: RRule.TU,
  we: RRule.WE,
  th: RRule.TH,
  fr: RRule.FR,
  sa: RRule.SA,
  su: RRule.SU,
};

// given a recurrence object, this function will return a RRULE string
export function recurrenceInfoToRRule(info: RecurrenceInfo, startDate: number) {
  const options: any = {
    freq: freqMap[info.type],
    interval: info.freq,
    dtstart: new Date(startDate),
  };

  if (info.byDay?.length) {
    options.byweekday = info.byDay.map((day) => weekdayMap[day.toLowerCase()]);
  }

  if (info.bySetPos) {
    options.bysetpos = info.bySetPos;
  }

  if (info.endType === 1 && info.end) {
    options.until = new Date(Number(info.end));
  } else if (info.endType === 2 && info.end) {
    options.count = info.end;
  }

  return new RRule(options);
}


export function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function stripTimePlusOne(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
}