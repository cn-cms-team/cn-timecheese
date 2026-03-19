export interface IDashboardAttendance {
  date: string;
  series: IDashboardAttendanceSeries[];
}
export interface IDashboardAttendanceSeries {
  name: string;
  data: number[];
}
