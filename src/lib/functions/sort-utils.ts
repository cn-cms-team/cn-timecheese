import { SortingState, Row } from '@tanstack/react-table';

export const createNullsLastSortFn = <TData>(sorting: SortingState) => {
  return (rowA: Row<TData>, rowB: Row<TData>, columnId: string) => {
    const a = rowA.getValue(columnId);
    const b = rowB.getValue(columnId);

    const aIsNull = a === null || a === undefined;
    const bIsNull = b === null || b === undefined;

    const sortEntry = sorting.find((s) => s.id === columnId);
    const desc = sortEntry?.desc ?? false;

    if (aIsNull && bIsNull) return 0;
    if (aIsNull) return desc ? -1 : 1;
    if (bIsNull) return desc ? 1 : -1;

    const timeA = new Date(a as string | number | Date).getTime();
    const timeB = new Date(b as string | number | Date).getTime();

    if (timeA === timeB) return 0;

    return timeA - timeB;
  };
};

export const createCustomSortFn = <TData>() => {
  return (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number => {
    const a = rowA.getValue(columnId);
    const b = rowB.getValue(columnId);

    const normalizeValue = (val: unknown): string => {
      if (val == null || val === '') return '';
      return String(val).trim();
    };

    const aValue = normalizeValue(a);
    const bValue = normalizeValue(b);

    if (aValue === '' && bValue === '') return 0;
    if (aValue === '') return 1;
    if (bValue === '') return -1;

    if (columnId === 'phone') {
      return sortPhone(aValue, bValue);
    }
    return sortGeneral(aValue, bValue);
  };
};

const sortPhone = (a: string, b: string): number => {
  const getFirstDigit = (phone: string): number => {
    const firstDigit = phone.match(/\d/);
    return firstDigit ? parseInt(firstDigit[0]) : 999;
  };

  const aFirstDigit = getFirstDigit(a);
  const bFirstDigit = getFirstDigit(b);

  if (aFirstDigit !== bFirstDigit) {
    return aFirstDigit - bFirstDigit;
  }

  const getPhoneKey = (phone: string): string => {
    const digits = phone.match(/\d/g)?.join('') || '';
    const letters =
      phone
        .match(/[A-Za-z]/g)
        ?.join('')
        .toLowerCase() || '';
    const others = phone.replace(/[\dA-Za-z]/g, '');

    return `${digits}|${letters}|${others}`;
  };

  const keyA = getPhoneKey(a);
  const keyB = getPhoneKey(b);

  return keyA.localeCompare(keyB, 'en', { numeric: true });
};

const sortGeneral = (a: string, b: string): number => {
  const getPriority = (value: string): number => {
    const firstChar = value.charAt(0);

    if (/^-?\d+(\.\d+)?$/.test(value)) return 1;
    if (/^\d/.test(firstChar)) return 2;
    if (/[A-Za-z]/.test(firstChar)) return 3;
    if (/^[\u0E00-\u0E7F]/.test(firstChar)) return 4;

    return 5;
  };

  const aPriority = getPriority(a);
  const bPriority = getPriority(b);

  if (aPriority !== bPriority) {
    return aPriority - bPriority;
  }

  switch (aPriority) {
    case 1:
      return Number(a) - Number(b);

    case 2:
      return a.localeCompare(b, 'en', {
        numeric: true,
        caseFirst: 'upper',
      });

    case 3:
      return sortEn(a, b);

    case 4:
      return sortThai(a, b);

    default:
      return a.localeCompare(b);
  }
};

const sortThai = (a: string, b: string): number => {
  return a < b ? -1 : a > b ? 1 : 0;
};

const sortEn = (a: string, b: string): number => {
  const len = Math.min(a.length, b.length);

  for (let i = 0; i < len; i++) {
    const aChar = a.charAt(i);
    const bChar = b.charAt(i);

    const aUpper = aChar.toUpperCase();
    const bUpper = bChar.toUpperCase();

    if (aUpper !== bUpper) {
      return aUpper < bUpper ? -1 : 1;
    }
    if (aChar !== bChar) {
      if (aChar === aUpper && bChar !== bUpper) return -1;
      if (aChar !== aUpper && bChar === bUpper) return 1;
    }
  }

  return a.length - b.length;
};

export const createBooleanSortFn = <TData>() => {
  return (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number => {
    const a = rowA.getValue<boolean>(columnId);
    const b = rowB.getValue<boolean>(columnId);

    const aVal = a === true ? 0 : 1;
    const bVal = b === true ? 0 : 1;

    return aVal - bVal;
  };
};

export const createEnumSortFn = <TData, TEnum extends string>(
  priorityMap: Record<TEnum, number>
) => {
  return (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number => {
    const a = rowA.getValue<TEnum>(columnId);
    const b = rowB.getValue<TEnum>(columnId);

    const aPriority = priorityMap[a] ?? Number.MAX_SAFE_INTEGER;
    const bPriority = priorityMap[b] ?? Number.MAX_SAFE_INTEGER;

    return aPriority - bPriority;
  };
};

export type SortType = 'text' | 'boolean' | 'date' | 'enum';

export const getSortFnByType = (type: SortType): string => {
  switch (type) {
    case 'text':
      return 'customSort';
    case 'boolean':
      return 'booleanSort';
    case 'date':
      return 'dateSort';
    case 'enum':
      return 'enumSort';
    default:
      return 'customSort';
  }
};
