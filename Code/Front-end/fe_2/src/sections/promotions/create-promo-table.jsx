import React, { useEffect } from 'react'; 
import PropTypes from 'prop-types';
import axios from 'axios';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DatePicker from '@mui/lab/DatePicker';

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

  useEffect(() => {
    const fetchPromotions = async () => {
      const response = await axios.get('http://localhost:5188/api/Promotion/GetPromotions');
      setPromotions(response.data);
    };

    fetchPromotions();
  }, []);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành động submit mặc định của form
  
    // Chuyển startDate và endDate sang đối tượng Date
    const startDateObj = new Date(formState.startDate);
    const endDateObj = new Date(formState.endDate);
    const currentDate = new Date();
  
    // Đặt giờ, phút, giây, và mili giây về 0 để chỉ so sánh ngày
    currentDate.setHours(0, 0, 0, 0);
  
    // Kiểm tra điều kiện
    if (startDateObj < currentDate || endDateObj < currentDate) {
      alert("Start date and end date cannot be in the past.");
      return; // Dừng hàm nếu điều kiện không được thoả mãn
    }
  
    // Kiểm tra xem startDate và endDate của mã giảm giá mới có trùng với mã giảm giá nào hiện có không
    const isOverlapping = promotions.some((promo) => {
      const existingStartDate = new Date(promo.startDate);
      const existingEndDate = new Date(promo.endDate);
  
      return (
        (startDateObj >= existingStartDate && startDateObj <= existingEndDate) ||
        (endDateObj >= existingStartDate && endDateObj <= existingEndDate) ||
        (startDateObj <= existingStartDate && endDateObj >= existingEndDate)
      );
    });
  
    if (isOverlapping) {
      alert("The new promotion dates overlap with an existing promotion.");
      return; // Dừng hàm nếu điều kiện không được thoả mãn
    }
  
    onSubmit(formState); // Gọi addPromotion
    setFormState(initialFormState); // Clear các trường của form sau khi submit
    onClose();
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
          InputProps={{ style: { marginBottom: 10 } }}
        />
        <TextField
          margin="dense"
          name="startDate"
          label=""
          type="date"
          fullWidth
          onChange={handleChange}
          InputProps={{ style: { marginBottom: 10 } }}
        />
        <TextField
          margin="dense"
          name="endDate"
          label=""
          type="date"
          fullWidth
          onChange={handleChange}
          InputProps={{ style: { marginBottom: 10 } }}
        />
        <TextField
          margin="dense"
          name="discountRate"
          label="Discount Rate"
          type="text"
          fullWidth
          onChange={handleChange}
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
