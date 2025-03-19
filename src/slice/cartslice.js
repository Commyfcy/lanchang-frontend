import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    orderedItems: [],
    orderId: null,
  },
  reducers: {
    addItemToCart: (state, action) => {
      const newItem = action.payload;
      let existingItem;
      if (newItem.type === 'noodle') {
        existingItem = state.items.find(item =>
          item.id.Noodle_type_id === newItem.id.Noodle_type_id &&
          item.id.Soup_id === newItem.id.Soup_id &&
          item.id.Meat_id === newItem.id.Meat_id &&
          item.id.Size_id === newItem.id.Size_id &&
          item.type === newItem.type &&
          item.homeDelivery === newItem.homeDelivery &&
          item.additionalInfo === newItem.additionalInfo &&
          JSON.stringify(item.Noodle_name) === JSON.stringify(newItem.Noodle_name)
        );
      } else if (newItem.type === 'menu') {
        existingItem = state.items.find(item =>
          item.id === newItem.id && 
          item.type === newItem.type &&
          item.homeDelivery === newItem.homeDelivery &&
          item.additionalInfo === newItem.additionalInfo
        );
      }
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
    },
    increaseQuantity: (state, action) => {
      const { id, type, homeDelivery, additionalInfo } = action.payload;
      const item = state.items.find(i =>
        i.id.Noodle_type_id === id.Noodle_type_id &&
        i.id.Soup_id === id.Soup_id &&
        i.id.Meat_id === id.Meat_id &&
        i.id.Size_id === id.Size_id &&
        i.type === type &&
        i.homeDelivery === homeDelivery &&
        i.additionalInfo === additionalInfo
      );
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const { id, type, homeDelivery, additionalInfo } = action.payload;
      const item = state.items.find(i =>
        i.id.Noodle_type_id === id.Noodle_type_id &&
        i.id.Soup_id === id.Soup_id &&
        i.id.Meat_id === id.Meat_id &&
        i.id.Size_id === id.Size_id &&
        i.type === type &&
        i.homeDelivery === homeDelivery &&
        i.additionalInfo === additionalInfo
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    removeItemFromCart: (state, action) => {
      const { id, type, homeDelivery, additionalInfo } = action.payload;
      state.items = state.items.filter(item =>
        !(item.id.Noodle_type_id === id.Noodle_type_id &&
          item.id.Soup_id === id.Soup_id &&
          item.id.Meat_id === id.Meat_id &&
          item.id.Size_id === id.Size_id &&
          item.type === type &&
          item.homeDelivery === homeDelivery &&
          item.additionalInfo === additionalInfo)
      );
    },
    setOrderId: (state, action) => {
      state.orderId = action.payload;
    },
    clearCart: (state) => {
      state.orderedItems = [...state.items];
      state.items = [];
    },
  },
});

export const { addItemToCart, increaseQuantity, decreaseQuantity, removeItemFromCart, clearCart, setOrderId } = cartSlice.actions;
export default cartSlice.reducer;
