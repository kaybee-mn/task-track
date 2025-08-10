export type CreateTaskBody = {
  id: string;
  title: string;
  userId: string;
  recurrence: boolean; //if true, find recurrence info with matching id. if false, task is non-recurring
  description: string;
  startDate: Date;
  duration: number;
  recurrenceInfo: RecurrenceInfo;
  sortingInfo: SortingInfo;
};

export type RecurrenceInfo = {
  type: RecurrenceInfoType;
  freq: number; //example: how many days
  fromLastCompletion: boolean; //if true, next date is calculated from last day of completion. otherwise, from last due day
  lastCompletionDate: Date;//if fromLastCompletion is true, holds date of last completion, if false, hold last due date
  byDay?: string[]|null; //if weekly, string of weekdays: mo,tu,we,th,fr,sa,su. if monthly, days of month, if yearly, months
  endType: number; //if 1 or 2, end on end. if 0, never end
  end?: number|null; //if endType= 2, it is the amount of repeats remaining before end
  endDate?:Date|null;//endDate, if endType = 2
  bySetPos?: number|null; // e.g., 1 = first, 3 = third, -1 = last
};
export type RecurrenceInfoType =
  | "DAILY"
  | "MONTHLY"
  | "WEEKLY"
  | "HOURLY"
  | "MINUTELY"
  | "YEARLY"
  | "BYMONTHDAY";

export type SortingInfo = {
    priority: number;
    difficulty: number;
    location: string;

};

export type Task = {
  id: string;
  title: string;
  userId: string;
  recurrence: boolean; //if true, find recurrence info with matching id. if false, task is non-recurring
  description: string;
  startDate: Date;
  duration: number;
  recurrenceInfo?: RecurrenceInfo|null;
  sortingInfo: SortingInfo|null;
};