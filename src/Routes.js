import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home"
import Login from "./pages/Login"
import SessionList from "./pages/SessionList"
import CreateSession from "./pages/CreateSession"
import AppContainer from "./utils/components/AppContainer";
import ProtectedRoutes from "./utils/components/ProtectedRoutes";
import Calendar from "./pages/Calendar";

export default function Router() {
  return (<>
      <AppContainer>
        <BrowserRouter>
          <Routes>
                <Route path="login" element={<Login/>} />
                <Route element={<ProtectedRoutes/>}>
                  <Route exact path="/" element={<Home/>}/>
                  <Route path="/session_list" element={<SessionList/>}/>
                  <Route path="/calendar" element={<Calendar/>}/>
                  <Route path="/create_session" element={<CreateSession/>}/>
                  <Route path="/my_sessions" element={<SessionList/>}/>
              </Route>
          </Routes>
      </BrowserRouter>
    </AppContainer>
  </>
  );
}