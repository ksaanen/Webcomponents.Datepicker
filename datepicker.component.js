'use strict';

// Webcomponents try-out as documented at:
// https://developer.mozilla.org/en-US/docs/Web/Web_Components
// 
// optional attributes are 'min-date', 'max-date'

class datePicker extends HTMLElement {

  constructor() {

    super();

    let elementRef = this;

    elementRef.input = document.createElement('input');
    elementRef.input.type = 'date';

    elementRef.pickDate = pickDate;
    elementRef.close = close;
    elementRef.shiftMonth = shiftMonth;
    elementRef.showMonth = showMonth;
    elementRef.showYear = showYear;
    elementRef.setToday = setToday;
    elementRef.dateTypeSupport = dateTypeSupport;
    elementRef.labels = {
      days: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za','Zo'],
      months: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
    }

    let shadowRef = this.attachShadow({mode: 'open'});

    function init() {
      // init days
      elementRef.days = [];
      elementRef.currentDate = new Date();
      elementRef.isVisible = elementRef.isVisible || false;
      elementRef.input.value = formatDate(elementRef.currentDate);

      elementRef.startDate = elementRef.getAttribute('min-date') || null;
      elementRef.endDate = elementRef.getAttribute('max-date') || null;

      buildCalendar();
    }

    init();
    
    function DOMRender(){
      let dpStyle = document.createElement('style');
      dpStyle.textContent = '@import "datepicker.component.css"';

      let dpWrapper = document.createElement('div');
      dpWrapper.className ='date-picker--wrapper';

      let dpClickout = document.createElement('div');
      dpClickout.className = 'date-picker--clickout';

      let dpInner = document.createElement('div');
      dpInner.className = 'date-picker--inner';

      let dpHeader = document.createElement('div');
      dpHeader.className = 'date-picker--header';

      let dpBtnPrev = document.createElement('div');
      dpBtnPrev.className = 'date-picker--prev';
      dpBtnPrev.onclick = function(){
        shiftMonth(-1);
      }

      let dpBtnNext = document.createElement('div');
      dpBtnNext.className = 'date-picker--next';
      dpBtnNext.onclick = function(){
        shiftMonth(1);
      }

      let dpMonthYear = document.createElement('div');
      dpMonthYear.className = 'date-picker--month-year';

      let dpMonth = document.createElement('div');
      dpMonth.className = 'date-picker--month';
      dpMonth.innerText = showMonth();

      let dpYear = document.createElement('div');
      dpYear.className = 'date-picker--year';
      dpYear.innerText = showYear();

      let dpBody = document.createElement('div');
      dpBody.className = 'date-picker--body';

      // Build DOM
      shadowRef.innerHTML = ''; // reset DOM

      shadowRef.appendChild(dpStyle);
      shadowRef.appendChild(elementRef.input);

      shadowRef.appendChild(dpWrapper);
      dpWrapper.appendChild(dpClickout);
      dpWrapper.appendChild(dpInner);

      dpInner.appendChild(dpHeader);
      dpHeader.appendChild(dpBtnPrev);
      dpHeader.appendChild(dpMonthYear);
      dpHeader.appendChild(dpBtnNext);

      dpMonthYear.appendChild(dpMonth);
      dpMonthYear.appendChild(dpYear);

      dpInner.appendChild(dpBody);

      // render labels
      for (let i in elementRef.labels.days) {
        let l = document.createElement('div');
        l.className = 'date-picker--day-of-week';
        l.innerText = elementRef.labels.days[i];
        dpBody.appendChild(l);
      }

      // render days
      for (let i in elementRef.days) {
        let d = document.createElement('div');
        
        d.className = 'date-picker--day';
        d.innerText = elementRef.days[i].daytitle;
        d.onclick = function(){
          pickDate(elementRef.days[i].value);
        };

        if (elementRef.days[i].isNotInMonth) d.className += ' date-picker--edge-day';
        if (elementRef.days[i].isSelected) d.className += ' date-picker--selected';
        if (elementRef.days[i].isToday) d.className += ' date-picker--day-today';
        if (elementRef.days[i].isSelectable) d.className += ' date-picker--selectable';

        dpBody.appendChild(d);
      }

      let dpFooter = document.createElement('div');
      dpFooter.className = 'date-picker--footer';

      dpInner.appendChild(dpFooter);
    }

    DOMRender();
  
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
      elementRef.input.value = formatDate(date);
      buildCalendar();
    }
  
    function setDate(date){
      if (date) {
        elementRef.currentDate = new Date(date);
      }
    }
  
    function showMonth(){
      return elementRef.labels.months[elementRef.currentDate.getMonth()];
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
      return (formatDate(date) === formatDate(elementRef.input.value));
    }
  
    function shiftMonth(val){
      var dt = new Date(elementRef.currentDate);
      dt.setMonth(dt.getMonth() + val);
      elementRef.currentDate = dt;
      buildCalendar();
      DOMRender();
    }
  
    function dateTypeSupport(){
      // check for input type date support
      var el = document.createElement('input'), invalidVal = 'foo';
      el.setAttribute('type', 'date');
      el.setAttribute('value', invalidVal);
      return el.value !== invalidVal;
    }
  
    function buildCalendar(){
      let iteration = new Date(elementRef.currentDate);
      elementRef.days = [];
 
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
  
        elementRef.days.push(obj);
        iteration.setDate(obj.daytitle + 1);
      }
    }
  }

  connectedCallback(){
    // not needed yet
  }

}

customElements.define('date-picker', datePicker);