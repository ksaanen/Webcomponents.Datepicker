export interface datepickerDOM {
  style: HTMLStyleElement;
  wrapper: HTMLElement;
  inner: HTMLElement;
  header: HTMLElement;

  btnPrev: HTMLElement;
  btnNext: HTMLElement;
  btnToday: HTMLElement;

  monthYear: HTMLElement;
  month: HTMLElement;
  year: HTMLElement;

  body: HTMLElement;
  labels: HTMLElement;
  calendar: HTMLElement;
  footer: HTMLElement;
}

export enum Months {
  januari = 0,
  februari,
  maart,
  april,
  mei,
  juni,
  juli,
  augustus,
  september,
  oktober,
  november,
  december
}

export interface Appointment {
  date: Date | string,
  isFull: boolean
}

export interface dayObject {
  daytitle: string;
  isSelected: boolean;
  isNotInMonth: boolean;
  isToday: boolean;
  dateObj: Date;
  isSelectable: boolean;

  hasAppointment: boolean;
  isFull: boolean;
}

export interface daysObject {
  days: dayObject[];
  iteration: number;
}

export interface labels {
  daysOfWeek: string[];
  months: string[];
}

export interface datepickerElementRef extends HTMLElement {
  name: string,
  value: string;
  
  // optional attributes
  from?: string,
  till?: string
}
