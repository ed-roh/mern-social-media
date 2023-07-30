const { createSlice } = require("@reduxjs/toolkit")

const initialState={
    convs:[],
    messages:[],
    searchValue:'',
    socket:null
}

const chatSlice = createSlice({
    name:"chat",
    initialState,
    reducers:{
        setConvs:(state, action)=>{
            const savedConvs = action.payload;
      
            state.convs = savedConvs
          },
        setMessages:(state, action)=>{
        state.messages = action.payload;
        },
        setSearchValue:(state,action)=>{
            state.searchValue = action.payload
        },
        setSocket:(state, action)=>{
            state.socket = action.payload
        }
    }
})

export const {setConvs, setMessages, setSearchValue, setSocket} = chatSlice.actions
export default chatSlice.reducer;