import { createSlice } from '@reduxjs/toolkit';

const ExistorderSlice = createSlice({
    name: 'existorders',
    initialState: {
        createOrder: [],
    },
    reducers: {
        ExistCreateOrder(state, action) {
            state.createOrder = action.payload;
        },
        ExistAddMenuOrder(state, action) {
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
        ExistAddNoodleOrder(state, action) {
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
        ExistRemoveMenuOrder(state, action) {
            const { orderId, menuId } = action.payload;
            const order = state.createOrder.find(o => o.id === orderId);
            if (order) {
                order.MenuList = order.MenuList.filter(item => item.id !== menuId);
            }
        },
        ExistRemoveNoodleOrder(state, action) {
            const { orderId, noodleId } = action.payload;
            const order = state.createOrder.find(o => o.id === orderId);
            if (order) {
                order.NoodleList = order.NoodleList.filter(item => item.id !== noodleId);
            }
        },
        ExistUpdateMenuOrder(state, action) {
            const { orderId, menuId, data } = action.payload;
            const order = state.createOrder.find(o => o.id === orderId);
            if (order) {
                const menuItem = order.MenuList.find(item => item.id === menuId);
                if (menuItem) {
                    Object.assign(menuItem, data[0]);
                }
            }
        },
        ExistUpdateNoodleOrder(state, action) {
            const { orderId, noodleId, data } = action.payload;
            const order = state.createOrder.find(o => o.id === orderId);
            if (order) {
                const noodleItem = order.NoodleList.find(item => item.id === noodleId);
                if (noodleItem) {
                    Object.assign(noodleItem, data[0]);
                }
            }
        }
    },
});

export const {
    ExistCreateOrder,
    ExistAddMenuOrder,
    ExistAddNoodleOrder,
    ExistRemoveMenuOrder,
    ExistRemoveNoodleOrder,
    ExistUpdateMenuOrder,
    ExistUpdateNoodleOrder
   
} = ExistorderSlice.actions;

export default ExistorderSlice.reducer;