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

function CustomerEditForm({ open, onClose, onSubmit, customer }) {
  const [formState, setFormState] = React.useState({
    ...customer,
  });

  React.useEffect(() => {
    if (customer) {
      setFormState({
        ...customer,
      });
    }
  }, [customer]);

  const validate = () => {
    if (!formState.code) {
      toast.error('Code is required');
      return false;
    }
    if (!customer || customer.length === 0) {
      return true; // Không có dữ liệu khách hàng, không kiểm tra trùng lặp
    }
    // if(!formState.code.match(/^[A-Z]{2}\d{4}$/)) {
    //   toast.error('Code is not valid');
    //   return false;
    // }
    if (customer.some(cust => cust.code === formState.code && cust.id !== formState.id)) {
      toast.error('Code already exists');
      return false;
    }
    if (!formState.fullName) {
      toast.error('Full Name is required');
      return false;
    }
    if (formState.fullName.trim().split(' ').length < 2) {
      toast.error('Full Name must contain at least 2 words');
      return false;
    }
    if (!formState.address) {
      toast.error('Address is required');
      return false;
    }
    if (formState.address.trim().length < 2) {
      toast.error('Address must contain at least 2 characters ');
      return false;
    }
    if (!formState.phone) {
      toast.error('Phone number is required');
      return false;
    }
    if (!formState.phone.match(/^\d{10}$/)) {
      toast.error('Phone number is not valid');
      return false;
    }
    return true;
  };


  const handleChange = (event) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formState);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Customer</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="code"
          label="Code"
          type="text"
          fullWidth
          onChange={handleChange}
          value={formState.code}
        />
        <TextField
          margin="dense"
          name="fullName"
          label="Full Name"
          value={formState.fullName}
          type="text"
          fullWidth
          onChange={handleChange}
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

CustomerEditForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  customer: PropTypes.object,
};

export default CustomerEditForm;
