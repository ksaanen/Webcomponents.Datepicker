import { Component, Prop } from '@stencil/core';
import { labels, Appointment, dayObject } from './datepicker.interface';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() first: string;

  @Prop() appointments: Appointment[];

  @Prop() name: string;

  @Prop() from: string;

  @Prop() till: string;

  self: any = this;
  currentDate: Date = new Date();
  todayDate: Date = new Date();

  private _labels: labels = {
    daysOfWeek: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za','Zo'],
    months: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
  }

  private shiftMonth(val: number): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + val);
  }

  private currentMonth(): string {
    return this._labels.months[this.currentDate.getMonth()];
  }

  private currentYear(): string {
    return this.currentDate.getFullYear() + '';
  }

  // private parseDateToString(date: Date): string {
  //   return (date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate());
  // }

  // Expects "YYYY/MM/DD" as input
  private convertStringToDate(str: string): Date {
    let d = new Date();
    let s = str.split('/');
    d.setFullYear(Number(s[0]));
    d.setMonth(Number(s[1]));
    d.setDate(Number(s[2]));

    return d;
  }

  // private hasAppointment(date: Date): boolean {
  //   let _date = this.parseDateToString(date);    
  //   let _a = this.appointments.map(function(e){
  //     return e.date;
  //   }).indexOf(_date);

  //   return _a !== -1;
  // }

  // private isFull(date: Date): boolean {
  //   let _date = this.parseDateToString(date);
  //   let _a = this.appointments.map(function(e){
  //     return e.date;
  //   }).indexOf(_date);

  //   if (_a !== -1) {
  //     return this.appointments[_a].isFull;
  //   }

  //   return false;
  // }

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

  private get daysObject() {
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
        //hasAppointment: this.hasAppointment(i),
        //isFull: this.isFull(i), // Only loop trough data again if data has appointment
        isSelectable: this.isSelectable(i),
        //isClosed: false // TODO
      };

      days.push(obj);
      iteration.setDate(i.getDate() + 1);
    }
    return days;
  }

  

  render() {
    return (
      <div class="date-picker--wrapper">
        <div class="date-picker--inner">
          <div class="date-picker--header">
            <div class="date-picker--prev" onClick={()=>this.shiftMonth(-1)}></div>
            <div class="date-picker--month-year">
              <div class="date-picker--month">{this.currentMonth()}</div>
              <div class="date-picker--year">{this.currentYear()}</div>
            </div>
            <div class="date-picker--next" onClick={()=>this.shiftMonth(1)}></div>
          </div>
          <div class="date-picker--body">
            <div class="date-picker--labels">
              {this._labels.daysOfWeek.map((weekday) => 
                <div class="date-picker--day-of-week">{weekday}</div>
              )}
            </div>
            <div class="date-picker--calendar">
              {this.daysObject.map((day) =>
                <div class="date-picker--day">{day.daytitle}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}