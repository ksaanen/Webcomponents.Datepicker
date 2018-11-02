export interface datepickerDOM {
  style: HTMLStyleElement;
  input: HTMLInputElement;
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

export interface dayObject {
  daytitle: string;
  isSelected: boolean;
  isNotInMonth: boolean;
  isToday: boolean;
  dateObj: Date;
  isSelectable: boolean;
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
  
  // optional attributes
  from?: string,
  till?: string
}
