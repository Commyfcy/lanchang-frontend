import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Container,
    Grid,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

function Meat() {
    const [meatData, setMeatData] = useState({ meat: '', price: '' });
    const [meats, setMeats] = useState([]);
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);

    useEffect(() => {
        fetchMeatTypes();
    }, []);

    const fetchMeatTypes = async () => {
        try {
            const response = await fetch('http://localhost:3333/meats');
            const data = await response.json();
            setMeats(data);
        } catch (error) {
            console.error('Error fetching Meats types:', error);
        }
    };

    const handleMeatChange = (e) => {
        const { name, value } = e.target;
        setMeatData({ ...meatData, [name]: value });
    };

    const handleSubmitMeat = async (e) => {
        e.preventDefault();
        if (!meatData.meat) {
            alert('กรุณาพิมพ์ชนิดเนื้อ');
            return;
        }
        
        if (!meatData.price || isNaN(meatData.price)) {
            alert('กรุณาใส่ราคาที่ถูกต้อง');
            return;
        }

        try {
            const response = await fetch('http://localhost:3333/addmeat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    meat: meatData.meat,
                    price: parseInt(meatData.price)
                })
            });
    
            const data = await response.json();
            if (response.status === 409) {
                alert('ชนิดเนื้อนี้มีอยู่แล้ว กรุณาพิมพ์ชนิดเนื้อใหม่');
            } else if (response.ok) {
                if (data.status === 'ok') {
                    alert('เพิ่มเนื้อสำเร็จ');
                    setMeatData({ meat: '', price: '' });
                    fetchMeatTypes();
                } else {
                    alert('เกิดข้อผิดพลาดในการเพิ่มเนื้อ: ' + data.message);
                }
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการเพิ่มชนิดเนื้อ');
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
    
        try {
            const response = await fetch(`http://localhost:3333/deleteMeat/${itemToDelete.Meat_id}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'ok') {
                    alert('ลบชนิดเนื้อสำเร็จ');
                    fetchMeatTypes();
                } else {
                    alert('เกิดข้อผิดพลาดในการลบชนิดเนื้อ: ' + data.message);
                }
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการลบชนิดเนื้อ');
        }
    
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    const handleEditClick = (item) => {
        setItemToEdit({...item});
        setEditDialogOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setItemToEdit({ ...itemToEdit, [name]: value });
    };

    const handleEditSubmit = async () => {
        if (!itemToEdit) return;

        if (!itemToEdit.Meat_name) {
            alert('กรุณาพิมพ์ชนิดเนื้อ');
            return;
        }
        
        if (!itemToEdit.Meat_price || isNaN(itemToEdit.Meat_price)) {
            alert('กรุณาใส่ราคาที่ถูกต้อง');
            return;
        }
        const isDuplicate = meats.some(item => 
            item.Meat_name.toLowerCase() === meatData.meat.toLowerCase()
        );
        
        if (isDuplicate) {
            alert('เนื้อนี้มีอยู่แล้ว กรุณาพิมพ์ใหม่');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3333/updatemeat/${itemToEdit.Meat_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    meat: itemToEdit.Meat_name,
                    price: parseInt(itemToEdit.Meat_price)
                })
            });

            if (response.ok) {
                alert('แก้ไขชนิดเนื้อสำเร็จ');
                fetchMeatTypes();
                setEditDialogOpen(false);
                setItemToEdit(null);
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการแก้ไขชนิดเนื้อ');
        }
    };

    return (
        <Container maxWidth="md">
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
            </IconButton>

            <Typography variant="h5" gutterBottom>เพิ่มชนิดเนื้อ</Typography>
            <form onSubmit={handleSubmitMeat}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="พิมพ์ชนิดเนื้อ"
                            name="meat"
                            value={meatData.meat}
                            onChange={handleMeatChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="ราคา"
                            name="price"
                            type="number"
                            value={meatData.price}
                            onChange={handleMeatChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            เพิ่มชนิดเนื้อ
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                ชนิดเนื้อที่มีอยู่
            </Typography>
            <List>
                {meats.map((type) => (
                    <ListItem key={type.Meat_id}>
                        <ListItemText 
                            primary={type.Meat_name} 
                            secondary={`${type.Meat_price} บาท`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => handleEditClick(type)}>
                                <EditIcon/>
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleDeleteClick(type)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>ยืนยันการลบ</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        คุณแน่ใจหรือไม่ที่จะลบ {itemToDelete?.Meat_name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>ยกเลิก</Button>
                    <Button onClick={handleDeleteConfirm} color="error">ลบ</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
            >
                <DialogTitle>แก้ไขชนิดเนื้อ</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} style={{ marginTop: '8px' }}>
                        <Grid item xs={12}>
                            <TextField
                                label="ชนิดเนื้อ"
                                name="Meat_name"
                                value={itemToEdit?.Meat_name || ''}
                                onChange={handleEditChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="ราคา"
                                name="Meat_price"
                                type="number"
                                value={itemToEdit?.Meat_price || ''}
                                onChange={handleEditChange}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>ยกเลิก</Button>
                    <Button onClick={handleEditSubmit} color="primary">บันทึก</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Meat;