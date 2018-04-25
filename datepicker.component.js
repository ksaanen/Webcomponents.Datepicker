'use strict';

// https://developer.mozilla.org/en-US/docs/Web/Web_Components
// optional attributes are 'min-date', 'max-date'

class datePicker extends HTMLElement {

  constructor() {

    super();

    let elementRef = this;

    let labels = {
      days: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za','Zo'],
      months: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
    }

    elementRef.currentDate = new Date();
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
      _DOM.month.innerText = showMonth();

      _DOM.year = document.createElement('div');
      _DOM.year.className = 'date-picker--year';
      _DOM.year.innerText = showYear();

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
        setToday();
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

    function renderLabels(labelsArray){
      for (let label in labelsArray) {
        let l = document.createElement('div');
        l.className = 'date-picker--day-of-week';
        l.innerText = labelsArray[label];
        elementRef.labels.appendChild(l);
      }
    }
    renderLabels(labels.days);

    function renderCalendar(daysArray){
      elementRef.calendar.innerHTML = ''; // reset calendar
      for (let day in daysArray) {
        let d = document.createElement('div');
        d.className = 'date-picker--day';
        d.innerText = daysArray[day].daytitle;
        d.onclick = function(){
          console.log(daysArray[day]);
          pickDate(daysArray[day].value);
        };

        if (daysArray[day].isNotInMonth) d.className += ' date-picker--edge-day';
        if (daysArray[day].isSelected) d.className += ' date-picker--selected';
        if (daysArray[day].isToday) d.className += ' date-picker--day-today';
        if (daysArray[day].isSelectable) d.className += ' date-picker--selectable';

        elementRef.calendar.appendChild(d);
      }
    }
    renderCalendar(daysObject());
  
    function formatNumber(number){
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }
  
    function formatDate(date){
      let d = new Date(date);
      return d.getFullYear() + '-' + formatNumber(d.getMonth() + 1) + '-' + formatNumber(d.getDate());
    }
  
    function pickDate(date){
      setDate(date);
      renderCalendar(daysObject());
    }
  
    function setDate(date){
      elementRef.currentDate = new Date(date);
    }
  
    function showMonth(){
      return labels.months[elementRef.currentDate.getMonth()];
    }
  
    function showYear(){
      return elementRef.currentDate.getFullYear();
    }
  
    function setToday(){
      pickDate(new Date());
    }
  
    function beforeEndDate(val){
      if (elementRef.startDate) {
        return formatDate(val) >= formatDate(elementRef.startDate);
      }
      return true;
    }
  
    function afterStartDate(val){
      if (elementRef.endDate) {
        return formatDate(val) >= formatDate(elementRef.endDate);
      }
      return true;
    }
  
    function isSelected(date){
      return (formatDate(date) === formatDate(elementRef.currentDate));
    }
  
    function shiftMonth(val){
      let date = new Date(elementRef.currentDate);
      date.setMonth(date.getMonth() + val);
      elementRef.currentDate = date;
      elementRef.month.innerText = showMonth();
      renderCalendar(daysObject());
    }
  
    function daysObject(){
      let iteration = new Date(elementRef.currentDate);
      let days = [];
 
      iteration.setDate(1); // First of the month
      iteration.setDate((iteration.getDate() - iteration.getDay()) + 1); // Back to monday
  
      for (var day = 0; day < (6 * 7); ++day) {
        var obj = {};
  
        obj.daytitle = iteration.getDate();
        obj.isSelected = isSelected(iteration);
        obj.isNotInMonth = iteration.getMonth() !== elementRef.currentDate.getMonth();
        obj.isToday = formatDate(iteration) === formatDate(new Date());
        obj.value = formatDate(iteration);
        obj.isSelectable = beforeEndDate() && afterStartDate();
  
        days.push(obj);
        iteration.setDate(obj.daytitle + 1);
      }

      return days;
    }
  }

  connectedCallback(){
    // not needed yet
  }

}

customElements.define('date-picker', datePicker);