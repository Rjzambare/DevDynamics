
export interface types {
  data: Data;
}
export interface Data {
  AuthorWorklog: AuthorWorklog;
}
export interface AuthorWorklog {
  activityMeta?: (ActivityMetaEntity)[] | null;
  rows?: (RowsEntity)[] | null;
}
export interface ActivityMetaEntity {
  label: string;
  fillColor: string;
}
export interface RowsEntity {
  name: string;
  totalActivity?: (TotalActivityEntity)[] | null;
  dayWiseActivity?: (DayWiseActivityEntity)[] | null;
  activeDays: ActiveDays;
}
export interface TotalActivityEntity {
  name: string;
  value: string;
}
export interface DayWiseActivityEntity {
  date: string;
  items: Items;
}
export interface Items {
  children?: (ChildrenEntity)[] | null;
}
export interface ChildrenEntity {
  count: string;
  label: string;
  fillColor: string;
}
export interface ActiveDays {
  days: number;
  isBurnOut: boolean;
  insight?: (string)[] | null;
}
