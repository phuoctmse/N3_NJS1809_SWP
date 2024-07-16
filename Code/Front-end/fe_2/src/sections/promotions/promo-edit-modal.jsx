import React,{useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

function PromotionEditForm({ open, onClose, onSubmit, promotion }) {
  const [formState, setFormState] = React.useState({
    ...promotion,
    startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : '',
    endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : '',
  });
  const [promotions, setPromotions] = React.useState([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      const response = await axios.get('http://localhost:5188/api/Promotion/GetPromotions');
      setPromotions(response.data);
    };

    fetchPromotions();
  }, []);

  React.useEffect(() => {
    if (promotion) {
      setFormState({
        ...promotion,
        startDate: promotion.startDate
          ? new Date(promotion.startDate).toISOString().split('T')[0]
          : '',
        endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : '',
      });
    }
  }, [promotion]);

  const handleChange = (event) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
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
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Promotion</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="description"
          label="Promotion"
          value={formState.description}
          type="text"
          fullWidth
          onChange={handleChange}
          InputProps={{ style: { marginBottom: 10 } }}
        />
        <TextField
          margin="dense"
          name="startDate"
          label="Start Date"
          value={formState.startDate}
          type="date"
          fullWidth
          onChange={handleChange}
          InputProps={{ style: { marginBottom: 10 } }}
        />
        <TextField
          margin="dense"
          name="endDate"
          value={formState.endDate}
          label="End Date"
          type="date"
          fullWidth
          onChange={handleChange}
          InputProps={{ style: { marginBottom: 10 } }}
        />
        <TextField
          margin="dense"
          name="discountRate"
          label="Discount Rate"
          value={formState.discountRate}
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

PromotionEditForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  promotion: PropTypes.shape({
    promotionId: PropTypes.any,
    type: PropTypes.string,
    discountRate: PropTypes.number,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    approveManager: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default PromotionEditForm;
