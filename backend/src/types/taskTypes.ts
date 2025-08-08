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
  lastCompletionDate?: Date;
  byDay?: string[]; //if weekly, string of weekdays: mo,tu,we,th,fr,sa,su. if monthly, days of month, if yearly, months
  endType: number; //if 1 or 2, end on end. if 0, never end
  end?: number; //if endType=1, number represents date of end, if 2, it is the amount of repeats remaining before end. if 0, no end
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
  create: {
    priority: number;
    difficulty: number;
    location: string;
  };
};

export type Task = {
  id: string;
  title: string;
  user_id: string;
  recurrence: boolean; //if true, find recurrence info with matching id. if false, task is non-recurring
  description: string;
  startDate: number;
  duration: number;
  recurrenceInfo: RecurrenceInfo;
  sortingInfo: SortingInfo;
};