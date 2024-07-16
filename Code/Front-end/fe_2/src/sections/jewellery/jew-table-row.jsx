import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// eslint-disable-next-line import/no-extraneous-dependencies
import Barcode from 'react-barcode';
import InfoModal from './jew-modal';
import DelModal from './jew-del-modal';
import EditModal from './jew-edit-modal';

// ----------------------------------------------------------------------

export default function UserTableRow({ selected, onDelete, onUpdate, handleClick, row }) {
    const [open, setOpen] = useState(null);
    const [showDel, setShowDel] = useState(false);

    const handleCloseDel = () => setShowDel(false);
    const handleShowDel = () => setShowDel(true);

    const [showEd, setShowEd] = useState(false);

    const handleCloseEd = () => setShowEd(false);
    const handleShowEd = () => setShowEd(true);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={handleClick} />
                </TableCell>
                <TableCell>
                    <img
                        src={`http://localhost:5188/api/File/image/${row.previewImage}?type=1&width=50&height=50`}
                        alt={row.name}
                        style={{ width: 50, height: 50, borderRadius: 8 }}
                    />
                </TableCell>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.warrantyTime}</TableCell>
                <TableCell>{row.jewelryPrice}</TableCell>
                <TableCell>{row.laborCost}</TableCell>
                <TableCell>
                    <Barcode value={row.barcode} height={30} />
                </TableCell>

                <TableCell align="right">
                    <Button variant="outline-primary" onClick={handleShow}>
                        More Info
                    </Button>
                    <IconButton onClick={handleOpenMenu}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <Popover
                open={!!open}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: { width: 140 },
                }}
            >
                <MenuItem
                    onClick={() => {
                        handleCloseMenu();
                        handleShowEd();
                    }}
                >
                    <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} onClick={handleShowEd} />
                    Edit
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        handleCloseMenu();
                        handleShowDel();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} onClick={handleShowDel} />
                    Delete
                </MenuItem>
            </Popover>

            {show && <InfoModal show={show} handleClose={handleClose} row={row} />}

            {showDel && (
                <DelModal
                    show={showDel}
                    handleClose={handleCloseDel}
                    row={row}
                    onDelete={onDelete}
                />
            )}

            {showEd && (
                <EditModal
                    show={showEd}
                    handleClose={handleCloseEd}
                    row={row}
                    onUpdate={onUpdate}
                />
            )}
        </>
    );
}

UserTableRow.propTypes = {
    handleClick: PropTypes.func,
    selected: PropTypes.any,
    onDelete: PropTypes.func,
    onUpdate: PropTypes.func,
    row: PropTypes.object,
};
