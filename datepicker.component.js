'use strict';

// https://developer.mozilla.org/en-US/docs/Web/Web_Components
// optional attributes are 'min-date', 'max-date'

class datePicker extends HTMLElement {

  constructor() {

    super();

    let elementRef = this;
    let currentDate = new Date();
    const todayDate = new Date();

    let labels = {
      daysOfWeek: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za','Zo'],
      months: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
    }
    elementRef.startDate = elementRef.getAttribute('min-date') || null;
    elementRef.endDate = elementRef.getAttribute('max-date') || null;

    let shadowRef = this.attachShadow({mode: 'open'});
    
    function DOMRender(){
      let _DOM = elementRef;

      _DOM._style = document.createElement('style');
      _DOM._style.textContent = '@import "datepicker.component.css"';

      _DOM.wrapper = document.createElement('div');
      _DOM.wrapper.className ='date-picker--wrapper';

      _DOM.inner = document.createElement('div');
      _DOM.inner.className = 'date-picker--inner';

      _DOM.header = document.createElement('div');
      _DOM.header.className = 'date-picker--header';

      _DOM.btnPrev = document.createElement('div');
      _DOM.btnPrev.className = 'date-picker--prev';
      _DOM.btnPrev.onclick = function(){
        shiftMonth(-1);
      }

      _DOM.btnNext = document.createElement('div');
      _DOM.btnNext.className = 'date-picker--next';
      _DOM.btnNext.onclick = function(){
        shiftMonth(1);
      }

      _DOM.monthYear = document.createElement('div');
      _DOM.monthYear.className = 'date-picker--month-year';

      _DOM.month = document.createElement('div');
      _DOM.month.className = 'date-picker--month';
      _DOM.month.innerText = currentMonth();

      _DOM.year = document.createElement('div');
      _DOM.year.className = 'date-picker--year';
      _DOM.year.innerText = currentYear();

      _DOM.body = document.createElement('div');
      _DOM.body.className = 'date-picker--body';

      _DOM.labels = document.createElement('div');
      _DOM.labels.className = 'date-picker--labels';

      _DOM.calendar = document.createElement('div');
      _DOM.calendar.className = 'date-picker--calendar';

      _DOM.footer = document.createElement('div');
      _DOM.footer.className = 'date-picker--footer';

      _DOM.btnToday = document.createElement('div');
      _DOM.btnToday.className = 'date-picker--today';
      _DOM.btnToday.innerText = 'vandaag';
      _DOM.btnToday.onclick = function(){
        setDate(todayDate);
      }

      // Build DOM
      shadowRef.appendChild(_DOM._style);
      shadowRef.appendChild(_DOM.wrapper);
      _DOM.wrapper.appendChild(_DOM.inner);
      _DOM.inner.appendChild(_DOM.header);
      _DOM.header.appendChild(_DOM.btnPrev);
      _DOM.header.appendChild(_DOM.monthYear);
      _DOM.header.appendChild(_DOM.btnNext);

      _DOM.monthYear.appendChild(_DOM.month);
      _DOM.monthYear.appendChild(_DOM.year);

      _DOM.inner.appendChild(_DOM.body);
      _DOM.body.appendChild(_DOM.labels);
      _DOM.body.appendChild(_DOM.calendar);

      _DOM.inner.appendChild(_DOM.footer);
      _DOM.footer.appendChild(_DOM.btnToday);
    }

    DOMRender();

    function renderDaysOfWeek(labelsArray){
      for (let label in labelsArray) {
        let l = document.createElement('div');
        l.className = 'date-picker--day-of-week';
        l.innerText = labelsArray[label];
        elementRef.labels.appendChild(l);
      }
    }
    renderDaysOfWeek(labels.daysOfWeek);

    function renderCalendar(daysArray){
      elementRef.calendar.innerHTML = ''; // reset calendar
      for (let day in daysArray) {
        let d = document.createElement('div');
        d.className = 'date-picker--day';
        d.innerText = daysArray[day].daytitle;

        d.onclick = function(){
          setDate(daysArray[day].dateObj);
        };

        // add classnames based on expressions
        if (daysArray[day].isNotInMonth) d.className += ' date-picker--edge-day';
        if (daysArray[day].isSelected) d.className += ' date-picker--selected';
        if (daysArray[day].isToday) d.className += ' date-picker--day-today';
        if (daysArray[day].isSelectable) d.className += ' date-picker--selectable';

        elementRef.calendar.appendChild(d);
      }
    }
    renderCalendar(daysObject());
  
    function setDate(date){
      currentDate = date;
      refresh();
    }
  
    function currentMonth(){
      return labels.months[currentDate.getMonth()];
    }
  
    function currentYear(){
      return currentDate.getFullYear();
    }
  
    function beforeEndDate(val){
      if (elementRef.startDate) {
        return val.getTime() >= new Date(elementRef.startDate).getTime();
      }
      return true;
    }
  
    function afterStartDate(val){
      if (elementRef.endDate) {
        return val.getTime() >= new Date(elementRef.endDate).getTime();
      }
      return true;
    }
  
    function shiftMonth(val){
      currentDate.setMonth(currentDate.getMonth() + val);
      refresh();
    }
  
    function daysObject(){
      let iteration = new Date(currentDate);
      let days = [];
      iteration.setDate(1); // First of the month
      iteration.setDate((iteration.getDate() - iteration.getDay()) + 1); // Back to monday
  
      for (let day = 0; day < (6 * 7); ++day) {
        let obj = {};
        let i = new Date(iteration);

        obj.daytitle = i.getDate();
        obj.isSelected = i.getTime() === currentDate.getTime();
        obj.isNotInMonth = i.getMonth() !== currentDate.getMonth();
        obj.isToday = i.getTime() == todayDate.getTime();
        obj.dateObj = i;
        obj.isSelectable = beforeEndDate(i) && afterStartDate(i);
  
        days.push(obj);
        iteration.setDate(i.getDate() + 1);
      }
      return days;
    }

    function parseDate(date) {
      // for debugging purpose
      console.log(date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear());
    }

    function refresh() {
      elementRef.month.innerText = currentMonth();
      elementRef.year.innerText = currentYear();
      renderCalendar(daysObject());
    }
  }

  connectedCallback(){
    // not needed yet
  }

}

customElements.define('date-picker', datePicker);