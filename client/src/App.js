import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Messenger from "scenes/Messenger/index22";
import {io} from "socket.io-client"
import { env } from "./config";
import dayjs from "dayjs";
import SearchResults from "scenes/SearchResults";

function App() {
  const mode = useSelector((state) => state.authReducer.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.authReducer.token));
  const [socket, setSocket] = useState(null)

  const setPostTimeDiff = (createdAt, stampOf=null)=>{
    const timeStamp = dayjs(createdAt)
    // console.log(timeStamp.format("dddd, MMMM D YYYY"))
    const time = timeStamp.format("h:mm a")
    const date = timeStamp.format("DD-MM-YYYY")
    if(stampOf==="chats") return {date, time}
    const timeIntervalInMilliseconds = dayjs().diff(dayjs(createdAt))
    const months = Math.floor(timeIntervalInMilliseconds/(1000*60*60*24*30))
    const weeks = Math.floor(timeIntervalInMilliseconds/((1000*60*60*24*7)))
    const days = Math.floor(timeIntervalInMilliseconds/(1000*60*60*24))
    const hours = Math.floor(timeIntervalInMilliseconds / 3600000);
    const minutes = Math.floor((timeIntervalInMilliseconds % 3600000) / 60000);
    const seconds = Math.floor((timeIntervalInMilliseconds % 60000) / 1000);

    if(months > 0) return `${months}mo`
    if(weeks > 0) return `${weeks}w`
    if(days > 0) return `${days}d`
    if(hours !== 0){
      return `${hours}h`
    }else if(hours === 0 && minutes !== 0){
      return `${minutes}m`
    }
    return `${seconds}s`
  }

  useEffect(()=>{
    setSocket(io(env.serverEndpoint()))
    
  },[])

  return (
    <div className="app">
      <BrowserRouter>
      
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage setPostTimeDiff={setPostTimeDiff} socket={socket} /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage setPostTimeDiff={setPostTimeDiff} /> : <Navigate to="/" />}
            />
            <Route 
              path="/messenger"
              element={isAuth ? <Messenger setPostTimeDiff={setPostTimeDiff} socket={socket} /> : <Navigate to="/" />}
            />
            <Route
              path="/search-results"
              element={isAuth ? <SearchResults/> : <Navigate to="/" />}
            />
            
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
