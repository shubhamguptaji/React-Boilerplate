// GLOBAL imports
import React from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import {
  DatetimePickerTrigger,
  DatetimeRangePickerTrigger
} from 'rc-datetime-picker';
import '!style-loader!css-loader!rc-datetime-picker/dist/picker.min.css'; // eslint-disable-line import/no-webpack-loader-syntax
// LOCAL imports
import Styles from './DatePicker.less';
import { IconButton, Text, FocusTrap } from '..';
import { calendarIcon } from '../../../assets/icons/svgPaths';
import { isEnterKey, isArrowKeys, keyCodes } from '../../utils/keyboardUtils';

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);

    let pickerMoment;

    if (props.range) {
      pickerMoment = props.value
        ? {
            start: moment(props.value[0]),
            end: moment(props.value[1])
          }
        : { start: moment().startOf('month'), end: moment().endOf('month') };
    } else {
      pickerMoment = props.value ? moment(props.value) : moment();
    }
    this.minPermittedDate = moment('1900-01-01');
    this.state = {
      moment: pickerMoment,
      selected: pickerMoment && props.value ? pickerMoment : '',
      minDate: moment(this.minDate),
      maxDate: moment(props.maxDate),
      format: props.displayFormat,
      error: props.error,
      isOpen: true
    };

    this.datePickerRef = null;
    this.manualDate =
      pickerMoment && props.value
        ? pickerMoment.format(props.displayFormat).toUpperCase()
        : '';
  }

  componentDidMount() {
    this.preparePicker();
    document.addEventListener('keydown', this.handleKeyListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyListener);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.error, this.props.error)) {
      this.setState({
        error: this.props.error
      });
    }
  }

  get minDate() {
    const minDate = moment(this.props.minDate);

    if (minDate.isValid()) {
      return minDate;
    }

    return this.minPermittedDate;
  }

  get pickerElement() {
    return ReactDOM.findDOMNode(this.datePickerRef).querySelector(
      '.datetime-picker'
    );
  }

  get pickerNavs() {
    return this.pickerElement.querySelectorAll('.calendar-nav');
  }

  get pickerTables() {
    return this.pickerElement.querySelectorAll('table');
  }

  get pickerActiveView() {
    return this.pickerElement.querySelector(
      '[class^="calendar-"]:not([class$="nav"]):not([style*="display: none"])'
    );
  }

  get pickerActiveNav() {
    return this.pickerActiveView.querySelector('.calendar-nav');
  }

  get pickerActiveTable() {
    return this.pickerActiveView.querySelector('table');
  }

  get pickerSelectedRow() {
    return this.pickerSelectedEl.parentNode;
  }

  get pickerSelectedEl() {
    return this.pickerActiveTable.querySelector('td[class$="selected"]');
  }

  get isPickerOpen() {
    return this.datePickerRef && this.datePickerRef.state.isOpen;
  }

  preparePicker = () => {
    if (this.pickerElement) {
      [...this.pickerNavs].forEach(nav =>
        [...nav.childNodes].forEach(node => (node.tabIndex = '0'))
      );
      [...this.pickerTables].forEach(table =>
        [...table.querySelectorAll('td')].forEach(
          node =>
            (node.tabIndex = node.classList.contains('selected') ? '0' : '-1')
        )
      );
      if (this.isPickerOpen) {
        this.pickerSelectedEl.focus();
      }
    }
  };

  changeSelectedDate = (prevDate, nextDate) => {
    nextDate.tabIndex = '0';
    nextDate.classList.add('selected');
    prevDate.tabIndex = '-1';
    prevDate.classList.remove('selected');
  };

  handleKeyListener = e => {
    if (this.isPickerOpen && e.keyCode === keyCodes.ESCAPE) {
      this.datePickerRef.togglePicker(false);
    }

    if (
      this.isPickerOpen &&
      this.pickerElement &&
      this.pickerElement.contains(e.target)
    ) {
      if (isArrowKeys(e.keyCode)) {
        e.preventDefault();
      }

      if (this.pickerActiveNav.contains(e.target) && isEnterKey(e.keyCode)) {
        e.target.click();
      }

      if (this.pickerActiveTable.contains(e.target)) {
        const weekDays = [...this.pickerSelectedRow.childNodes];
        const weekSelectedDay = this.pickerSelectedEl;
        const weekSelectedDayIndex = weekDays.indexOf(this.pickerSelectedEl);

        const nextWeek = this.pickerSelectedRow.nextSibling;
        const prevWeek = this.pickerSelectedRow.previousSibling;
        const nextDay = this.pickerSelectedEl.nextSibling;
        const prevDay = this.pickerSelectedEl.previousSibling;

        const afterWeekDay =
          nextWeek && nextWeek.childNodes[weekSelectedDayIndex];
        const beforeWeekDay =
          prevWeek && prevWeek.childNodes[weekSelectedDayIndex];
        const nextWeekFirstDay = nextWeek && nextWeek.childNodes[0];
        const prevWeekLastDay =
          prevWeek && prevWeek.childNodes[prevWeek.childNodes.length - 1];

        switch (e.keyCode) {
          case keyCodes.ARROW_DOWN:
            if (afterWeekDay && !afterWeekDay.classList.contains('disabled')) {
              if (afterWeekDay.classList.contains('next')) {
                afterWeekDay.click();
                this.datePickerRef.togglePicker(!this.isPickerOpen);
                this.preparePicker();
              } else {
                this.changeSelectedDate(weekSelectedDay, afterWeekDay);
              }
            }
            break;
          case keyCodes.ARROW_UP:
            if (
              beforeWeekDay &&
              !beforeWeekDay.classList.contains('disabled')
            ) {
              if (beforeWeekDay.classList.contains('prev')) {
                beforeWeekDay.click();
                this.datePickerRef.togglePicker(!this.isPickerOpen);
                this.preparePicker();
              } else {
                this.changeSelectedDate(weekSelectedDay, beforeWeekDay);
              }
            }
            break;
          case keyCodes.ARROW_LEFT:
            if (prevDay && !prevDay.classList.contains('disabled')) {
              if (prevDay.classList.contains('prev')) {
                prevDay.click();
                this.datePickerRef.togglePicker(!this.isPickerOpen);
                this.preparePicker();
              } else {
                this.changeSelectedDate(weekSelectedDay, prevDay);
              }
            } else if (
              prevWeek &&
              !prevWeekLastDay.classList.contains('disabled')
            ) {
              if (prevWeekLastDay.classList.contains('prev')) {
                prevWeekLastDay.click();
                this.datePickerRef.togglePicker(!this.isPickerOpen);
                this.preparePicker();
              } else {
                this.changeSelectedDate(weekSelectedDay, prevWeekLastDay);
              }
            }
            break;
          case keyCodes.ARROW_RIGHT:
            if (nextDay && !nextDay.classList.contains('disabled')) {
              if (nextDay.classList.contains('next')) {
                nextDay.click();
                this.datePickerRef.togglePicker(!this.isPickerOpen);
                this.preparePicker();
              } else {
                this.changeSelectedDate(weekSelectedDay, nextDay);
              }
            } else if (
              nextWeek &&
              !nextWeekFirstDay.classList.contains('disabled')
            ) {
              if (nextWeekFirstDay.classList.contains('next')) {
                nextWeekFirstDay.click();
                this.datePickerRef.togglePicker(!this.isPickerOpen);
                this.preparePicker();
              } else {
                this.changeSelectedDate(weekSelectedDay, nextWeekFirstDay);
              }
            }
            break;
          case keyCodes.ENTER:
            this.pickerSelectedEl.click();
            break;
          default:
            break;
        }
      }
    }
  };

  onSelected = moment => {
    this.setState(prevState => {
      if (this.props.range) {
        this.props.onChange([moment.start.toDate(), moment.end.toDate()]);
        return Object.assign({}, prevState, { moment, selected: moment });
      }
      this.props.onChange(moment.toDate());
      this.manualDate = moment.format(this.props.displayFormat).toUpperCase();
      return Object.assign({}, prevState, {
        moment,
        selected: moment,
        error: false
      });
    });
  };

  onTextKeyUp = ({ keyCode }) => {
    if (isEnterKey(keyCode)) {
      this.datePickerRef.togglePicker(!this.isPickerOpen);
      this.preparePicker();
    }
  };

  onTextChange = manualDate => {
    this.manualDate = manualDate;
  };

  onTextBlur = () => {
    // Check Valid Date against Formats
    this.setState(prevState => {
      let changes = {};
      if (moment(this.manualDate, this.props.displayFormat, true).isValid()) {
        let valueMoment = moment(this.manualDate, this.props.displayFormat);
        const minDate = this.state.minDate;
        const maxDate = this.props.maxDate;

        if (valueMoment > maxDate || valueMoment < minDate) {
          valueMoment = moment();
        }

        this.props.onChange(valueMoment.toDate());
        changes = {
          moment: valueMoment,
          selected: valueMoment,
          error: false,
          isOpen: false
        };
      } else {
        this.props.onChange(this.manualDate);
        changes = {
          moment: moment(),
          selected: null,
          isOpen: true
        };
      }
      return Object.assign({}, prevState, changes);
    });
  };

  render() {
    if (this.props.range) {
      return (
        <DatetimeRangePickerTrigger
          className={Styles.customDatePicker}
          moment={this.state.moment}
          closeOnSelectDay={true}
          showCalendarPicker={this.props.date}
          showTimePicker={this.props.time}
          minDate={this.state.minDate}
          maxDate={this.state.maxDate}
          disabled={this.props.disabled || this.props.readOnly}
          onChange={this.onSelected}
        >
          <Text
            value={
              this.state.selected &&
              this.state.selected.start &&
              this.state.selected.end &&
              `${this.state.selected.start.format(
                'YYYY-MM-DD HH:mm'
              )} - ${this.state.selected.end.format('YYYY-MM-DD HH:mm')}`
            }
            readOnly
          />
          <span className={Styles.calendarIcon}>
            <IconButton
              path={calendarIcon}
              className={Styles.calendarIconDim}
              datauitestid={
                this.props.datauitestid ? this.props.datauitestid : null
              }
            />
          </span>
        </DatetimeRangePickerTrigger>
      );
    }
    return (
      <FocusTrap disabled={!this.isPickerOpen}>
        <DatetimePickerTrigger
          className={Styles.customDatePicker}
          moment={this.state.moment}
          closeOnSelectDay={true}
          showCalendarPicker={this.props.date}
          showTimePicker={this.props.time}
          minDate={this.state.minDate}
          maxDate={this.state.maxDate}
          disabled={this.props.disabled || this.props.readOnly}
          onChange={this.onSelected}
          isOpen={this.state.isOpen}
          ref={x => (this.datePickerRef = x)}
        >
          <Text
            value={
              this.state.selected &&
              this.state.selected.format(this.state.format).toUpperCase()
            }
            readOnly={this.props.readOnly}
            disabled={this.props.disabled}
            error={this.state.error}
            errorMsg={this.props.errorMsg}
            placeholder={this.props.placeholder}
            throttleTime={0}
            onChange={this.onTextChange}
            onBlur={this.onTextBlur}
            onKeyUp={this.onTextKeyUp}
          />
          <span
            className={[
              Styles.calendarIcon,
              this.props.disabled || this.props.readOnly
                ? Styles.disabled
                : null
            ].join(' ')}
            datauitestid={
              this.props.datauitestid ? this.props.datauitestid : null
            }
          >
            <IconButton
              path={calendarIcon}
              className={Styles.calendarIconDim}
              enabled={!this.props.disabled && !this.props.readOnly}
            />
          </span>
        </DatetimePickerTrigger>
      </FocusTrap>
    );
  }
}

DatePicker.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  time: PropTypes.bool,
  date: PropTypes.bool,
  range: PropTypes.bool,
  minDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  maxDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  styles: PropTypes.object,
  errorMsg: PropTypes.string,
  placeholder: PropTypes.string,
  displayFormat: PropTypes.string
};

DatePicker.defaultProps = {
  name: null,
  value: undefined,
  time: false,
  date: true,
  range: false,
  minDate: '01-01-2000',
  maxDate: null,
  required: false,
  readOnly: false,
  disabled: false,
  onChange: () => {},
  error: false,
  styles: {},
  errorMsg: null,
  placeholder: null,
  displayFormat: 'YYYY-MM-DD HH:mm'
};
