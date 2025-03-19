import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from '../ordercustomer/table';
import Menu from './menu';
import Noodle from './noodle';
import {
    CreateOrder,
    AddMenuOrder,
    AddNoodleOrder,
    RemoveMenuOrder,
    RemoveNoodleOrder,
    UpdateMenuOrder,
    UpdateNoodleOrder,
    SetTable,
} from '../slice/orderslice';

const Newordercustomer = () => {
    const dispatch = useDispatch();
    const { createOrder } = useSelector((state) => state.orders);

    const createBox = () => {
        dispatch(CreateOrder([...createOrder, { id: Date.now(), MenuList: [], NoodleList: [], TableList: null}]));
    };

    const closeBox = (id) => {
        if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการปิดออเดอร์?")) {
            dispatch(CreateOrder(createOrder.filter(order => order.id !== id)));
        }
    };

    const AddMenu = (orderId) => {
        dispatch(AddMenuOrder({ orderId }));
    };

    const AddNoodle = (orderId) => {
        dispatch(AddNoodleOrder({ orderId }));
    };

    const RemoveMenu = (orderId, menuId) => {
        dispatch(RemoveMenuOrder({ orderId, menuId }));
    };

    const RemoveNoodle = (orderId, noodleId) => {
        dispatch(RemoveNoodleOrder({ orderId, noodleId }));
    };

    const AllMenu = useCallback((orderId, menuId, ...data) => {
        dispatch(UpdateMenuOrder({ orderId, menuId, data }));
    }, [dispatch]);

    const AllNoodle = useCallback((orderId, noodleId, ...data) => {
        dispatch(UpdateNoodleOrder({ orderId, noodleId, data }));
    }, [dispatch]);

    const OrderMenu = async (order) => {
        const { MenuList = [], NoodleList = [], TableList } = order;
        console.log('Order:', JSON.stringify(order));

        const confirm = window.confirm('ยืนยันการสั่งอาหารหรือไม่');
        if (!confirm) return;

        try {
            const reserveResponse = await fetch(`http://localhost:3333/table/${TableList}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status_id: 2 }),
              });
        
              if (!reserveResponse.ok) {
                throw new Error(`Failed to reserve table ${TableList}`);
              }

            const createOrderResponse = await fetch('http://localhost:3333/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableId: TableList }),
            });

            if (!createOrderResponse.ok) throw new Error('Failed to create new order');
            const { orderId } = await createOrderResponse.json();


            console.log('MenuList:', MenuList);
            console.log('NoodleList:', NoodleList);

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


            const response = await fetch(`http://localhost:3333/orders/${orderId}/add_items`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItems: items }),
            });

            if (!response.ok) throw new Error('failed to add items');
            const result = await response.json();
            console.log('Items added:', result);

            alert('สั่งออเดอร์สำเร็จ!');
        } catch (error) {
            console.error('Error ordering', error);
            alert('failed to process order');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>สั่งออเดอร์ให้ลูกค้า</h1>
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
                            <div>
                                <Table onSelect={(table) => {
                                    dispatch(SetTable({ orderId: order.id, table }));
                                }} />

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
                            <div style={{ width: '100%', height: '85%', overflowY: 'auto', position: 'relative' }}>
                                <div>
                                    {(order.MenuList || []).map(item => (
                                        <div key={item.id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }}>
                                            <button onClick={() => RemoveMenu(order.id, item.id)} style={{
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
                                            <Menu onSelect={(...menu) => AllMenu(order.id, item.id, ...menu)} />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    {(order.NoodleList || []).map(item => (
                                        <div key={item.id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }}>
                                            <button onClick={() => RemoveNoodle(order.id, item.id)} style={{
                                                display: "flex",
                                                alignItems: "right",
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
                        <div style={{ padding: '30px 0px' }}>
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
                                disabled={!order?.MenuList?.length && !order?.NoodleList?.length}
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
                    width: '50%',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    cursor: 'pointer',
                    fontSize: '15px',
                    backgroundColor: '#3b82f6',
                    display: 'flex',
                    justifyContent: 'center'
                }} onClick={createBox}>
                    สร้างออเดอร์
                </button>
            </div>
        </div>
    );
};

export default Newordercustomer;