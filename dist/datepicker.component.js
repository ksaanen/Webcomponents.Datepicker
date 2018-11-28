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
        let appointments = JSON.parse(self.getAttribute('appointments')) || [];
        function DOMRender() {
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
            datepicker.style.textContent = "[hidden]{display:none}.date-picker--wrapper{font-family:Arial;width:300px;border:1px solid #CCC;box-shadow:3px 3px 0 0 #EFEFEF;padding:10px}.date-picker{position:relative;background:white;text-align:center}.date-picker--header{display:flex;padding:0 12px}.date-picker--month-year,.date-picker--prev,.date-picker--next{flex:1;vertical-align:middle}.date-picker--month-year{font-size:13px;font-weight:300;text-align:center}.date-picker--prev,.date-picker--next{outline:none;padding-top:5px}.date-picker--prev:after,.date-picker--next:after{content:'';border:2px solid hotpink;width:10px;height:10px;display:inline-block;-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-moz-transition:border-color 0.2s;-o-transition:border-color 0.2s;-webkit-transition:border-color 0.2s;transition:border-color 0.2s}.date-picker--prev:focus:after,.date-picker--next:focus:after,.date-picker--prev:hover:after,.date-picker--next:hover:after{border-color:black}.date-picker--prev:after{border-right:0;border-bottom:0}.date-picker--next:after{border-left:0;border-top:0}.date-picker--prev{text-align:left}.date-picker--next{text-align:right}.date-picker--prev:hover,.date-picker--next:hover{cursor:pointer}.date-picker--body,.date-picker--footer{text-align:center}.date-picker--day-of-week,.date-picker--day{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;display:inline-block;text-align:center;border:0;margin:0;line-height:1em;padding:8px 0;background:transparent;outline:none;text-decoration:none;border-radius:3px;border:2px solid transparent;width:calc(100%/7)}.date-picker--day{position:relative;font-size:13px;color:lavender;cursor:default}.date-picker--day:hover{border:2px dashed hotpink}.date-picker--selectable{cursor:pointer;color:hotpink}.date-picker--edge-day{color:lavender}.date-picker--selected{border:2px solid hotpink !important}.date-picker--day-of-week{text-transform:uppercase;font-size:13px;opacity:0.5}.date-picker--day-today:after{content:'';height:0;width:0;border:7px solid hotpink;border-bottom-color:transparent;border-left-color:transparent;position:absolute;top:0;right:0}.date-picker--footer{text-align:right;padding:0 12px}.reset{color:hotpink;text-decoration:underline;cursor:pointer;font-size:15px}.date-picker--appointment{background-color:orange}.date-picker--full{background-color:red !important}";
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
                if (daysArray[day].hasAppointment)
                    d.className += ' date-picker--appointment';
                if (daysArray[day].isFull)
                    d.className += ' date-picker--full';
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
            self.value = parseDateToString(date);
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
            return isBeforeEndDate(date) && isAfterStartDate(date) && !isFull(date);
        }
        function shiftMonth(val) {
            currentDate.setMonth(currentDate.getMonth() + val);
            refresh();
        }
        function hasAppointment(date) {
            let _date = parseDateToString(date);
            let _a = appointments.map(function (e) {
                return e.date;
            }).indexOf(_date);
            return _a !== -1;
        }
        function isFull(date) {
            let _date = parseDateToString(date);
            let _a = appointments.map(function (e) {
                return e.date;
            }).indexOf(_date);
            if (_a !== -1) {
                return appointments[_a].isFull;
            }
            return false;
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
                    hasAppointment: hasAppointment(i),
                    isFull: isFull(i),
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
        this.value = this.getAttribute('value') || this.value;
        this.name = this.getAttribute('name') || this.name;
        this.type = this.getAttribute('type') || this.type;
    }
    get value() {
        return this.getAttribute('value');
    }
    set value(newValue) {
        this.setAttribute('value', newValue);
    }
    get type() {
        return this.getAttribute('type');
    }
    set type(newValue) {
        this.setAttribute('type', newValue);
    }
    get name() {
        return this.getAttribute('name');
    }
    set name(newValue) {
        this.setAttribute('name', newValue);
    }
}
customElements.define('date-picker', datePicker);
//# sourceMappingURL=datepicker.component.js.map