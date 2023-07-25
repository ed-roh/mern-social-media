const { createSlice } = require("@reduxjs/toolkit")

const initialState={
    convs:[],
    messages:[]
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
        }
    }
})

export const {setConvs, setMessages} = chatSlice.actions
export default chatSlice.reducer;