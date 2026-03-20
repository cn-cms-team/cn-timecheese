export type IHoliday = {
  id: string;
  name: string;
  description?: string | null;
  date: Date;
};

export type HolidayFormData = {
  name: string;
  description?: string;
  date: Date;
};
