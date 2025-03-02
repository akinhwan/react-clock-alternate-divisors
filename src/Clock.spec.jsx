import React from 'react';
import { mount, shallow } from 'enzyme';

import Clock from './Clock';

describe('Clock', () => {
  describe('<time> element', () => {
    it('is rendered properly', () => {
      const component = shallow(<Clock />);

      const time = component.find('time');

      expect(time).toHaveLength(1);
    });

    it('has 150px size by default', () => {
      const component = shallow(<Clock />);

      const time = component.find('time');

      expect(time.prop('style').width).toBe('150px');
      expect(time.prop('style').height).toBe('150px');
    });

    it('has proper size when given size', () => {
      const size = 167;

      const component = shallow(<Clock size={size} />);

      const time = component.find('time');

      expect(time.prop('style').width).toBe(`${size}px`);
      expect(time.prop('style').height).toBe(`${size}px`);
    });

    it('has proper datetime attribute when given Date value', () => {
      const date = new Date();

      const component = shallow(<Clock value={date} />);

      const time = component.find('time');

      expect(time.prop('dateTime')).toBe(date.toISOString());
    });

    it('has proper datetime attribute when given string value', () => {
      const date = '22:17:00';

      const component = shallow(<Clock value={date} />);

      const time = component.find('time');

      expect(time.prop('dateTime')).toBe(date);
    });
  });

  describe('clock face', () => {
    it('is rendered properly', () => {
      const component = shallow(<Clock />);

      const face = component.find('.react-clock__face');

      expect(face).toHaveLength(1);
    });

    it('has hour and minute marks by default', () => {
      const component = shallow(<Clock />);

      const hourMarks = component.find('HourMark');
      const minuteMarks = component.find('MinuteMark');

      expect(hourMarks).toHaveLength(12);
      expect(minuteMarks).toHaveLength(60 - 12);
    });

    it('does not have hour numbers rendered by default', () => {
      const component = shallow(<Clock />);

      const hourMarks = component.find('HourMark');

      expect(hourMarks.at(0).prop('number')).toBeFalsy();
    });

    it('has hour numbers given renderNumbers flag', () => {
      const component = shallow(<Clock renderNumbers />);

      const hourMarks = component.find('HourMark');

      hourMarks.forEach((hourMark, index) => {
        const hourMarkNumber = hourMark.prop('number');

        expect(hourMarkNumber).toBe(index + 1);
      });
    });

    it('passes formatHour to HourMark components', () => {
      const formatHour = () => 'H';
      const component = shallow(<Clock formatHour={formatHour} renderNumbers />);

      const hourMarks = component.find('HourMark');

      expect(hourMarks.at(0).prop('formatHour')).toBe(formatHour);
    });

    it('has only minute marks when renderHourMarks is false', () => {
      const component = shallow(<Clock renderHourMarks={false} />);

      const hourMarks = component.find('HourMark');
      const minuteMarks = component.find('MinuteMark');

      expect(hourMarks).toHaveLength(0);
      expect(minuteMarks).toHaveLength(60);
    });

    it('has only hour marks when renderMinuteMarks is false', () => {
      const component = shallow(<Clock renderMinuteMarks={false} />);

      const hourMarks = component.find('HourMark');
      const minuteMarks = component.find('MinuteMark');

      expect(hourMarks).toHaveLength(12);
      expect(minuteMarks).toHaveLength(0);
    });

    it('has no marks when renderHourMarks and renderMinuteMarks are false', () => {
      const component = shallow(<Clock renderHourMarks={false} renderMinuteMarks={false} />);

      const hourMarks = component.find('HourMark');
      const minuteMarks = component.find('MinuteMark');

      expect(hourMarks).toHaveLength(0);
      expect(minuteMarks).toHaveLength(0);
    });
  });

  const fullCircle = 360;
  const hourAngle = fullCircle / 12;
  const hourMinuteAngle = hourAngle / 60;
  const minuteAngle = fullCircle / 60;
  const minuteSecondAngle = minuteAngle / 60;
  const secondAngle = fullCircle / 60;

  const getDeg = (transform) => parseFloat(transform.match(/rotate\(([0-9.]*)deg\)/)[1]);
  const getAngle = (hand) => getDeg(hand.prop('style').transform) % 360;

  describe('hour hand', () => {
    it('is rendered properly', () => {
      const component = mount(<Clock />);

      const face = component.find('.react-clock__hour-hand');

      expect(face).toHaveLength(1);
    });

    it('is properly angled', () => {
      const hour = 9;
      const minute = 20;
      const date = new Date(2017, 0, 1, hour, minute);

      const component = mount(<Clock value={date} />);

      const hand = component.find('.react-clock__hour-hand');

      expect(getAngle(hand)).toBeCloseTo(hour * hourAngle + minute * hourMinuteAngle);
    });
  });

  describe('minute hand', () => {
    it('is rendered properly', () => {
      const component = mount(<Clock />);

      const face = component.find('.react-clock__minute-hand');

      expect(face).toHaveLength(1);
    });

    it('is not rendered when renderMinuteHand is false', () => {
      const component = mount(<Clock renderMinuteHand={false} />);

      const face = component.find('.react-clock__minute-hand');

      expect(face).toHaveLength(0);
    });

    it('is properly angled', () => {
      const hour = 9;
      const minute = 20;
      const second = 47;
      const date = new Date(2017, 0, 1, hour, minute, second);

      const component = mount(<Clock value={date} />);

      const hand = component.find('.react-clock__minute-hand');

      expect(getAngle(hand)).toBeCloseTo(minute * minuteAngle + second * minuteSecondAngle);
    });
  });

  describe('second hand', () => {
    it('is rendered properly', () => {
      const component = mount(<Clock />);

      const face = component.find('.react-clock__second-hand');

      expect(face).toHaveLength(1);
    });

    it('is not rendered when renderSecondHand is false', () => {
      const component = mount(<Clock renderSecondHand={false} />);

      const face = component.find('.react-clock__second-hand');

      expect(face).toHaveLength(0);
    });

    it('is properly angled', () => {
      const hour = 9;
      const minute = 20;
      const second = 47;
      const date = new Date(2017, 0, 1, hour, minute, second);

      const component = mount(<Clock value={date} />);

      const hand = component.find('.react-clock__second-hand');

      expect(getAngle(hand)).toBeCloseTo(second * secondAngle);
    });
  });
});
