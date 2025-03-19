import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';

export default function TotalOrder() {
  const [totalOrders, setTotalOrders] = React.useState(0);

  React.useEffect(() => {
    const fetchTotalOrders = async () => {
      try {
        const response = await fetch('http://localhost:3333/getordertotal');
        if (!response.ok) {
          throw new Error('ไม่สามารถเชื่อมต่อได้');
        }
        const data = await response.json();
        setTotalOrders(data.total || 0);
      } catch (error) {
        console.error('ไม่สามารถรับข้อมูลได้', error);
        setTotalOrders('Error');
      }
    };
    fetchTotalOrders();
  }, []);

  return (
    <div>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Title>ออเดอร์ทั้งหมด</Title>
          <Typography component="p" variant="h4">
            {typeof totalOrders === 'number' ? `${totalOrders.toLocaleString()} ออเดอร์` : totalOrders}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            ออเดอร์ล่าสุดเมื่อวันที่ {new Date().toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>
      </Container>
    </div>
  );
}
