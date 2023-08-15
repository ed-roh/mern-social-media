const { createSlice } = require("@reduxjs/toolkit")

const initialState = {
    convs: [],
    messages: [],
    searchValue: '',
    socket: null,
    newMsgCount:0
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setConvs: (state, action) => {
            const savedConvs = action.payload;

            state.convs = savedConvs
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setSearchValue: (state, action) => {
            state.searchValue = action.payload
        },
        setSocket: (state, action) => {
            state.socket = action.payload
        },
        setNewMsgCount:(state,action)=>{
            state.newMsgCount = action.payload
        }
    }
})

export const { setConvs, setMessages, setSearchValue, setSocket, setNewMsgCount } = chatSlice.actions
export default chatSlice.reducer;