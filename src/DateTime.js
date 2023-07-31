import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

export default function DateTime(props) {
  const [selectedDate, setDate] = useState(new Date());
  const handleDateChange = (d) => {
    setDate(d);
    props.onChange(d);
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DateTimePicker label="Expiration Date" style={{ width: "100%" }} value={selectedDate} onChange={handleDateChange} />
    </MuiPickersUtilsProvider>
  );
}