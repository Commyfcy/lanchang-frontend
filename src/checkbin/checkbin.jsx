import React, { useState, useEffect } from 'react';
import { Navbarow } from '../owner/Navbarowcomponent/navbarow/index-ow';

import { useNavigate } from 'react-router-dom';

import {
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Input
} from '@mui/material';


const styles = {
  orderPage: {
    padding: '1rem',
  },
  orderContainer: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  orderItem: {
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1rem',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee',
  },
  updateButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
  },
  dialog: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    maxWidth: '400px',
    width: '100%',
  },
  dialogButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1rem',
  },
};

const buttonStyle = {
  padding: '0.5rem 1.25rem',
  color: 'white',
  fontWeight: '500',
  border: 'none',
  transitionDuration: '200ms',
  width: '70%',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  cursor: 'pointer',
  fontSize: '15px',
  backgroundColor: '#3b82f6',
  display:'flex',
  justifyContent:'center'
};

//////////////////////////////////////////////////////////

const OrderDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [soups, setSoups] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [meats, setMeats] = useState([]);
  const [noodleTypes, setNoodleTypes] = useState([]);
  const [noodleMenu, setNoodleMenu] = useState([]);
  const [otherMenu, setOtherMenu] = useState([]);
  const [cashAmount, setCashAmount] = useState('');
  const [showChange, setShowChange] = useState(false);
  const [changeAmount, setChangeAmount] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate();
  const HandleupdateOrder = () => {

    navigate('/updateServedOrder');
  }

  const calculateSelectedTotal = (orderId) => {
    const order = orders.find(o => o.Order_id === orderId);
    if (!order) return 0;

    return order.details.reduce((total, item) => {
      if (checkedItems[orderId]?.[item.Order_detail_id]) {
        return total + (item.Order_detail_price * item.Order_detail_quantity);
      }
      return total;
    }, 0);
  };

  const handleCheckboxChange = (orderId, itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [itemId]: !prev[orderId]?.[itemId]
      }
    }));

    const order = orders.find(o => o.Order_id === orderId);
    const updatedCheckedItems = {
      ...checkedItems,
      [orderId]: {
        ...checkedItems[orderId],
        [itemId]: !checkedItems[orderId]?.[itemId]
      }
    };

    const allItemsChecked = order.details.every(item =>
      updatedCheckedItems[orderId]?.[item.Order_detail_id]
    );
    setSelectAll(allItemsChecked);
  };


  const handleSelectAllChange = (orderId) => {
    const order = orders.find(o => o.Order_id === orderId);
    const newSelectAll = !selectAll;

    setSelectAll(newSelectAll);

    const newCheckedItems = {
      ...checkedItems,
      [orderId]: order.details.reduce((acc, item) => ({
        ...acc,
        [item.Order_detail_id]: newSelectAll
      }), {})
    };

    setCheckedItems(newCheckedItems);
  };

  const calculateCheckedItemsTotal = (orderId) => {
    const order = orders.find(o => o.Order_id === orderId);
    return order.details.reduce((total, item) => {
      if (checkedItems[orderId]?.[item.Order_detail_id]) {
        return total + (item.Order_detail_price * item.Order_detail_quantity);
      }
      return total;
    }, 0);
  };

  useEffect(() => {
    fetchOrders();
    fetchMenus();
    fetchAllData();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3333/getserveoder');
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const ordersWithDetails = await Promise.all(data.map(async (order) => {
          const detailsResponse = await fetch(`http://localhost:3333/getorderdetail/${order.Order_id}`);
          const details = await detailsResponse.json();
          console.log(details);
          setNoodleMenu(details.filter(item => item.status_id === 5));
          return { ...order, details: details.filter(item => item.status_id === 5) };

        }));
        const sortedOrders = ordersWithDetails
          .filter(order => order.details.length > 0)
          .sort((a, b) => new Date(a.Order_datetime) - new Date(b.Order_datetime));
        setOrders(sortedOrders);
      } else {
        console.error('Failed to fetch  orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchMenus = async () => {
    try {
      const otherRes = await
        fetch('http://localhost:3333/getmenu');
      const otherData = await (otherRes.json());
      setOtherMenu(otherData);
      console.log('Other Menu:', otherData);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const fetchAllData = async () => {
    try {
      const [soupRes, sizeRes, meatRes, noodleTypeRes] = await Promise.all([
        fetch('http://localhost:3333/soups'),
        fetch('http://localhost:3333/sizes'),
        fetch('http://localhost:3333/meats'),
        fetch('http://localhost:3333/noodletypes')
      ]);

      const [soupData, sizeData, meatData, noodleTypeData] = await Promise.all([
        soupRes.json(),
        sizeRes.json(),
        meatRes.json(),
        noodleTypeRes.json()
      ]);

      setSoups(soupData);
      setSizes(sizeData);
      setMeats(meatData);
      setNoodleTypes(noodleTypeData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getNoodleTypeName = (id) => {
    const noodle = noodleTypes.find(type => type.Noodle_type_id === id);
    return noodle ? noodle.Noodle_type_name : 'ไม่ระบุ';
  };

  const getSoupName = (id) => {
    const soup = soups.find(s => s.Soup_id === id);
    return soup ? soup.Soup_name : 'ไม่ระบุ';
  };

  const getMeatName = (id) => {
    const meat = meats.find(m => m.Meat_id === id);
    return meat ? meat.Meat_name : 'ไม่ระบุ';
  };

  const getSizeName = (id) => {
    const size = sizes.find(s => s.Size_id === id);
    return size ? size.Size_name : 'ไม่ระบุ';
  };

  function getMenuName(orderDetail) {
    if (!orderDetail) return 'ไม่ระบุ';

    const noodle_type_name = getNoodleTypeName(orderDetail.Noodle_type_id);
    const soup_name = getSoupName(orderDetail.Soup_id);
    const meat_name = getMeatName(orderDetail.Meat_id);
    const size_name = getSizeName(orderDetail.Size_id);

    return `${noodle_type_name} ${soup_name} ${meat_name} (${size_name})`;
  }

  const getItemDetails = (orderDetail) => {
    if (orderDetail) {
      // If the order includes a custom noodle dish
      if (orderDetail.Noodle_type_id || orderDetail.Soup_id || orderDetail.Meat_id || orderDetail.Size_id) {
        return {
          name: getMenuName(orderDetail),
          price: orderDetail.Price || 0, // Assuming price is stored in order_detail
        };
      }
      // If the order is from the standard menu
      else if (orderDetail.Menu_id && Array.isArray(otherMenu)) {
        const other = otherMenu.find(o => o.Menu_id === orderDetail.Menu_id);
        return other ? {
          name: other.Menu_name,
          price: orderDetail.Price || other.Menu_price,
        } : null;
      }
    }
    return null;
  };

  //ปุ่มชำระเงินเเต่ละรายการ

  const confirmUpdate = async () => {
    try {
      const currentOrder = orders.find(order =>
        order.details.some(item => item.Order_detail_id === updatingItemId)
      );

      if (!checkedItems[currentOrder.Order_id]?.[updatingItemId]) {
        alert('กรุณาเลือกรายการที่ต้องการชำระเงิน');
        return;
      }
      const response = await fetch(`http://localhost:3333/updateorderstatus/${updatingItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: `6` }),
      });

      if (response.ok) {
        setOrders(prevOrders =>
          prevOrders.map(order => ({
            ...order,
            details: order.details.filter(item => item.Order_detail_id !== updatingItemId)
          })).filter(order => order.details.length > 0)
        );
        setOpenDialog(false);
        alert('อัปเดตสถานะเรียบร้อยแล้ว');
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };
  const handlePayment = (orderId) => {
    setPayingOrderId(orderId);
    setOpenPaymentDialog(true);
    setPaymentMethod('3');
    setShowPaymentDetails(false);
  };

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
    if (method === 'promptpay' || method === 'cash') {
      setShowPaymentDetails(true);
    } else {
      setShowPaymentDetails(false);
    }
  };

  const handleClosePayment = () => {
    setOpenPaymentDialog(false);
    setPaymentMethod(null);
    setPayingOrderId('6');
    setShowPaymentDetails(false);
  };


  const calculateTotalPrice = (details) => {
    return details.reduce((total, item) => total + (item.Order_detail_price * item.Order_detail_quantity), 0);
  };

  const confirmPayment = async () => {
    try {
      const order = orders.find(o => o.Order_id === payingOrderId);
      if (!order) return;

      // กรองเอาเฉพาะรายการที่ถูกเลือก
      const selectedItems = order.details.filter(
        item => checkedItems[order.Order_id]?.[item.Order_detail_id]
      );

      if (selectedItems.length === 0) {
        alert('กรุณาเลือกรายการที่ต้องการชำระเงิน');
        return;
      }

      // อัพเดตสถานะการชำระเงินเฉพาะรายการที่เลือก
      await Promise.all(selectedItems.map(item =>
        fetch(`http://localhost:3333/updateorderstatus/${item.Order_detail_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 6 }),
        })
      ));

      // อัพเดตสถานะการชำระเงินของออเดอร์
      if (selectedItems.length === order.details.length) {
        // ถ้าเลือกทุกรายการ อัพเดตสถานะโต๊ะด้วย
        const orderResponse = await fetch(`http://localhost:3333/updateorderpayment/${payingOrderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 1 }),
        });

        if (orderResponse.ok) {
          const tableResponse = await fetch(`http://localhost:3333/updatetablestatus/${order.tables_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: '1' }),
          });

          if (!tableResponse.ok) {
            throw new Error('Failed to update table status');
          }
        }
      }

      // อัพเดท state ของ orders
      setOrders(prevOrders =>
        prevOrders.map(o => {
          if (o.Order_id === payingOrderId) {
            return {
              ...o,
              details: o.details.filter(
                item => !checkedItems[payingOrderId]?.[item.Order_detail_id]
              )
            };
          }
          return o;
        }).filter(order => order.details.length > 0)
      );

      // รีเซ็ต checkbox
      setCheckedItems(prev => ({
        ...prev,
        [payingOrderId]: {}
      }));

      handleClosePayment();
      alert('ชำระเงินเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะการชำระเงิน');
    }
  };

  const formatThaiDateTime = (dateTime) => {
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const date = new Date(dateTime);
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543 - 2500;
    const time = date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return `${day} ${month} ${year} ${time} น.`;
  };

  const handleCashPayment = (orderId) => {
    const cash = parseFloat(cashAmount);
    if (isNaN(cash)) {
      alert('กรุณากรอกจำนวนเงินให้ถูกต้อง');
      return;
    }

    // คำนวณยอดรวมของรายการที่เลือก
    const total = calculateSelectedTotal(orderId);

    if (total === 0) {
      alert('กรุณาเลือกรายการที่ต้องการชำระเงิน');
      return;
    }

    const change = cash - total;

    if (change < 0) {
      alert('จำนวนเงินไม่เพียงพอ');
      return;
    }

    setChangeAmount(change);
    setShowChange(true);
  };

  const renderPaymentDetails = () => {
    if (!showPaymentDetails) return null;

    const currentOrderId = updatingItemId ?
      orders.find(order => order.details.some(item => item.Order_detail_id === updatingItemId))?.Order_id :
      payingOrderId;

    const total = calculateSelectedTotal(currentOrderId);

    return (
      <div style={{ marginTop: '1rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '0.25rem' }}>
        {paymentMethod === 'cash' && (
          <>
            <h3>รายละเอียดการชำระเงิน</h3>
            <p>ยอดรวมที่ต้องชำระ: {total.toFixed(2)} บาท</p>
            <Input
              fullWidth
              label="จำนวนเงินที่รับ"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              type="number"
              style={{ marginBottom: '1rem' }}
            />
            <button
              onClick={() => handleCashPayment(currentOrderId)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              คำนวณเงินทอน
            </button>
          </>
        )}

        {showChange && (
          <Dialog open={showChange} onClose={() => setShowChange(false)}>
            <DialogTitle>เงินทอน</DialogTitle>
            <DialogContent>
              <p style={{ fontSize: '1.5rem' }}>
                เงินทอน: {changeAmount.toFixed(2)} บาท
              </p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setShowChange(false);

              }}>
                ตกลง
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    );
  };

  const PaymentDialog = ({ open, onClose }) => (
    <div style={styles.dialog}>
      <div style={styles.dialogContent}>
        <h2>เลือกวิธีการชำระเงิน</h2>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontWeight: 'bold' }}>
            ยอดรวมที่ต้องชำระ: {calculateSelectedTotal(payingOrderId).toFixed(2)} บาท
          </p>
        </div>
        <button
          onClick={() => handlePaymentSelection('cash')}
          style={{
            display: 'block',
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            backgroundColor: paymentMethod === 'cash' ? '#2196F3' : '#f0f0f0',
            color: paymentMethod === 'cash' ? 'white' : 'black'
          }}
        >
          เงินสด
        </button>
        <button
          onClick={() => handlePaymentSelection('promptpay')}
          style={{
            display: 'block',
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            backgroundColor: paymentMethod === 'promptpay' ? '#2196F3' : '#f0f0f0',
            color: paymentMethod === 'promptpay' ? 'white' : 'black'
          }}
        >
          พร้อมเพย์
        </button>

        {renderPaymentDetails()}

        <div style={styles.dialogButtons}>
          <button onClick={onClose} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem' }}>
            ยกเลิก
          </button>
          <button
            onClick={confirmPayment}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            ยืนยันการชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );


  return (
    <div>
      <Navbarow />
      <div style={styles.orderContainer}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>ชำระเงิน</h1>
        {orders.length === 0 ? (
          <h2 style={{ textAlign: 'center' }}>ไม่มีรายการชำระ</h2>
        ) : (
          orders.map((order) => (
            <div key={order.Order_id} style={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2>เลขออเดอร์: {order.Order_id}</h2>
                <h2>โต๊ะที่: {order.tables_id}</h2>
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={order.details.every(item => checkedItems[order.Order_id]?.[item.Order_detail_id])}
                    onChange={() => handleSelectAllChange(order.Order_id)}
                  />
                }
                label="เลือกทั้งหมด"
              />
              <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>เวลาสั่ง: {formatThaiDateTime(order.Order_datetime)}</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>

                {order.details.map((item) => {
                  const itemDetails = getItemDetails(item);
                  return itemDetails ? (
                    <li key={item.Order_detail_id} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'white',
                      padding: '0.1rem',
                      margin: '1rem 0',
                      borderRadius: '5px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      position: 'relative',
                      minHeight: '150px'
                    }}>
                      <FormControlLabel
                        style={{ margin: "1px" }}
                        control={
                          <Checkbox
                            checked={checkedItems[order.Order_id]?.[item.Order_detail_id] || false}
                            onChange={() => handleCheckboxChange(order.Order_id, item.Order_detail_id)}
                          />
                        }

                      />
                      <div>
                        <strong style={{ margin: "10px", fontSize: '1.3rem', marginBottom: '1rem' }}>{itemDetails.name}</strong>
                        <div style={{ margin: "10px", fontSize: '1rem' }}>
                          <div >
                            <strong>{item.Order_detail_quantity} รายการ </strong>
                          </div>
                          <div style={{ margin: "5px 0px" }}>
                            {item.Order_detail_price * item.Order_detail_quantity} บาท
                          </div>
                          <div style={{ margin: "5px 0px", color: 'gray' }}>
                            {item.Order_detail_additional && (
                              <>
                                <span>เพิ่มเติม : {item.Order_detail_additional}</span>
                              </>
                            )}
                          </div>
                          <div style={{ color: item.Order_detail_takehome ? "darkred" : "darkgreen" }}>
                            {(item.Order_detail_takehome) === 1 ? 'รับกลับบ้าน' : 'ทานที่ร้าน'}
                          </div>
                        </div>
                      </div>
                    </li>
                  ) : null;
                })}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '2px solid #eee', paddingTop: '1rem' }}>
                <h4>ราคารวมรายการที่เลือก:</h4>
                <h3>{calculateCheckedItemsTotal(order.Order_id).toFixed(2)} บาท</h3>
              </div>
              <button
                onClick={() => handlePayment(order.Order_id)}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', marginTop: '1rem' }}
              >
                ชำระรายการที่เลือก
              </button>
            </div>
          ))
        )}
      </div>




      {
        openPaymentDialog && (
          <PaymentDialog
            open={openPaymentDialog}
            onClose={handleClosePayment}
          />
        )
      }
      <div style={{
        justifyContent:'center',
        paddingTop: '10px',
        paddingBottom:'30px',
        display: 'flex',
        margin:'0 10%'
      }}>
        <button
          style={buttonStyle}
          onClick={HandleupdateOrder}
        >
          อัปเดตรายการอาหารลูกค้า
        </button>
      </div>
      
    </div >
  );
};

export default OrderDisplay;
