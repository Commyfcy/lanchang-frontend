import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Title from './Title';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function NoodleTypeStats() {
    const [stats, setStats] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3333/allnoodletypes')
            .then(response => {
                if (!response.ok) throw new Error('ไม่มีการตอบสนอง');
                return response.json();
            })
            .then(data => {
                setStats(data);
            })
            .catch(error => {
                console.error('ไม่สามารถโหลดข้อมูลได้:', error);
            });
    }, []);

    return (
        <Container maxWidth="md">
            <Box sx={{ height: '400px', textAlign: 'center' }}>
                <Title>สถิติการสั่งเส้น</Title>
                <ResponsiveContainer width="100%" height="70%">
                    <BarChart data={stats} margin={{ top: 5, left: 5, right: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis label={{ angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="order_count" fill="#FFA500" name="จำนวนการสั่ง" />
                    </BarChart>
                </ResponsiveContainer>
                <Typography color="text.secondary" sx={{ fontSize: 13, mt: 2 }}>
                    อัปเดตเมื่อวันที่ {new Date().toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </Typography>
            </Box>
        </Container>
    );
}