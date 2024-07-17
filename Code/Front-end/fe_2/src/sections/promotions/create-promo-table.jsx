  import React, { useEffect } from 'react';
  import PropTypes from 'prop-types';
  import axios from 'axios';
  import { toast } from 'react-toastify';

  import Dialog from '@mui/material/Dialog';
  import Button from '@mui/material/Button';
  import TextField from '@mui/material/TextField';
  import DialogTitle from '@mui/material/DialogTitle';
  import DialogActions from '@mui/material/DialogActions';
  import DialogContent from '@mui/material/DialogContent';

  function PromotionForm({ open, onClose, onSubmit }) {
    const initialFormState = {
      discountRate: '',
      startDate: '',
      endDate: '',
      approveManager: '',
      description: '',
    };

    const [formState, setFormState] = React.useState(initialFormState);
    const [promotions, setPromotions] = React.useState([]);
    const [errors, setErrors] = React.useState({});

    useEffect(() => {
      const fetchPromotions = async () => {
        try {
          const response = await axios.get('http://localhost:5188/api/Promotion/GetPromotions');
          setPromotions(response.data);
        } catch (error) {
          toast.error('Failed to fetch promotions');
        }
      };

      fetchPromotions();
    }, []);

    const handleChange = (e) => {
      const { name, value } = e.target;
      
      setFormState({ ...formState, [name]: value });
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
    };

    const validateForm = () => {
      const tempErrors = {};
      tempErrors.description = formState.description ? "" : "Description is required";
      tempErrors.startDate = formState.startDate ? "" : "Start date is required";
      tempErrors.endDate = formState.endDate ? "" : "End date is required";
      const discountRate = parseFloat(formState.discountRate);
    if (!formState.discountRate) {
      tempErrors.discountRate = "Discount rate is required";
    } else if (Number.isNaN(discountRate) || discountRate <= 0 || discountRate >= 100) {
      tempErrors.discountRate = "Discount rate must be a number greater than 0 and less than 100";
    }

        // Check if startDate is equal to endDate
        if (formState.startDate === formState.endDate) {
          tempErrors.endDate = "End date must be different from start date";
        }
        
      setErrors(tempErrors);
      return Object.values(tempErrors).every(x => x === "");
    }

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!validateForm()) {
        toast.error("Please fill all required fields");
        return;
      }

      const startDateObj = new Date(formState.startDate);
      const endDateObj = new Date(formState.endDate);
      const currentDate = new Date();

      currentDate.setHours(0, 0, 0, 0);



      if (startDateObj < currentDate || endDateObj < currentDate) {
        toast.error("Start date and end date cannot be in the past.");
        return;
      }

      if ( endDateObj < startDateObj ) {
        toast.error("End date cannot be after start .");
        return;
      }


      const formDiscountRate = parseFloat(formState.discountRate);

      const isOverlapping = promotions.some((promo) => {
        const promoDiscountRate = parseFloat(promo.discountRate);
        
        if (promoDiscountRate !== formDiscountRate ) {
          return false; // Không kiểm tra trùng lặp nếu discountRate khác nhau
        }

        const existingStartDate = new Date(promo.startDate);
        const existingEndDate = new Date(promo.endDate);


        return (
          (startDateObj >= existingStartDate && startDateObj <= existingEndDate) ||
          (endDateObj >= existingStartDate && endDateObj <= existingEndDate) ||
          (startDateObj <= existingStartDate && endDateObj >= existingEndDate)
        );
      });

      if (isOverlapping) {
        toast.error("A promotion with the same discount rate already exists for this period.");
        return;
      }

      onSubmit(formState);
      setFormState(initialFormState);
      onClose();
      toast.success("Promotion added successfully!");
    };

    return (
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Promotion</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="description"
            label="Promotion"
            type="text"
            fullWidth
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            InputProps={{ style: { marginBottom: 10 } }}
          />
          <TextField
            margin="dense"
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            onChange={handleChange}
            error={!!errors.startDate}
            helperText={errors.startDate}
            InputProps={{ style: { marginBottom: 10 } }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="endDate"
            label="End Date"
            type="date"
            fullWidth
            onChange={handleChange}
            error={!!errors.endDate}
            helperText={errors.endDate}
            InputProps={{ style: { marginBottom: 10 } }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="discountRate"
            label="Discount Rate"
            type="number"
            fullWidth
            onChange={handleChange}
            error={!!errors.discountRate}
            helperText={errors.discountRate}
            InputProps={{ style: { marginBottom: 10 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    );
  }

  PromotionForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  export default PromotionForm;