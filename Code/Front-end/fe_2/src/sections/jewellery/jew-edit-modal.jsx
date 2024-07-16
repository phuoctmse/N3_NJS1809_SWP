import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Row, Col, Modal, Button, Spinner } from 'react-bootstrap';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
// eslint-disable-next-line import/no-extraneous-dependencies
import Barcode from 'react-barcode';

export default function EditModal({ show, handleClose, onUpdate, row }) {
    const [goldtype, setGoldtype] = useState([]);
    const [gemtype, setGemtype] = useState([]);
    const [jewelryTypes, setJewelryTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([getGemPrices(), getGoldPrices(), getJewelleryTypes()]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getGoldPrices = async () => {
        try {
            const response = await axios.get('http://localhost:5188/api/Price/GetGoldPrices');
            const types = response.data.map((item) => ({ label: item.type, value: item.goldId }));
            setGoldtype(types);
        } catch (error) {
            console.error('Error fetching gold prices:', error);
        }
    };

    const getGemPrices = async () => {
        try {
            const response = await axios.get('http://localhost:5188/api/Price/GetGemPrices');
            const types = response.data.map((item) => ({ label: item.type, value: item.gemId }));
            setGemtype(types);
        } catch (error) {
            console.error('Error fetching gem prices:', error);
        }
    };

    const getJewelleryTypes = async () => {
        try {
            const response = await axios.get(
                'http://localhost:5188/api/JewelryType/GetJewelryTypes'
            );
            const jewelryOptions = response.data.map((item) => ({
                label: item.name,
                value: item.jewelryTypeId,
            }));
            setJewelryTypes(jewelryOptions);
        } catch (error) {
            console.error('Error fetching jewellery types:', error);
        }
    };

    const formik = useFormik({
        initialValues: {
            jewelryTypeId: row.jewelryTypeId,
            name: row.name,
            code: row.code,
            jewelryMaterial: {
                gemId: row.materials[0]?.gem.gemId,
                goldId: row.materials[0]?.gold.goldId,
                goldWeight: row.materials[0]?.gold.goldWeight,
                gemQuantity: row.materials[0]?.gem.gemQuantity,
                jewelryMaterialId: row.materials[0]?.jewelryMaterialId,
            },
            warrantyTime: row.warrantyTime || '', // Đảm bảo khởi tạo với giá trị chuỗi trống nếu không có giá trị
            barcode: row.barcode,
            laborCost: row.laborCost,
            previewImage: row.previewImage,
        },
        onSubmit: async (values) => {
            // Chuyển đổi warrantyTime thành số nguyên hoặc null
            const payload = {
                ...values,
                warrantyTime: values.warrantyTime ? parseInt(values.warrantyTime, 10) : null,
            };
    
            console.log(payload); // Log payload để kiểm tra
    
            await onUpdate(row.jewelryId, payload);
            handleClose();
        },
        validate: (values) => {
            const errors = {};
            const validateFields = [
                'name',
                'code',
                'laborCost',
                'barcode',
                'jewelryTypeId',
            ];
            validateFields.forEach((field) => {
                if (!values[field]) {
                    errors[field] = 'Required';
                }
            });
            // nếu trống gemId hoặc goldId thì báo lỗi
            if (!values.jewelryMaterial.gemId) {
                errors['jewelryMaterial.gemId'] = 'Required';
            }
            if (!values.jewelryMaterial.goldId) {
                errors['jewelryMaterial.goldId'] = 'Required';
            }
            return errors;
        },
    });
    
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('files', file);
            formData.append('type', 0);
            try {
                const response = await axios.post('http://localhost:5188/api/File', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.data.data && response.data.data.length > 0) {
                    const fileName = response.data.data[0];
                    formik.setFieldValue('previewImage', fileName);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    // Replace non-ASCII characters from the barcode
    const handleBarcodeChange = (event) => {
        // eslint-disable-next-line no-control-regex
        const value = event.target.value.replace(/[^\x00-\x7F]/g, '');
        formik.setFieldValue('barcode', value);
    };

    if (isLoading) {
        return (
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Loading...</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Spinner animation="border" />
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update New Jewellery</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <InputGroup className="mb-4 mt-3">
                                <FormControl fullWidth>
                                    <Form.Label>Upload Image</Form.Label>
                                    <Form.Control type="file" onChange={handleImageUpload} />
                                    {formik.values.previewImage && (
                                        <img
                                            src={`http://localhost:5188/api/File/image/${formik.values.previewImage
                                                }?type=${formik.values.previewImage !== row.previewImage
                                                    ? 0
                                                    : 1
                                                }`}
                                            alt="Preview"
                                            style={{ marginTop: '10px', maxWidth: '300px' }}
                                        />
                                    )}
                                </FormControl>
                            </InputGroup>
                        </Col>
                        <Col md={6}>
                            <Col md={12}>
                                <div>
                                    <Barcode value={formik.values.barcode} height={30} />
                                </div>
                                <div>
                                    <TextField
                                        className="mt-4"
                                        label="Barcode"
                                        name="barcode"
                                        value={formik.values.barcode}
                                        onChange={handleBarcodeChange}
                                        onBlur={formik.handleBlur}
                                        sx={{
                                            maxWidth: 300,
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'gray',
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col md={12}>
                                <TextField
                                    className="mt-4"
                                    label="Jewellery Code"
                                    variant="outlined"
                                    name="code"
                                    value={formik.values.code}
                                    onChange={(e) => {
                                        formik.setFieldValue('code', e.target.value.toUpperCase());
                                        formik.setFieldValue(
                                            'barcode',
                                            e.target.value.toUpperCase()
                                        );
                                    }}
                                    onBlur={formik.handleBlur}
                                    sx={{
                                        width: 300,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'gray',
                                            },
                                        },
                                    }}
                                />
                            </Col>
                            <Col md={12}>
                                <TextField
                                    className="mt-4"
                                    label="Jewellery Name"
                                    variant="outlined"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{
                                        width: 300,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'gray',
                                            },
                                        },
                                    }}
                                />
                            </Col>
                            <Col md={12}>
                                <TextField
                                    className="mt-4"
                                    label="Labor Cost"
                                    name="laborCost"
                                    value={formik.values.laborCost}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type="number"
                                    sx={{
                                        maxWidth: 300,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'gray',
                                            },
                                        },
                                    }}
                                />
                                <TextField
                                    className="mt-4"
                                    label="Warranty Time"
                                    name="warrantyTime"
                                    value={formik.values.warrantyTime}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type="number"
                                    InputProps={{ inputProps: { min: 0 } }} // Đảm bảo giá trị là số nguyên dương
                                    sx={{
                                        maxWidth: 300,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'gray',
                                            },
                                        },
                                    }}
                                />
                            </Col>
                        </Col>
                        <Col md={6}>
                            <InputGroup className="mb-4 mt-3">
                                <Form.Label>
                                    Gold Weight: {formik.values.jewelryMaterial.goldWeight} grams
                                </Form.Label>
                                <Form.Range
                                    className="custom-range"
                                    name="jewelryMaterial.goldWeight"
                                    min={0}
                                    max={2000}
                                    step={1}
                                    value={formik.values.jewelryMaterial.goldWeight}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{ width: '100%' }}
                                />
                            </InputGroup>
                            <InputGroup className="mb-4 mt-3">
                                <Autocomplete
                                    disablePortal
                                    id="goldtype-autocomplete"
                                    options={goldtype}
                                    value={goldtype.find(
                                        (option) =>
                                            option.value === formik.values.jewelryMaterial.goldId
                                    )}
                                    onChange={(event, value) =>
                                        formik.setFieldValue(
                                            'jewelryMaterial.goldId',
                                            value ? value.value : ''
                                        )
                                    }
                                    onBlur={formik.handleBlur}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Gold Type" />
                                    )}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={6}>
                            <InputGroup className="mb-4 mt-3">
                                <Form.Label>
                                    Gem Quantity: {formik.values.jewelryMaterial.gemQuantity} grams
                                </Form.Label>
                                <Form.Range
                                    className="custom-range"
                                    name="jewelryMaterial.gemQuantity"
                                    min={0}
                                    max={2000}
                                    step={1}
                                    value={formik.values.jewelryMaterial.gemQuantity}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{ width: '100%' }}
                                />
                            </InputGroup>
                            <InputGroup className="mb-4 mt-3">
                                <Autocomplete
                                    disablePortal
                                    id="gemtype-autocomplete"
                                    options={gemtype}
                                    value={gemtype.find(
                                        (option) =>
                                            option.value === formik.values.jewelryMaterial.gemId
                                    )}
                                    onChange={(event, value) =>
                                        formik.setFieldValue(
                                            'jewelryMaterial.gemId',
                                            value ? value.value : ''
                                        )
                                    }
                                    onBlur={formik.handleBlur}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Gem Type" />
                                    )}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={{ span: 6, offset: 6 }}>
                            <InputGroup className="mb-4 mt-3">
                                <Autocomplete
                                    disablePortal
                                    id="jewellerytype-autocomplete"
                                    options={jewelryTypes}
                                    value={
                                        jewelryTypes.find(
                                            (option) => option.value === formik.values.jewelryTypeId
                                        ) || null
                                    }
                                    onChange={(event, value) =>
                                        formik.setFieldValue(
                                            'jewelryTypeId',
                                            value ? value.value : ''
                                        )
                                    }
                                    onBlur={formik.handleBlur}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Jewellery Type" />
                                    )}
                                />
                            </InputGroup>
                        </Col>
                    </Row>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Update
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

EditModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    row: PropTypes.object.isRequired,
};
