'use strict';
class datePicker extends HTMLElement {
    constructor() {
        super();
        let self = this;
        let currentDate = new Date();
        const todayDate = new Date();
        let labels = {
            daysOfWeek: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'],
            months: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
        };
        let shadowRef = self.attachShadow({ mode: 'open' });
        let datepicker;
        function DOMRender() {
            datepicker = {
                style: document.createElement('style'),
                input: document.createElement('input'),
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
            datepicker.style.textContent = '@import "datepicker.component.css"';
            datepicker.input.type = 'text';
            datepicker.input.name = self.getAttribute('name') || 'datepicker';
            datepicker.input.setAttribute("hidden", "true");
            datepicker.wrapper.className = 'date-picker--wrapper';
            datepicker.inner.className = 'date-picker--inner';
            datepicker.header.className = 'date-picker--header';
            datepicker.btnPrev.className = 'date-picker--prev';
            datepicker.btnPrev.onclick = function () {
                shiftMonth(-1);
            };
            datepicker.btnNext.className = 'date-picker--next';
            datepicker.btnNext.onclick = function () {
                shiftMonth(1);
            };
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
            datepicker.btnToday.onclick = function () {
                setDate(todayDate);
            };
            shadowRef.appendChild(datepicker.style);
            shadowRef.appendChild(datepicker.input);
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
        function renderDaysOfWeek(labelsArray) {
            for (let label in labelsArray) {
                let l = document.createElement('div');
                l.className = 'date-picker--day-of-week';
                l.innerText = labelsArray[label];
                datepicker.labels.appendChild(l);
            }
        }
        renderDaysOfWeek(labels.daysOfWeek);
        function renderCalendar(daysArray) {
            datepicker.calendar.innerHTML = '';
            for (let day in daysArray) {
                let d = document.createElement('div');
                d.className = 'date-picker--day';
                d.innerText = daysArray[day].daytitle + '';
                d.onclick = function () {
                    setDate(daysArray[day].dateObj);
                };
                if (daysArray[day].isNotInMonth)
                    d.className += ' date-picker--edge-day';
                if (daysArray[day].isSelected)
                    d.className += ' date-picker--selected';
                if (daysArray[day].isToday)
                    d.className += ' date-picker--day-today';
                if (daysArray[day].isSelectable)
                    d.className += ' date-picker--selectable';
                datepicker.calendar.appendChild(d);
            }
        }
        renderCalendar(daysObject());
        function setDate(date) {
            if (isSelectable(date)) {
                currentDate = date;
                setInput(date);
                refresh();
            }
        }
        function setInput(date) {
            datepicker.input.value = parseDateToString(date);
        }
        function currentMonth() {
            return labels.months[currentDate.getMonth()];
        }
        function currentYear() {
            return currentDate.getFullYear() + '';
        }
        function isBeforeEndDate(date) {
            let till = self.getAttribute('till') || null;
            if (till) {
                let endDate = convertStringToDate(till);
                return date.getTime() <= endDate.getTime();
            }
            return true;
        }
        function isAfterStartDate(date) {
            let from = self.getAttribute('from') || null;
            if (from) {
                return date.getTime() >= new Date(from).getTime();
            }
            return true;
        }
        function isSelectable(date) {
            return isBeforeEndDate(date) && isAfterStartDate(date);
        }
        function shiftMonth(val) {
            currentDate.setMonth(currentDate.getMonth() + val);
            refresh();
        }
        function daysObject() {
            let iteration = new Date(currentDate);
            let days = [];
            iteration.setDate(1);
            iteration.setDate((iteration.getDate() - iteration.getDay()) + 1);
            for (let day = 0; day < (6 * 7); ++day) {
                let i = new Date(iteration);
                let obj = {
                    daytitle: i.getDate(),
                    isSelected: i.getTime() === currentDate.getTime(),
                    isNotInMonth: i.getMonth() !== currentDate.getMonth(),
                    isToday: i.getTime() == todayDate.getTime(),
                    dateObj: i,
                    isSelectable: isSelectable(i)
                };
                days.push(obj);
                iteration.setDate(i.getDate() + 1);
            }
            return days;
        }
        function parseDateToString(date) {
            return (date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate());
        }
        function convertStringToDate(str) {
            let d = new Date();
            let s = str.split('/');
            d.setFullYear(Number(s[0]));
            d.setMonth(Number(s[1]));
            d.setDate(Number(s[2]));
            return d;
        }
        function refresh() {
            datepicker.month.innerText = currentMonth();
            datepicker.year.innerText = currentYear();
            renderCalendar(daysObject());
        }
    }
    connectedCallback() {
    }
}
customElements.define('date-picker', datePicker);
//# sourceMappingURL=datepicker.component.js.map