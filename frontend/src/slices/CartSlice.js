import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';



export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
    const response = await API.get('/cart/');
    return response.data;
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ cartId, quantity }) => {
    await API.put(`/cart/update/${cartId}/`, { quantity });
    return { cartId, quantity };
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (cartId) => {
    await API.delete(`/cart/remove/${cartId}/`);
    return cartId;
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state) => {
                state.loading = false;
                state.error = 'Failed to fetch cart';
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                const { cartId, quantity } = action.payload;
                const item = state.items.find(item => item.id === cartId);
                if (item) item.quantity = quantity;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    }
});

export default cartSlice.reducer;
