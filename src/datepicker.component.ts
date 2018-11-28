'use strict';

import {datepickerDOM, dayObject, daysObject, labels, datepickerElementRef, Appointment} from './datepicker.interface';

class datePicker extends HTMLElement {

  constructor() {
    super();

    let self = this;
    self.value = '';
    self.name = '';
    self.name = 'text';
    
    let currentDate: Date = new Date();
    const todayDate: Date = new Date();

    let labels: labels = {
      daysOfWeek: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za','Zo'],
      months: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
    }

    let shadowRef = self.attachShadow({mode: 'open'});
    let datepicker: datepickerDOM;
    let appointments: Appointment[] = JSON.parse(self.getAttribute('appointments')) || [];
    
    function DOMRender(){
      datepicker = {
        style: document.createElement('style'),
        wrapper: document.createElement('div'),
        inner: document.createElement('div'),
        header: document.createElement('div'),
        btnPrev: document.createElement('div'),
        btnNext: document.createElement('div'),
        monthYear: document.createElement('div'),
        month: document.createElement('div'),
        year: document.createElement('div'),
        body: document.createElement('div'),
        labels: document.createElement('div'),
        calendar: document.createElement('div'),
        footer: document.createElement('div'),
        btnToday: document.createElement('span')
      };

      datepicker.style.textContent = '@import "dist/datepicker.component.css"';

      datepicker.wrapper.className ='date-picker--wrapper';
      datepicker.inner.className = 'date-picker--inner';

      datepicker.header.className = 'date-picker--header';

      datepicker.btnPrev.className = 'date-picker--prev';
      datepicker.btnPrev.onclick = function(){
        shiftMonth(-1);
      }

      datepicker.btnNext.className = 'date-picker--next';
      datepicker.btnNext.onclick = function(){
        shiftMonth(1);
      }

      datepicker.monthYear.className = 'date-picker--month-year';

      datepicker.month.className = 'date-picker--month';
      datepicker.month.innerText = currentMonth();

      datepicker.year.className = 'date-picker--year';
      datepicker.year.innerText = currentYear();

      datepicker.body.className = 'date-picker--body';

      datepicker.labels.className = 'date-picker--labels';

      datepicker.calendar.className = 'date-picker--calendar';

      datepicker.footer.className = 'date-picker--footer';

      datepicker.btnToday.className = 'reset';
      datepicker.btnToday.innerText = 'reset';
      datepicker.btnToday.onclick = function(){
        setDate(todayDate);
      }

      // Build DOM
      shadowRef.appendChild(datepicker.style);
      shadowRef.appendChild(datepicker.wrapper);
      datepicker.wrapper.appendChild(datepicker.inner);
      datepicker.inner.appendChild(datepicker.header);
      datepicker.header.appendChild(datepicker.btnPrev);
      datepicker.header.appendChild(datepicker.monthYear);
      datepicker.header.appendChild(datepicker.btnNext);
      datepicker.monthYear.appendChild(datepicker.month);
      datepicker.monthYear.appendChild(datepicker.year);
      datepicker.inner.appendChild(datepicker.body);
      datepicker.body.appendChild(datepicker.labels);
      datepicker.body.appendChild(datepicker.calendar);
      datepicker.inner.appendChild(datepicker.footer);
      datepicker.footer.appendChild(datepicker.btnToday);
    }

    DOMRender();

    function renderDaysOfWeek(labelsArray: string[]): void {
      for (let label in labelsArray) {
        let l = document.createElement('div');
        l.className = 'date-picker--day-of-week';
        l.innerText = labelsArray[label];
        datepicker.labels.appendChild(l);
      }
    }
    renderDaysOfWeek(labels.daysOfWeek);

    function renderCalendar(daysArray: dayObject[]): void {
      datepicker.calendar.innerHTML = ''; // reset calendar
      for (let day in daysArray) {
        let d = document.createElement('div');
        d.className = 'date-picker--day';
        d.innerText = daysArray[day].daytitle + '';

        d.onclick = function(){
          setDate(daysArray[day].dateObj);
        };

        // add classnames based on expressions
        if (daysArray[day].isNotInMonth) d.className += ' date-picker--edge-day';
        if (daysArray[day].isSelected) d.className += ' date-picker--selected';
        if (daysArray[day].isToday) d.className += ' date-picker--day-today';
        if (daysArray[day].isSelectable) d.className += ' date-picker--selectable';
        if (daysArray[day].hasAppointment) d.className += ' date-picker--appointment';
        if (daysArray[day].isFull) d.className += ' date-picker--full';

        datepicker.calendar.appendChild(d);
      }
    }
    renderCalendar(daysObject());
  
    function setDate(date: Date): void {
      if (isSelectable(date)) {
        currentDate = date;
        setInput(date);
        refresh();
      }
    }

    function setInput(date: Date): void {
      datepicker.input.value = parseDateToString(date);
    }
  
    function currentMonth(): string {
      return labels.months[currentDate.getMonth()];
    }
  
    function currentYear(): string {
      return currentDate.getFullYear() + '';
    }
  
    function isBeforeEndDate(date: Date): boolean {
      let till = self.getAttribute('till') || null;
      if (till) {
        let endDate = convertStringToDate(till)
        return date.getTime() <= endDate.getTime();
      }
      return true;
    }
  
    function isAfterStartDate(date: Date): boolean {
      let from = self.getAttribute('from') || null;
      if (from) {
        return date.getTime() >= new Date(from).getTime();
      }
      return true;
    }

    function isSelectable(date: Date): boolean {
      return isBeforeEndDate(date) && isAfterStartDate(date) && !isFull(date);
    }
  
    function shiftMonth(val: number): void {
      currentDate.setMonth(currentDate.getMonth() + val);
      refresh();
    }

    function hasAppointment(date: Date): boolean {
      let _date = parseDateToString(date);
      let _a = appointments.map(function(e){
        return e.date;
      }).indexOf(_date);

      return _a !== -1;
    }

    function isFull(date: Date): boolean {
      let _date = parseDateToString(date);
      let _a = appointments.map(function(e){
        return e.date;
      }).indexOf(_date);

      if (_a !== -1) {
        return appointments[_a].isFull;
      }

      return false;
    }

    function daysObject(): dayObject[] {
      let iteration = new Date(<any>currentDate);
      let days: dayObject[] = [];
      iteration.setDate(1); // First of the month
      iteration.setDate((iteration.getDate() - iteration.getDay()) + 1); // Back to monday
  
      for (let day = 0; day < (6 * 7); ++day) {

        let i = new Date(<any>iteration);

        let obj: dayObject = {
          daytitle: <any>i.getDate(),
          isSelected: i.getTime() === currentDate.getTime(),
          isNotInMonth: i.getMonth() !== currentDate.getMonth(),
          isToday: i.getTime() == todayDate.getTime(),
          dateObj: i,
          hasAppointment: hasAppointment(i),
          isFull: isFull(i), // Only loop trough data again if data has appointment
          isSelectable: isSelectable(i)
        };

        days.push(obj);
        iteration.setDate(i.getDate() + 1);
      }
      return days;
    }

    function parseDateToString(date: Date): string {
      return (date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate());
    }

    // Expects "YYYY/MM/DD" as input
    function convertStringToDate(str: string): Date {
      let d = new Date();
      let s = str.split('/');
      d.setFullYear(Number(s[0]));
      d.setMonth(Number(s[1]));
      d.setDate(Number(s[2]));

      return d;
    }

    function refresh(): void {
      datepicker.month.innerText = currentMonth();
      datepicker.year.innerText = currentYear();
      renderCalendar(daysObject());
    }
  }

  connectedCallback(): void {
    // Initialize properties
    this.value = this.getAttribute('value') || this.value;
    this.name = this.getAttribute('name') || this.name;
    this.type = this.getAttribute('type') || this.type;
  }

  get value(): string {
    return this.getAttribute('value');
  }
  
  set value(newValue: string) {
    this.setAttribute('value', newValue);
  }

  get type(): string {
    return this.getAttribute('type');
  }

  set type(newValue: string) {
    this.setAttribute('type', newValue);
  }
  
  get name(): string {
    return this.getAttribute('name');
  }

  set name(newValue: string) {
    this.setAttribute('name', newValue);
  }

}

customElements.define('date-picker', datePicker);