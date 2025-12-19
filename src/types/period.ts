export enum FilterPeriod {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export type DateRangeFilter = {
  from: Date | undefined;
  to: Date | undefined;
};
