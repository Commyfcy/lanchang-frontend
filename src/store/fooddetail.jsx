import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  MenuItem,
  Button,
  Container,
  Grid,
  Typography,
  IconButton,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function FoodDetail() {
  let { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    soupType: '',
    image: null
  });

  const [previewImage, setPreviewImage] = useState(null);

  const menuType = ['เครื่องดื่ม', "ของหวาน", "เมนูอื่น", "เครื่องเคียง"];

  useEffect(() => {
    fetchMenuDetails();
  }, [id]);

  const fetchMenuDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3333/getmenu/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.Menu_name,
          price: data.Menu_price,
          menuType: data.Menu_category,
        });
        setPreviewImage(`data:image/jpeg;base64,${data.Menu_picture}`);
      } else {
        console.error('Failed to fetch menu details');
      }
    } catch (error) {
      console.error('Error fetching menu details:', error);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = {
      Menu_name: formData.name,
      Menu_price: formData.price,
      Menu_category: formData.menuType
    }

    if (formData.image instanceof File) {
      const base64Image = await convertToBase64(formData.image);
      updateData.Menu_picture = base64Image;
    }

    try {
      const response = await fetch(`http://localhost:3333/updatemenu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          alert('อัปเดตเมนูสำเร็จ');
          navigate('/menupage');

        } else {
          alert('เกิดข้อผิดพลาดในการอัปเดตเมนู: ' + data.message);
        }
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตเมนู');
    }
  };
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <Container maxWidth="md">

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h4">รายละเอียดอาหาร</Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="ชื่อเมนูอาหาร"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="ราคา"
              name="price"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="ประเภท"
              name="menuType"
              value={formData.menuType || ''}
              onChange={handleChange}
              fullWidth
              required
            >
              {menuType.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <input
              accept="image/*"
              type="file"
              id="image-upload"
              onChange={handleImageChange}
              hidden
            />
            <label htmlFor="image-upload">
              <Button variant="contained" component="span">
                เปลี่ยนรูปภาพ
              </Button>
            </label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{ maxWidth: '100%', marginTop: '10px' }}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary">
                บันทึกการเปลี่ยนแปลง
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default FoodDetail;