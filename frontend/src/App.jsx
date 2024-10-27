import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from './pages/Home'
import Chat from './pages/Chat'
import ProtectedRoute from './protectedRoute/ProtectedRoute'
import { useEffect, useState } from "react"
import { useDispatch, useSelector} from "react-redux"
import { login } from "./store/userSlice"


function App() {
  const dispatch = useDispatch()
  const user = useSelector(state=>state.userSlice.status)
  const authUser = JSON.parse(localStorage.getItem("user-info"))

  const [isLoading, setIsLoading] = useState(true)

  const NotFound = () => {
    return (
      <div>
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    );
  };

  useEffect(() => {
    if (authUser) {
      dispatch(login({userData: authUser}))
    }
    setIsLoading(false)
  }, [authUser, dispatch])


  if (isLoading) return

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user? <Navigate to={'/chat'} /> :<Home />} />
        <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
