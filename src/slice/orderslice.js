import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        createOrder: [],
    },
    reducers: {
        CreateOrder(state, action) {
            state.createOrder = action.payload;
        },
        AddMenuOrder(state, action) {
            const { orderId } = action.payload;
            const order = state.createOrder.find(o => o.id === orderId);
            if (order) {
                order.MenuList.push({
                    id: Date.now(),
                    MenuId: null,
                    MenuName: "",
                    Price: 0,
                    Qty: "1",
                    HomeDelivery: false,
                    Additional: "",
                });
            }
        },
        AddNoodleOrder(state, action) {
            const { orderId } = action.payload;
            const order = state.createOrder.find(o => o.id === orderId);
            if (order) {
                order.NoodleList.push({
                    id: Date.now(),
                    NoodleComponent: { soupType: null, noodleType: null, meatType: null, size: null },
                    Price: 0,
                    Qty: "1",
                    HomeDelivery: false,
                    Additional: "",
                });
            }
        },
        RemoveMenuOrder(state, action) {
            const { orderId, menuId } = action.payload;
            const order = state.createOrder.find(o => o.id === orderId);
            if (order) {
                order.MenuList = order.MenuList.filter(item => item.id !== menuId);
            }
        },
        RemoveNoodleOrder(state, action) {
            const { orderId, noodleId } = action.payload;
            const order = state.createOrder.find(o => o.id === orderId);
            if (order) {
                order.NoodleList = order.NoodleList.filter(item => item.id !== noodleId);
            }
        },
        UpdateMenuOrder(state, action) {
            const { orderId, menuId, data } = action.payload;
            const order = state.createOrder.find(o => o.id === orderId);
            if (order) {
                const menuItem = order.MenuList.find(item => item.id === menuId);
                if (menuItem) {
                    Object.assign(menuItem, data[0]);
                }
            }
        },
        UpdateNoodleOrder(state, action) {
            const { orderId, noodleId, data } = action.payload;
            const order = state.createOrder.find(o => o.id === orderId);
            if (order) {
                const noodleItem = order.NoodleList.find(item => item.id === noodleId);
                if (noodleItem) {
                    Object.assign(noodleItem, data[0]);
                }
            }
        },
        SetTable(state, action) {
            const { orderId, table } = action.payload;
            const order = state.createOrder.find(o => o.id === orderId);
            if (order) {
                order.TableList = table;
            }
        },
    },
});

export const {
    CreateOrder,
    AddMenuOrder,
    AddNoodleOrder,
    RemoveMenuOrder,
    RemoveNoodleOrder,
    UpdateMenuOrder,
    UpdateNoodleOrder,
    SetTable,
} = orderSlice.actions;

export default orderSlice.reducer;