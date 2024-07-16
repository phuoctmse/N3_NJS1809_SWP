import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { toast } from 'react-toastify';

function CustomerForm({ open, onClose, onSubmit }) {
  const initialFormState = {
    code: '',
    fullName: '',
    address: '',
    phone: '',
    gender: 'Female',
  };

  const [formState, setFormState] = React.useState(initialFormState);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
    setFormState(initialFormState);
    onClose();
  };

  const handleChageFullName = (e) => {
    const code = e.target.value
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();

    setFormState({ ...formState, fullName: e.target.value, code });
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">New Customer</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="code"
          label="Code"
          value={formState.code}
          type="text"
          fullWidth
          onChange={handleChange}
          InputProps={{ style: { marginBottom: 10 } }}
        />
        <TextField
          margin="dense"
          name="fullName"
          label="Full Name"
          value={formState.fullName}
          type="text"
          fullWidth
          onChange={handleChageFullName}
          InputProps={{ style: { marginBottom: 10 } }}
        />
        <TextField
          margin="dense"
          name="address"
          label="Address"
          value={formState.address}
          type="text"
          fullWidth
          onChange={handleChange}
          InputProps={{ style: { marginBottom: 10 } }}
        />
        <TextField
          margin="dense"
          name="phone"
          label="Phone Number"
          value={formState.phone}
          type="text"
          fullWidth
          onChange={handleChange}
          InputProps={{ style: { marginBottom: 10 } }}
        />
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="gender"
            value={formState.gender}
            onChange={handleChange}
          >
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

CustomerForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CustomerForm;
