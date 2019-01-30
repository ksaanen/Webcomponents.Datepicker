import { Component, Prop, State } from '@stencil/core';
import { Appointment, dayObject } from './date-picker.interface';

@Component({
  tag: 'date-picker',
  styleUrl: 'date-picker.css',
  shadow: true
})
export class DatePicker {
  /* Optional appointments object array to populate the datepicker */
  @Prop() appointments: Appointment[] = [];
  /* Name of the datepicker element to identify it's value */
  @Prop() name: string;
  /* Earliest date for selectable range */
  @Prop() from: string;
  /* Latest date for selectable range */
  @Prop() till: string;

  @State() currentDate: Date = new Date();
  @State() _daysObject: any;
  @State() _currentMonth: string;
  @State() _currentYear: string;

  todayDate: Date;
  daysOfWeek: string[];
  months: string[];

  constructor(){
    this.todayDate = new Date();
    this.daysOfWeek = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za','Zo'];
    this.months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    this.refresh();
  }

  private shiftMonth(val: number): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + val);
    this.refresh();
  }

  private get currentMonth(): string {
    return this.months[this.currentDate.getMonth()];
  }

  private get currentYear(): string {
    return this.currentDate.getFullYear() + '';
  }

  private parseDateToString(date: Date): string {
    return (date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate());
  }

  // Expects "YYYY/MM/DD" as input
  private convertStringToDate(str: string): Date {
    let d = new Date();
    let s = str.split('/');
    d.setFullYear(Number(s[0]));
    d.setMonth(Number(s[1]));
    d.setDate(Number(s[2]));

    return d;
  }

  private hasAppointment(date: Date): boolean {
    let _date = this.parseDateToString(date);    
    let _a = this.appointments.map(function(e){
      return e.date;
    }).indexOf(_date);

    return _a !== -1;
  }

  private isFull(date: Date): boolean {
    let _date = this.parseDateToString(date);
    let _a = this.appointments.map(function(e){
      return e.date;
    }).indexOf(_date);

    if (_a !== -1) {
      return this.appointments[_a].isFull;
    }

    return false;
  }

  private isBeforeEndDate(date: Date): boolean {
    if (this.till) {
      let endDate = this.convertStringToDate(this.till)
      return date.getTime() <= endDate.getTime();
    }
    return true;
  }

  private isAfterStartDate(date: Date): boolean {
    if (this.from) {
      return date.getTime() >= new Date(this.from).getTime();
    }
    return true;
  }

  private isSelectable(date: Date): boolean {
    return this.isBeforeEndDate(date) && this.isAfterStartDate(date) && !this.isFull(date);
  }

  private daysObjectFn() {
    let iteration = new Date(this.currentDate);
    let days: dayObject[] = [];
    iteration.setDate(1);
    iteration.setDate((iteration.getDate() - iteration.getDay()) + 1); // Back to monday

    for (let day = 0; day < (6 * 7); ++day) {
      let i = new Date(iteration);
      let obj: dayObject = {
        daytitle: i.getDate(),
        isSelected: i.getTime() === this.currentDate.getTime(),
        isNotInMonth: i.getMonth() !== this.currentDate.getMonth(),
        isToday: i.getTime() == this.todayDate.getTime(),
        dateObj: i,
        hasAppointment: this.hasAppointment(i),
        isFull: this.isFull(i), // Only loop trough data again if data has appointment
        isSelectable: this.isSelectable(i),
        isClosed: false // TODO
      };

      days.push(obj);
      iteration.setDate(i.getDate() + 1);
    }
    return days;
  }

  private refresh(): void {
    this._daysObject = this.daysObjectFn();
    this._currentMonth = this.currentMonth;
    this._currentYear = this.currentYear;
  }


  render() {
    return (
      <div class="date-picker--wrapper">
        <div class="date-picker--inner">
          <div class="date-picker--header">
            <div class="date-picker--prev" onClick={()=>this.shiftMonth(-1)}></div>
            <div class="date-picker--month-year">
              <div class="date-picker--month">{this._currentMonth}</div>
              <div class="date-picker--year">{this.currentYear}</div>
            </div>
            <div class="date-picker--next" onClick={()=>this.shiftMonth(1)}></div>
          </div>
          <div class="date-picker--body">
            <div class="date-picker--labels">
              {this.daysOfWeek.map((weekday) => 
                <div class="date-picker--day-of-week">{weekday}</div>
              )}
            </div>
            <div class="date-picker--calendar">
              {this._daysObject.map((day) =>
                <div class="date-picker--day">{day.daytitle}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}