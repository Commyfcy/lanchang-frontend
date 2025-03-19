import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import Title from './Title';

const monthNames = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

export default function MonthlyRevenueChart() {
  const theme = useTheme();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const response = await fetch('http://localhost:3333/getMonthlyRevenue');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const revenueData = await response.json();

        const chartData = revenueData.map((item) => ({
          time: `${monthNames[item.month -1]} ${item.year + 543}`,
          amount: item.revenue,
        }));
        setData(chartData);
      } catch (error) {
        console.error('Error fetching monthly revenue:', error);
      }
    };

    fetchMonthlyRevenue();
  }, []);

  return (
    <React.Fragment>
      <Title>การเติบโตของรายได้ในทุกๆเดือน</Title>
      <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={data}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'time',
              tickLabelStyle: theme.typography.body2,
            },
          ]}
          yAxis={[
            {
              label: 'รายได้',
              labelStyle: {
                ...theme.typography.body1,
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2,
            },
          ]}
          series={[
            {
              dataKey: 'amount',
              showMark: true,
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
            [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translateX(-25px)',
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}
