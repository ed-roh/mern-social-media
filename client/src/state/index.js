import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  users: [],
  convs:[],
  messages:[]
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.convs = [];
      state.messages = [];
      state.socket = null;
      state.users = [];
      state.posts = [];
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setUsers: (state, action)=>{
      state.users = action.payload.map(user=> ({_id:user._id, firstName:user.firstName, lastName:user.lastName, picturePath:user.picturePath}))
    }
    ,
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        // console.log(post, action.payload)
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },

    setConvs:(state, action)=>{
      const savedConvs = action.payload;

      state.convs = savedConvs
    },
    setMessages:(state, action)=>{
      state.messages = action.payload;
    }
  },
});


export const { 
  setMode, setLogin, setLogout, setFriends, setPosts, setPost, setUsers
 } = authSlice.actions;
export default authSlice.reducer;
