import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Container,
    Grid,
    IconButton,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Chip,
    Box,
    InputAdornment,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function Promotion() {
    const [menuItems, setMenuItems] = useState([]);
    const [menuTypes, setMenuTypes] = useState([]);
    const [formData, setFormData] = useState({
        promotionName: '',
        menuType: '',
        selectedFoodItems: [],
        discount: '',
        startDate: '',
        endDate: '',
        includeNoodleMenu: false, 
    });
    const [filteredItems, setFilteredItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMenuItems();
    }, []);

    useEffect(() => {
        if (menuItems.length > 0) {
            // Extract unique menu types from menuItems
            const uniqueTypes = [...new Set(menuItems.map(item => ({
                Menu_id: item.Menu_id,
                Menu_name: item.Menu_name
            })))];

            // Remove duplicates by Menu_id
            const uniqueTypesById = uniqueTypes.filter((type, index, self) =>
                index === self.findIndex(t => t.Menu_id === type.Menu_id)
            );

            setMenuTypes(uniqueTypesById);
        }
    }, [menuItems]);

    useEffect(() => {
        if (formData.menuType && menuItems.length > 0) {
            const filtered = menuItems.filter(item => item.Menu_id === formData.menuType);
            setFilteredItems(filtered);
        } else {
            setFilteredItems([]);
        }
    }, [formData.menuType, menuItems]);

    const fetchMenuItems = async () => {
        try {
            const response = await fetch('http://localhost:3333/getmenu');
            if (response.ok) {
                const data = await response.json();
                setMenuItems(data);
            } else {
                console.error('Failed to fetch menu items');
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handler for checkbox changes
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3333/addpromotion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('โปรโมชั่นถูกเพิ่มเรียบร้อยแล้ว');
                // Reset form
                setFormData({
                    promotionName: '',
                    menuType: '',
                    selectedFoodItems: [],
                    discount: '',
                    startDate: '',
                    endDate: '',
                    includeNoodleMenu: false,
                });
            } else {
                alert('เกิดข้อผิดพลาดในการเพิ่มโปรโมชั่น');
            }
        } catch (error) {
            console.error('Error adding promotion:', error);
            alert('เกิดข้อผิดพลาดในการเพิ่มโปรโมชั่น');
        }
    };

    return (
        <Container maxWidth="md">
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }} variant="h5" gutterBottom>เพิ่มโปรโมชั่น</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="ชื่อโปรโมชั่น"
                            name="promotionName"
                            value={formData.promotionName}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">เมนูอาหาร</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormGroup>
                            {menuTypes.map((type) => (
                                <FormControlLabel
                                    key={type.Menu_id}
                                    control={
                                        <Checkbox
                                            checked={formData.menuType?.includes(type.Menu_id) || false}
                                            onChange={(e) => {
                                                const newMenuType = e.target.checked
                                                    ? [...(formData.menuType || []), type.Menu_id]
                                                    : formData.menuType.filter((id) => id !== type.Menu_id);

                                                handleChange({
                                                    target: { name: "menuType", value: newMenuType },
                                                });
                                            }}
                                        />
                                    }
                                    label={type.Menu_name}
                                />
                            ))}
                        </FormGroup>
                    </Grid>

    
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.includeNoodleMenu}
                                    onChange={handleCheckboxChange}
                                    name="includeNoodleMenu"
                                />
                            }
                            label="เมนูก๋วยเตี๊ยว"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            {filteredItems.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name} - {item.price} บาท
                                </MenuItem>
                            ))}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="ส่วนลด (บาท)"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            fullWidth
                            required
                            type="number"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">บาท</InputAdornment>,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="วันที่เริ่มต้น"
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="วันที่สิ้นสุด"
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button type='submit' variant='contained' color='primary' fullWidth>
                            เพิ่มโปรโมชั่น
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default Promotion;