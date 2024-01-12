import './App.css'
import { Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import axios from "axios";
import ChatPage from './pages/ChatPage';
import NotFound from './pages/NotFound';

function App() {

  axios.defaults.baseURL = "https://sl-chat.onrender.com";
  axios.defaults.withCredentials = true;

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/chat' element={<ChatPage />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App;
