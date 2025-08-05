export type Task = {
  id: string;
  title: string;
  user_id: string;
  recurrence: boolean; //if true, find recurrence info with matching id. if false, task is non-recurring
  description: string;
  duration: number;
  recurrenceInfo: RecurrenceInfo;
  sortingInfo: SortingInfo;
};

export type RecurrenceInfo = {
  task_id: string;
  startDate: number;
  type: RecurrenceInfoType;
  freq: number; //example: how many days
  fromLastCompletion: boolean; //if true, next date is calculated from last day of completion. otherwise, from last due day
  byDay?: string[]; //if weekly, string of weekdays: mo,tu,we,th,fr,sa,su. if monthly, days of month
  endOnDate: boolean; //if true, end on end. if false, end after end repetitions
  end?: number; //if endOnDate true, number represents date of end, if false, it is the amount of repeats remaining before end. if null or 0, no end
  bySetPos?: number; // e.g., 1 = first, 3 = third, -1 = last
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
  task_id: string;
  priority: number;
  difficulty: number;
  location: string;
};
