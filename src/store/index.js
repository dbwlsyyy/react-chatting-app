import { configureStore } from '@reduxjs/toolkit';
import chatRoomReducer from './chatRoomSlice';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        chatRoom: chatRoomReducer,
    },
    devTools: true,
});
