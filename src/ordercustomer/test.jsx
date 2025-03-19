import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Menu from './menu';
import Noodle from './noodle';
import {
    AddMenuOrder,
    AddNoodleOrder,
    RemoveMenuOrder,
    RemoveNoodleOrder,
    UpdateMenuOrder,
    UpdateNoodleOrder,
} from '../slice/orderslice';

const Existordercustomer = () => {
    const dispatch = useDispatch();
    const [existingOrders, setExistingOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState({ MenuList: [], NoodleList: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExistingOrders = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3333/getorders');
                if (!response.ok) throw new Error('Failed to fetch orders');
                const data = await response.json();
                setExistingOrders(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchExistingOrders();
    }, []);

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
        setOrderItems({ MenuList: [], NoodleList: [] });
    };

    // Add menu item
    const addMenu = () => {
        setOrderItems(prev => ({
            ...prev,
            MenuList: [...prev.MenuList, { id: Date.now(), MenuId: null, Qty: 1, Price: 0, HomeDelivery: false, Additional: '' }]
        }));
    };

    // Add noodle item
    const addNoodle = () => {
        setOrderItems(prev => ({
            ...prev,
            NoodleList: [...prev.NoodleList, { id: Date.now(), NoodleComponent: null, Qty: 1, Price: 0, HomeDelivery: false, Additional: '' }]
        }));
    };

    // Remove menu item
    const removeMenu = (menuId) => {
        setOrderItems(prev => ({
            ...prev,
            MenuList: prev.MenuList.filter(item => item.id !== menuId)
        }));
    };

    // Remove noodle item
    const removeNoodle = (noodleId) => {
        setOrderItems(prev => ({
            ...prev,
            NoodleList: prev.NoodleList.filter(item => item.id !== noodleId)
        }));
    };

    // Update menu item
    const updateMenu = useCallback((menuId, ...data) => {
        setOrderItems(prev => ({
            ...prev,
            MenuList: prev.MenuList.map(item => 
                item.id === menuId 
                ? { ...item, ...Object.assign({}, ...data) }
                : item
            )
        }));
    }, []);

    // Update noodle item
    const updateNoodle = useCallback((noodleId, ...data) => {
        setOrderItems(prev => ({
            ...prev,
            NoodleList: prev.NoodleList.map(item => 
                item.id === noodleId 
                ? { ...item, ...Object.assign({}, ...data) }
                : item
            )
        }));
    }, []);

    // Submit additional items to order
    const submitAdditionalItems = async () => {
        if (!selectedOrder) {
            alert('โปรดเลือกออเดอร์ก่อน');
            return;
        }

        const { MenuList = [], NoodleList = [] } = orderItems;
        
        if (MenuList.length === 0 && NoodleList.length === 0) {
            alert('โปรดเพิ่มเมนูหรือก๋วยเตี๋ยวก่อน');
            return;
        }

        const confirm = window.confirm('ยืนยันการเพิ่มรายการอาหารหรือไม่');
        if (!confirm) return;

        try {
            const items = [
                ...MenuList.map(item => {
                    if (!item.MenuId) {
                        throw new Error('กรุณาเลือกเมนู');
                    }
                    return {
                        id: item.MenuId,
                        type: "menu",
                        quantity: parseInt(item.Qty),
                        price: item.Price,
                        homeDelivery: item.HomeDelivery ? 1 : 0,
                        additionalInfo: item.Additional || null,
                    };
                }),
                ...NoodleList.map(item => {
                    if (!item.NoodleComponent) {
                        throw new Error('กรุณาเลือกส่วนประกอบก๋วยเตี๋ยว');
                    }
                    return {
                        id: {
                            Noodle_type_id: item.NoodleComponent.noodleType,
                            Soup_id: item.NoodleComponent.soupType,
                            Meat_id: item.NoodleComponent.meatType,
                            Size_id: item.NoodleComponent.size,
                        },
                        type: "noodle",
                        quantity: parseInt(item.Qty),
                        price: item.Price,
                        homeDelivery: item.HomeDelivery ? 1 : 0,
                        additionalInfo: item.Additional || null,
                    };
                }),
            ];

            const response = await fetch(`http://localhost:3333/orders/${selectedOrder.Order_id}/add_items`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItems: items }),
            });

            if (!response.ok) throw new Error('เพิ่มรายการไม่สำเร็จ');
            const result = await response.json();
            console.log('Items added:', result);

            alert('เพิ่มรายการอาหารสำเร็จ!');
            setOrderItems({ MenuList: [], NoodleList: [] });
        } catch (error) {
            console.error('Error ordering', error);
            alert(`เกิดข้อผิดพลาด: ${error.message}`);
        }
    };

    // Helper function to get table status text
    const getStatusText = (statusId) => {
        const statuses = {
            1: "รอดำเนินการ",
            2: "กำลังปรุง",
            3: "พร้อมเสิร์ฟ",
            4: "เสิร์ฟแล้ว",
            5: "ชำระเงินแล้ว",
            6: "ยกเลิก"
        };
        return statuses[statusId] || "ไม่ทราบสถานะ";
    };

    // Format date helper
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('th-TH');
    };

    return (
        <div>
            <div style={{ padding: '20px' }}>
                <h2 style={{ textAlign: 'center', margin: '20px 0' }}>เพิ่มรายการอาหารในออเดอร์ที่มีอยู่</h2>
                
                {/* Order selection section */}
                <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
                    <h3>เลือกออเดอร์</h3>
                    
                    {loading ? (
                        <p>กำลังโหลดรายการออเดอร์...</p>
                    ) : error ? (
                        <p style={{ color: 'red' }}>เกิดข้อผิดพลาด: {error}</p>
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {existingOrders.map(order => (
                                <div 
                                    key={order.Order_id}
                                    onClick={() => handleSelectOrder(order)}
                                    style={{
                                        padding: '10px',
                                        border: selectedOrder && selectedOrder.Order_id === order.Order_id ? '2px solid #3b82f6' : '1px solid #ccc',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        backgroundColor: selectedOrder && selectedOrder.Order_id === order.Order_id ? '#e6f0ff' : 'white',
                                        minWidth: '200px'
                                    }}
                                >
                                    <p><strong>ออเดอร์ ID:</strong> {order.Order_id}</p>
                                    <p><strong>โต๊ะ:</strong> {order.tables_id}</p>
                                    <p><strong>วันเวลา:</strong> {formatDate(order.Order_datetime)}</p>
                                    <p><strong>สถานะ:</strong> {getStatusText(order.status_id)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order items section - only visible when an order is selected */}
                {selectedOrder && (
                    <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                        <h3>เพิ่มรายการอาหาร สำหรับโต๊ะ {selectedOrder.tables_id} (ออเดอร์ ID: {selectedOrder.Order_id})</h3>
                        
                        <div style={{ margin: '10px 0' }}>
                            <button 
                                onClick={addMenu} 
                                style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                เพิ่มเมนู
                            </button>
                            <button 
                                onClick={addNoodle}
                                style={{ padding: '8px 16px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                เพิ่มก๋วยเตี๋ยว
                            </button>
                        </div>

                        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px' }}>
                            {/* Menu items */}
                            {orderItems.MenuList.length > 0 && (
                                <div style={{ marginBottom: '20px' }}>
                                    <h4>รายการเมนู</h4>
                                    {orderItems.MenuList.map(item => (
                                        <div key={item.id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px', position: 'relative' }}>
                                            <button 
                                                onClick={() => removeMenu(item.id)} 
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    background: 'none',
                                                    color: 'black',
                                                    border: 'none',
                                                    fontSize: '20px',
                                                    width: '25px',
                                                    height: '25px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ✕
                                            </button>
                                            <Menu onSelect={(...menu) => updateMenu(item.id, ...menu)} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Noodle items */}
                            {orderItems.NoodleList.length > 0 && (
                                <div>
                                    <h4>รายการก๋วยเตี๋ยว</h4>
                                    {orderItems.NoodleList.map(item => (
                                        <div key={item.id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px', position: 'relative' }}>
                                            <button 
                                                onClick={() => removeNoodle(item.id)} 
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    background: 'none',
                                                    color: 'black',
                                                    border: 'none',
                                                    fontSize: '20px',
                                                    width: '25px',
                                                    height: '25px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ✕
                                            </button>
                                            <Noodle onSelect={(...noodle) => updateNoodle(item.id, ...noodle)} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {orderItems.MenuList.length === 0 && orderItems.NoodleList.length === 0 && (
                                <p style={{ textAlign: 'center', color: '#666' }}>ยังไม่มีรายการอาหาร กรุณาเพิ่มเมนูหรือก๋วยเตี๋ยว</p>
                            )}
                        </div>

                        {/* Submit button */}
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <button 
                                onClick={submitAdditionalItems}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#ff9800',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                            >
                                เพิ่มรายการอาหารเข้าออเดอร์
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Existordercustomer;