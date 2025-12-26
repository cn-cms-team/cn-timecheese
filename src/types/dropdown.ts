export type IOptions = {
  label: string;
  value: string;
  [key: string]: any;
};

export type IOptionGroups = { label: string; options: IOptions[] };
