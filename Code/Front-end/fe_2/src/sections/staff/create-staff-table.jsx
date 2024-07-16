import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { InputLabel, FormControl, Autocomplete } from '@mui/material';

function StaffForm({ open, onClose, onSubmit, counterIdParam }) {
    const [counters, setCounters] = useState([]);
    const initialFormState = {
        userId: '',
        roleId: '3',
        fullName: '',
        phoneNumber: '',
        code: '',
        email: '',
        password: '',
        counterId: counterIdParam || '',
        status: 'true',
        gender: 'Male',
    };

    const [formState, setFormState] = useState(initialFormState);

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn chặn hành động submit mặc định của form
        formState.roleId = parseInt(formState.roleId, 10);
        formState.counterId = parseInt(formState.counterId, 10);
        formState.status = formState.status === 'true';
        delete formState.userId;
        await onSubmit(formState, () => {
            setFormState(initialFormState); // Clear các trường của form sau khi submit
        });
    };

    const fetchCounters = async () => {
        const response = await fetch('http://localhost:5188/api/Counter/GetCounters');
        const data = await response.json();
        const res = data.map((item) => ({ label: item.name, value: item.counterId }));
        setCounters(res);
    };

    useEffect(() => {
        fetchCounters();
    }, []);

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogContent>
                <TextField
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
                    type="text"
                    fullWidth
                    onChange={handleChange}
                    value={formState.fullName}
                />

                <TextField
                    margin="dense"
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    onChange={handleChange}
                    value={formState.password}
                />

                <FormControl fullWidth margin="dense">
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                        labelId="gender-label"
                        name="gender"
                        label="Role"
                        value={formState.gender}
                        onChange={handleChange}
                    >
                        <MenuItem value="Male">Male </MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    margin="dense"
                    name="phoneNumber"
                    label="Phone Number"
                    type="text"
                    fullWidth
                    onChange={handleChange}
                    value={formState.phoneNumber}
                />

                <TextField
                    margin="dense"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    onChange={handleChange}
                    value={formState.email}
                />

                <FormControl fullWidth margin="dense">
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        name="roleId"
                        label="Role"
                        value={formState.roleId}
                        onChange={handleChange}
                    >
                        {/* <MenuItem value="1">Admin</MenuItem>
                        <MenuItem value="2">Manager</MenuItem> */}
                        <MenuItem value="3">Staff</MenuItem>
                    </Select>
                </FormControl>

                <Autocomplete
                    disablePortal
                    id="counterId"
                    options={counters}
                    // eslint-disable-next-line eqeqeq
                    value={counters.find((option) => option.value == formState.counterId) || null}
                    onChange={(event, newValue) => {
                        console.log('newValue', newValue);
                        setFormState({ ...formState, counterId: newValue.value });
                    }}
                    renderInput={(params) => <TextField {...params} label="Counter" />}
                />

                <FormControl fullWidth margin="dense">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        name="status"
                        label="Status"
                        value={formState.status}
                        onChange={handleChange}
                    >
                        <MenuItem value="true">Active</MenuItem>
                        <MenuItem value="false">Inactive</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}

StaffForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    counterIdParam: PropTypes.any,
};

export default StaffForm;
