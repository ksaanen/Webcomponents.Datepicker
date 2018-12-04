'use strict'

import { AvailableDate } from "./datepicker.interface";

function availability(from: Date, till: Date, _default: any, _override: any, _bookings: any) {

  // Store everything
  let availabilityObjectArray: AvailableDate[] = [];

  let defaultOpeningstijden = _default;
  let afwijkendeOpeningstijden = _override;
  let afspraken = _bookings;

  let parseDateToString = (date: Date, sep: string = '-'): string => {
    date = parseStringToDate(date);

    let _date = date,
      _year = _date.getFullYear(),
      _month = '' + (_date.getMonth() + 1),
      _day = '' + _date.getDate();

    if (_month.length < 2) _month = '0' + _month;
    if (_day.length < 2) _day = '0' + _day;

    return [_year, _month, _day].join(sep);
  }

  let parseStringToDate = (date: Date | string): Date => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date;
  }

  // Generate array of dates 
  let datesRange = (from: Date, till: Date): string[] => {
    let _array: string[] = [];
    from = parseStringToDate(from);
    till = parseStringToDate(till);
    for (let d = from; d < till; d.setDate(d.getDate() + 1)) {
      _array.push(parseDateToString(d));
    }
    return _array;
  }

  // Default openingstijden
  let defaultDates = datesRange(from, till);
  for (let i = 0; i < defaultDates.length; i++) {

    let _dayOfWeek = new Date(defaultDates[i]).getDay();
    let _index;

    for (let i = 0; i < defaultOpeningstijden.length; i++) {
      if (_dayOfWeek === Number(defaultOpeningstijden[i].dag)) {
        _index = i;
      }
    }

    let availableDate: AvailableDate = {
      datum: new Date(defaultDates[i]),
      personeel_ochtend: Number(defaultOpeningstijden[_index].personeel_ochtend),
      personeel_middag: Number(defaultOpeningstijden[_index].personeel_middag),
      personeel_avond: Number(defaultOpeningstijden[_index].personeel_avond),
      isOpen: Number(defaultOpeningstijden[_index].is_open) == 1 ? true : false,
      hasBookings: false,
      isFull: false
    };

    availabilityObjectArray.push(availableDate);
  }

  // Afwijkende tijden override
  for (let i = 0; i < afwijkendeOpeningstijden.length; i++) {
    let _date = new Date(afwijkendeOpeningstijden[i].datum);
    let _itter = i;
    for (let i = 0; i < availabilityObjectArray.length; i++) {
      if (Number(_date) == Number(availabilityObjectArray[i].datum)) {
        let _index = i;
        availabilityObjectArray[_index].isOpen = Number(afwijkendeOpeningstijden[_itter].is_open) == 1 ? true : false;
        availabilityObjectArray[_index].personeel_ochtend = Number(afwijkendeOpeningstijden[_itter].personeel_ochtend);
        availabilityObjectArray[_index].personeel_middag = Number(afwijkendeOpeningstijden[_itter].personeel_middag);
        availabilityObjectArray[_index].personeel_avond = Number(afwijkendeOpeningstijden[_itter].personeel_avond);
      }
    }
  }

  // Afspraken override
  for (let i = 0; i < afspraken.length; i++) {
    let _date = new Date(afspraken[i].datum);
    let _itter = i;
    for (let i = 0; i < availabilityObjectArray.length; i++) {
      if (Number(_date) == Number(availabilityObjectArray[i].datum)) {
        console.log(afspraken[_itter]);
        let _dagdeel = afspraken[_itter].dagdeel.toLowerCase();
        availabilityObjectArray[i].hasBookings = true;
        switch (_dagdeel) {
          case 'ochtend':
            availabilityObjectArray[i].personeel_ochtend--;
            break;
          case 'middag':
            availabilityObjectArray[i].personeel_middag--;
            break;
          case 'avond':
            availabilityObjectArray[i].personeel_avond--;
            break;
          default:
            break;
        }
      }
    }
  }

  // isFull override
  for (let i = 0; i < availabilityObjectArray.length; i++) {
    let sum = [availabilityObjectArray[i].personeel_ochtend, availabilityObjectArray[i].personeel_middag, availabilityObjectArray[i].personeel_avond].reduce((a, b) => a + b, 0);
    if (sum <= 0) {
      availabilityObjectArray[i].isFull = true;
    }
  }

  return availabilityObjectArray;
};