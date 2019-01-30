// ENUMS

export enum Months {
  januari = 1,
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

export enum Dag {
  Maandag = 1,
  Dinsdag,
  Woensdag,
  Donderdag,
  Vrijdag,
  Zaterdag,
  Zondag
}

export enum Maand {
  Januari = Months.januari,
  Februari,
  Maart,
  April,
  Mei,
  Juni,
  Juli,
  Augustus,
  September,
  Oktober,
  November,
  December
}

// TYPES

export type propsObject = {
  ref: string,
  from: string,
  till: string,
  beschikbaarheid: Beschikbaarheid[]
}

export type Beschikbaarheid = {
  datum: Date,
  personeel_ochtend: number,
  personeel_middag: number,
  personeel_avond: number,
  isOpen: boolean,
  isFull: boolean,
  hasBookings: boolean
}

export type AvailableDate = {
  datum: Date,
  personeel_ochtend: number,
  personeel_middag: number,
  personeel_avond: number,
  isOpen: boolean,
  isFull: boolean,
  hasBookings: boolean
};


// INTERFACES
export interface datepickerDOM {
  input: HTMLInputElement;
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
export interface Appointment {
  date: Date | string,
  isFull: boolean
}

export interface dayObject {
  daytitle: any;
  isSelected: boolean;
  isNotInMonth: boolean;
  isToday: boolean;
  dateObj: Date;
  isSelectable: boolean;

  // hasAppointment: boolean;
  //isFull: boolean;
  //isClosed: boolean;
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
