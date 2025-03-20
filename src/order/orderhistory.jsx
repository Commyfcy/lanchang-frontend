import React, { useState, useEffect } from 'react';
import { Navbarow } from "../owner/Navbarowcomponent/navbarow/index-ow";
import {
  FormControlLabel,
  Checkbox

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

function OrderDisplay() {
  const [orders, setOrders] = useState([]);
  const [noodleMenu, setNoodleMenu] = useState([]);
  const [otherMenu, setOtherMenu] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [soups, setSoups] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [meats, setMeats] = useState([]);
  const [noodleTypes, setNoodleTypes] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectAll, setSelectAll] = useState({});
  
  
  const handleCheckboxChange = (orderId, itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [itemId]: !prev[orderId]?.[itemId]
      }
    }));

    // Update selectAll state based on whether all items are checked
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
    setSelectAll(prev => ({
      ...prev,
      [orderId]: allItemsChecked
    }));
  };


  const handleSelectAllChange = (orderId) => {
    const order = orders.find(o => o.Order_id === orderId);
    const newSelectAllValue = !selectAll[orderId];

    setSelectAll(prev => ({
      ...prev,
      [orderId]: newSelectAllValue
    }));

    const newCheckedItems = {
      ...checkedItems,
      [orderId]: order.details.reduce((acc, item) => ({
        ...acc,
        [item.Order_detail_id]: newSelectAllValue
      }), {})
    };

    setCheckedItems(newCheckedItems);
  };

  const handleUpdateSelected = async (orderId) => {
    const selectedItems = Object.entries(checkedItems[orderId] || {})
      .filter(([_, isChecked]) => isChecked)
      .map(([itemId]) => itemId);

    if (selectedItems.length === 0) {
      alert('กรุณาเลือกรายการที่ต้องการอัปเดต');
      return;
    }

    try {
      await Promise.all(
        selectedItems.map(itemId =>
          fetch(`http://localhost:3333/updateorderstatus/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 4 })
          })
        )
      );

      // Update local state
      setOrders(prev => prev.map(order => {
        if (order.Order_id === orderId) {
          return {
            ...order,
            details: order.details.filter(
              detail => !selectedItems.includes(detail.Order_detail_id.toString())
            )
          };
        }
        return order;
      }).filter(order => order.details.length > 0));

      // Reset checkbox states
      setCheckedItems(prev => ({
        ...prev,
        [orderId]: {}
      }));
      setSelectAll(prev => ({
        ...prev,
        [orderId]: false
      }));

      alert('อัปเดตสถานะเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error updating orders:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMenus();
    fetchAllData();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3333/getpreparingorders');
      if (response.ok) {
        const data = await response.json();
        console.log('All orders:', data);

        const allOrders = [];

        for (const order of data) {
          console.log(`\nProcessing Order ID: ${order.Order_id}`);
          console.log('Order timestamp:', order.Order_datetime);

          const detailsResponse = await fetch(`http://localhost:3333/getorderdetail/${order.Order_id}`);
          const details = await detailsResponse.json();
          setNoodleMenu(details);
          console.log('Order details:', details);

          const preparingDetails = details.filter(item => item.status_id === 3);
          const groupedByTimestamp = {};

          preparingDetails.forEach(detail => {
            const timestamp = detail.timestamp || Date.now();

            console.log(`Detail ID: ${detail.Order_detail_id}, Timestamp: ${timestamp}`);

            if (!groupedByTimestamp[timestamp]) {
              groupedByTimestamp[timestamp] = [];
            }
            groupedByTimestamp[timestamp].push(detail);
          });

          console.log('Grouped by timestamp:', groupedByTimestamp);

          // Create separate orders for each timestamp
          Object.entries(groupedByTimestamp).forEach(([timestamp, items]) => {
            console.log(`Creating order group for timestamp: ${timestamp}`);
            console.log('Items in this group:', items);

            allOrders.push({
              ...order,
              Order_datetime: timestamp,
              details: items,
              uniqueKey: `${order.Order_id}-${timestamp}`
            });
          });
        }

        const sortedOrders = allOrders
          .filter(order => order.details.length > 0)
          .sort((a, b) => new Date(a.Order_datetime) - new Date(b.Order_datetime));

        console.log('\nFinal sorted orders:', sortedOrders);
        setOrders(sortedOrders);
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

  const confirmUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3333/updateorderstatus/${updatingItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 4 }),
      });

      if (response.ok) {
        setOrders(prevOrders =>
          prevOrders.map(order => ({
            ...order,
            details: order.details.filter(item => item.Order_detail_id !== updatingItemId)
          })).filter(order => order.details.length > 0)
        );
        setOpenDialog(false);
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (!Array.isArray(noodleMenu) || !Array.isArray(otherMenu)) {
    return <div>Loading menus...</div>;
  }


  
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

  const renderOrders = () => {
    if (orders.length === 0) {
      return <h2 style={{ textAlign: 'center' }}>ไม่มีรายการออเดอร์สั่ง</h2>;
    }

    return orders.map((order) => (
      <div key={order.uniqueKey} style={styles.orderItem}>
        <div style={styles.orderHeader}>
          <h2>เลขออเดอร์: {order.Order_id}</h2>
          <h2>โต๊ะที่: {order.tables_id}</h2>
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectAll[order.Order_id] || false}
              onChange={() => handleSelectAllChange(order.Order_id)}
            />
          }
          label="เลือกทั้งหมด"
        />
        <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          เวลาสั่ง: {formatThaiDateTime(order.Order_datetime)}
        </p>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {order.details.map((item) => {
            const itemDetails = getItemDetails(item);
            return itemDetails ? (
              <li key={item.Order_detail_id} style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                padding: '1.5rem',
                margin: '1rem 0',
                borderRadius: '8px',
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
                  label=""
                />
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{itemDetails.name}</h2>
                  <div style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                    {item.Order_detail_quantity} รายการ
                  </div>
                  {item.Order_detail_additional && (
                    <div style={{ fontSize: '1.3rem', color: 'gray', marginBottom: '0.5rem' }}>
                      เพิ่มเติม: {item.Order_detail_additional}
                    </div>
                  )}
                  <div style={{
                    fontSize: '1.4rem',
                    marginBottom: '0.5rem',
                    color: item.Order_detail_takehome ? 'red' : 'darkgreen'
                  }}>
                    {item.Order_detail_takehome ? 'รับกลับบ้าน' : 'ทานที่ร้าน'}
                  </div>
                </div>
              </li>
            ) : null;
          })}
        </ul>
        <button
          onClick={() => handleUpdateSelected(order.Order_id)}
          disabled={!Object.values(checkedItems[order.Order_id] || {}).some(Boolean)}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            marginTop: '1rem',
            opacity: Object.values(checkedItems[order.Order_id] || {}).some(Boolean) ? 1 : 0.5
          }}
        >
          อัปเดตสถานะทั้งหมด
        </button>
      </div>
    ));
  };

  return (
    <div style={styles.orderPage}>
      <Navbarow />
      <div style={styles.orderContainer}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>รายการออเดอร์ที่สั่ง</h1>
        {renderOrders()}
      </div>

      {openDialog && (
        <div style={styles.dialog}>
          <div style={styles.dialogContent}>
            <h2>ยืนยันการอัปเดตสถานะ</h2>
            <p>คุณต้องการอัปเดตสถานะเป็น "เสิร์ฟแล้ว" ใช่หรือไม่?</p>
            <div style={styles.dialogButtons}>
              <button onClick={() => setOpenDialog(false)} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem' }}>ยกเลิก</button>
              <button onClick={confirmUpdate} style={{ ...styles.updateButton, padding: '0.5rem 1rem' }}>
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDisplay;
