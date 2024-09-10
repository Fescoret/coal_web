import './css/App.css'
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { HomePage } from './wigets/HomePage'
import { OrderForm } from './wigets/OrderForm'
import Header from './features/Header/Header';
import { useAuth } from './shared/hooks/useAuth';
import { useState } from 'react';
import { AuthContext } from './shared/AuthContext';
import { LoginPage } from './wigets/LoginPage';

function App() {
  const { user, setUser, getUser } = useAuth();
  const[isUser, setUserState] = useState(false)
  const propSetUser = (state: boolean) => {
    setUserState(state)
  }
  
  return (
    <>
    <AuthContext.Provider value={{ user, setUser, getUser }}>
    <BrowserRouter>
      <div className="App">
      <Header isUser={isUser} setUserState={propSetUser}/>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/order' element={<OrderForm />} />
          <Route path='/info' element={<HomePage />} />
          <Route path='/login' element={<LoginPage setUserState={propSetUser}/>} />
        </Routes>
      </div>
    </BrowserRouter>
    </AuthContext.Provider>
    </>
  )
}

export default App
