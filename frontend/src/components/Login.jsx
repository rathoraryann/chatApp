import { useState } from 'react'
import { Button, useToast } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useDispatch } from 'react-redux'
import { login } from '../store/userSlice'

const Login = () => {
  const toast = useToast();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  })

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (!inputs.email || !inputs.password) {
      toast({
        title: 'Empty fields',
        description: "please fill the required details",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      })
      setLoading(false)
      return;
    }
    try {
      const response = await axios.post(`${window.location.origin}/api/user/login`, inputs, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (response.data.msg === "user is not found") {
        toast({
          title: "Invalid credentials",
          description: "user not found",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right"
        })
        setLoading(false)
        return;
      }
      localStorage.setItem("user-info", JSON.stringify(response.data))
      dispatch(login({ userData: response.data }))
      setLoading(false)
      navigate("./chat")
    } catch {
      toast({
        title: 'Login failed',
        description: "login failed",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      })
      setLoading(false)
    }
  }
  return (
    <div>
      <h1 style={{ fontSize: "30px" }}>Login</h1>
      <div style={{ display: 'flex', flexDirection: "column", gap: '5px', margin: '10px 0px' }}>
        <h3>Email</h3>
        <input
          value={inputs.email}
          onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
          type="text"
          placeholder="Enter your email address"
          style={{ padding: '5px', marginBottom: "12px" }}
        />
        <h3>Password</h3>
        <input
          value={inputs.password}
          onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
          type="text"
          placeholder='Enter password'
          style={{ padding: '5px', marginBottom: "12px" }}
        />
        <Button isLoading={loading} sx={{ bgColor: "white", color: "black", margin: "10px, 0px", padding: "10px", borderRadius: "0px" }} onClick={submitHandler}>Login</Button>
        <button style={{ backgroundColor: "black", padding: "5px" }} onClick={() => setInputs({ email: "example@gmail.com", password: "Abc@12345" })}>Get GUEST user credentials</button>
      </div>
    </div>
  )
}

export default Login
