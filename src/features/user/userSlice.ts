import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: UserData | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitializing = false;
    },
    setInitializationFailed: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
    },
  },
});

// Exportamos las nuevas acciones
export const { setUser, setInitializationFailed, logout } = userSlice.actions;
export default userSlice.reducer;
