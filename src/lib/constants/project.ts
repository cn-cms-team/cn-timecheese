import { ProjectTone } from '@/types/project';

export const projectTones = [
  'blue',
  'violet',
  'slate',
  'green',
  'red',
  'yellow',
  'orange',
] as const;

export const projectToneLabels: Record<ProjectTone, string> = {
  blue: 'น้ำเงิน',
  violet: 'ม่วง',
  slate: 'เทา',
  green: 'เขียว',
  red: 'แดง',
  yellow: 'เหลือง',
  orange: 'ส้ม',
};

export const projectToneSwatchClasses: Record<ProjectTone, string> = {
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  green: 'bg-emerald-500',
  red: 'bg-rose-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
};

export const projectToneTextClasses: Record<ProjectTone, string> = {
  blue: 'text-blue-500',
  violet: 'text-violet-500',
  slate: 'text-slate-500',
  green: 'text-emerald-500',
  red: 'text-rose-500',
  yellow: 'text-yellow-500',
  orange: 'text-orange-500',
};

export const projectToneOptions = projectTones.map((tone) => ({
  value: tone,
  label: projectToneLabels[tone],
}));
