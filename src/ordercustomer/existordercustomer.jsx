import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Menu from './menu';
import Noodle from './noodle';
import { useEffect, useState } from 'react';
import {
    ExistCreateOrder,
    ExistAddMenuOrder,
    ExistAddNoodleOrder,
    ExistRemoveMenuOrder,
    ExistRemoveNoodleOrder,
    ExistUpdateMenuOrder,
    ExistUpdateNoodleOrder,
} from '../slice/existorderslice';

const Existordercustomer = () => {
    const [orders, setOrders] = useState([]);
    const [searchOrderId, setSearchOrderId] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const { createOrder } = useSelector((state) => state.existorders);

    useEffect(() => {
        const fetchExistOrders = async () => {
            try {
                const response = await fetch('http://localhost:3333/getorders');
                if (!response.ok) throw new Error('Failed to fetch orders');

                const data = await response.json();
                setOrders(data);
            } catch (err) {
                console.error('Error getting order data:', err);
            }
        };

        fetchExistOrders();
    }, []);


    const createBox = () => {
        dispatch(ExistCreateOrder([...createOrder, { id: Date.now(), MenuList: [], NoodleList: [] }]));
    };

    const closeBox = (id) => {
        if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการปิดออเดอร์?")) {
            dispatch(ExistCreateOrder(createOrder.filter(order => order.id !== id)));
        }
    };

    const handleSearchChange = (event) => {
        setSearchOrderId(event.target.value);
        setDropdownOpen(true);
    };

    const selectOrder = (order) => {
        console.log(order)
        setSearchOrderId(order.Order_id);
        setSelectedOrder(order.Order_id);
        setDropdownOpen(false);
    };

    const searchTerm = typeof searchOrderId === 'string' ? searchOrderId.trim().toLowerCase() : '';
    const filteredOrders = orders.filter(item => {
        const orderId = (item.Order_id || item.order_id || '').toString().toLowerCase();
        return orderId.includes(searchTerm);
    });

    const AddMenu = (orderId) => {
        dispatch(ExistAddMenuOrder({ orderId }));
    };

    const AddNoodle = (orderId) => {
        dispatch(ExistAddNoodleOrder({ orderId }));
    };

    const RemoveMenu = (orderId, menuId) => {
        dispatch(ExistRemoveMenuOrder({ orderId, menuId }));
    };

    const RemoveNoodle = (orderId, noodleId) => {
        dispatch(ExistRemoveNoodleOrder({ orderId, noodleId }));
    };

    const AllMenu = useCallback((orderId, menuId, ...data) => {
        dispatch(ExistUpdateMenuOrder({ orderId, menuId, data }));
    }, [dispatch]);

    const AllNoodle = useCallback((orderId, noodleId, ...data) => {
        dispatch(ExistUpdateNoodleOrder({ orderId, noodleId, data }));
    }, [dispatch]);

    const OrderMenu = async (order) => {
        const { MenuList = [], NoodleList = [] } = order;

        if (!selectedOrder) {
            alert('กรุณาเลือกออเดอร์ก่อน');
            return;
        }

        const confirm = window.confirm('ยืนยันการเพิ่มรายการในออเดอร์หรือไม่');
        console.log(selectedTableId);
        if (!confirm) return;

        try {
            const items = [
                ...MenuList.map(item => {
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
                        throw new Error('Missing NoodleComponent');
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

            const response = await fetch(`http://localhost:3333/orders/${selectedOrder}/add_items`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItems: items }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add items');
            }

            const result = await response.json();
            console.log('Items added:', result);

            alert('เพิ่มรายการในออเดอร์สำเร็จ!');


        } catch (error) {
            console.error('Error updating order:', error);
            alert(`เกิดข้อผิดพลาด: ${error.message}`);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>เพิ่มเมนูอาหารในออเดอร์</h1>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
                {createOrder.map(order => (
                    <div key={order.id} style={{
                        position: 'relative',
                        width: "400px",
                        height: "450px",
                        backgroundColor: "#f9f9f9",
                        border: "1px solid black",
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '10px',
                        padding: '20px',
                        flexDirection: 'column'
                    }}>
                        <button
                            onClick={() => closeBox(order.id)}
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
                            }}>
                            ✕
                        </button>

                        <div style={{ width: '100%', height: '80%', padding: '30px 0px' }}>
                            <div style={{ paddingTop: "10px" }}>
                                <strong>โต๊ะที่ : </strong>{!searchOrderId ? 'กรุณาเลือกออเดอร์' : selectedTableId || '?'}
                            </div>
                            <div style={{ padding: "10px 0px", flexDirection: "column", display: "flex" }}>
                                <input
                                    style={{
                                        width: "50%", padding: '6px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc'
                                    }}
                                    type="text"
                                    value={searchOrderId}
                                    placeholder="ค้นหาออเดอร์ด้วยรหัสออเดอร์"
                                    onChange={handleSearchChange}
                                    onFocus={() => setDropdownOpen(true)}
                                />

                                {dropdownOpen && searchOrderId && (
                                    <div
                                        style={{
                                            backgroundColor: 'white',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            width: '50%',
                                            cursor: 'pointer',
                                            padding: '5px',
                                            display: 'flex',
                                            flexDirection: "column"
                                        }}
                                    >
                                        {filteredOrders.length > 0 ? (
                                            filteredOrders.map((item) => (
                                                <div
                                                    key={item.Order_id}
                                                    onClick={() => {
                                                        selectOrder(item)
                                                        setSelectedTableId(item.tables_id);
                                                    }}
                                                >
                                                    ออเดอร์: {item.Order_id || item.order_id}
                                                </div>
                                            ))
                                        ) : (
                                            <div>ไม่พบออเดอร์</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between', paddingBottom: "10px" }}>
                                <button style={{
                                    padding: '5px 5px',
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                                    onClick={() => AddMenu(order.id)}>เพิ่มเมนู</button>
                                <button style={{
                                    padding: '5px 10px',
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }} onClick={() => AddNoodle(order.id)}>เพิ่มก๋วยเตี๋ยว</button>

                            </div>

                            <div style={{ width: '100%', height: '80%', overflowY: 'auto', position: 'relative' }}>
                                <div>
                                    {(order.MenuList || []).map(item => (
                                        <div key={item.id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }}>
                                            <button onClick={() => RemoveMenu(order.id, item.id)} style={{
                                                display: 'flex',
                                                top: '10px',
                                                right: '10px',
                                                background: 'none',
                                                color: 'black',
                                                border: 'none',
                                                fontSize: '20px',
                                                width: '25px',
                                                height: '25px',
                                                cursor: 'pointer'
                                            }}>✕</button>
                                            <Menu onSelect={(...menu) => AllMenu(order.id, item.id, ...menu)} />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    {(order.NoodleList || []).map(item => (
                                        <div key={item.id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }}>
                                            <button onClick={() => RemoveNoodle(order.id, item.id)} style={{
                                                display: "flex",
                                                top: '10px',
                                                right: '10px',
                                                background: 'none',
                                                color: 'black',
                                                border: 'none',
                                                fontSize: '20px',
                                                width: '25px',
                                                height: '25px',
                                                cursor: 'pointer'
                                            }}>✕</button>
                                            <Noodle onSelect={(...noodle) => AllNoodle(order.id, item.id, ...noodle)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '30px' }}>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor:
                                        (!order?.MenuList?.length && !order?.NoodleList?.length) ? 'gray' : 'darkgreen',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor:
                                        (!order?.MenuList?.length && !order?.NoodleList?.length) ? 'not-allowed' : 'pointer'
                                }}
                                onClick={() => OrderMenu(order)}
                                disabled={!order?.MenuList?.length && !order?.NoodleList?.length} // Disabled if both are empty
                            >
                                สั่งออเดอร์
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0px' }}>
                <button type='button' style={{
                    padding: '0.5rem 1.25rem',
                    color: 'white',
                    fontWeight: '500',
                    border: 'none',
                    transitionDuration: '200ms',
                    width: '60%',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    cursor: 'pointer',
                    fontSize: '15px',
                    backgroundColor: '#3b82f6',
                    display: 'flex',
                    justifyContent: 'center'
                }} onClick={createBox}>
                    เพิ่มรายการอาหารในออเดอร์
                </button>
            </div>
        </div>
    );
};

export default Existordercustomer;