import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

const usersAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = usersAdapter.getInitialState({});

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(USERS_URL);
  return response.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      action.payload.push({ id: 999, name: "Haitham", date: new Date() });
      let min = 1;
      const loadedUsers = action.payload.map((user) => {
        user.date = sub(new Date(), { minutes: min-- }).toISOString();
        return user;
      });
      return usersAdapter.upsertMany(state, loadedUsers);
    });
  },
});

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => state.users);

export default usersSlice.reducer;
