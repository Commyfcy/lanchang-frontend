import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbarow } from "../owner/Navbarowcomponent/navbarow/index-ow";

const styles = {
  orderPage: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
  },
  orderContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    padding: '1rem',
    width: '95%',
    maxWidth: '1200px',
    margin: '20px auto',
  },
  orderItem: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    color: 'inherit',
  },
  orderInfo: {
    padding: '1rem',
  },
  orderInfoH3: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    color: '#333',
  },
  orderInfoP: {
    margin: '0.25rem 0',
    fontSize: '0.9rem',
    color: '#666',
  },
};

function OrderDisplay() {
  const [orders, setOrders] = useState([]);
  const [status, setstatus] = useState([]);

  useEffect(() => {
    fetchOrders();
    getstatus();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3333/getorders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getstatus = async () => {
    try {
      const [statuses] = await Promise.all([
        fetch('http://localhost:3333/getstatus')
      ]);
      const [statusdata] = await Promise.all([
        statuses.json(),
      ])
      setstatus(statusdata)
    } catch (error) {
      console.error('Error ', error);
    }
  };

  const statusname = (statusId) => {
    const foundStatus = status.find(s => s.status_id === statusId);
    return foundStatus ? foundStatus.status_name : 'ไม่ระบุ';

  };
  console.log(status);

  return (
    <div style={styles.orderPage}>
      <Navbarow />
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>ประวัติออเดอร์</h2>
      <div style={styles.orderContainer}>
        {orders.map((order) => (
          <Link to={`/historydetail/${order.Order_id}`} key={order.Order_id} style={styles.orderItem}>
            <div style={styles.orderInfo}>
              <h3 style={styles.orderInfoH3}>เลขออเดอร์: {order.Order_id}</h3>
              <p style={styles.orderInfoP}>โต๊ะที่: {order.tables_id}</p>
              <p style={styles.orderInfoP}>เวลาสั่ง: {new Date(order.Order_datetime).toLocaleString()}</p>
              <p style={styles.orderInfoP}>สถานะ: {statusname(order.status_id)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default OrderDisplay;