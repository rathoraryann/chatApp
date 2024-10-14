import { useState } from 'react'
import axios from "axios"
import { Button, useToast } from '@chakra-ui/react'
import {useNavigate} from "react-router-dom"
import { useDispatch } from "react-redux"
import { login } from "../store/userSlice"


const Signup = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password: '',
    pic: '',
  })

  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  function isValidPass(pass){
    const passformate  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passformate.test(pass)
  }

  const postDetails = (pic) => {
    if (pic == undefined) {
      alert("please select an image")
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chatApp");
      data.append("cloud_name", "dzb8zbosi");
      fetch("https://api.cloudinary.com/v1_1/dzb8zbosi/image/upload", {
        method: "post",
        body: data,
      }).then((res) => res.json())
        .then(data => {
          setInputs({ ...inputs, pic: data.url.toString() });
        })
        .catch((error) => {
          console.log(error)
        })
    } else return;
  }
  const submitHandler = async (e) => {
    setLoading(true)
    e.preventDefault();
    if (!inputs.email || !inputs.name || !inputs.password) {
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
    if (!isValidEmail(inputs.email)) {
      toast({
        title: "invalid email",
        description: "format of the email should be correct",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top"
      })
      setLoading(false)
      return
    }
    if (!isValidPass(inputs.password)) {
      toast({
        title: "invalid password formate",
        description: "At least 8 characters in length, At least one uppercase letter (A-Z), At least one lowercase letter (a-z), At least one digit (0-9), At least one special character (like @, $, !, %, *, ?, &, etc.)",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top"
      })
      setLoading(false)
      return
    };


    try {
      const response = await axios.post(`${window.location.origin}/api/user/auth`, inputs, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      console.log(response)
      if (response.data.msg == 'user exists') {
        toast({
          title: 'Email exists',
          description: "email exists, create account using another email",
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: "top-right"
        })
        setLoading(false)
        return;
      }
      toast({
        title: 'Account created',
        description: "account created succesfully",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: "top-right"
      })
      setLoading(false)
      localStorage.setItem("user-info", JSON.stringify(response.data))
      dispatch(login({ userData: response.data }))
      navigate('./chat')

    } catch {
      toast({
        title: 'Account creation failed',
        description: "account creation failed",
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
      <h1 style={{ fontSize: "30px" }}>Signup</h1>
      <div style={{ display: 'flex', flexDirection: "column", gap: '5px', margin: '10px 0px' }}>
        <h3>Name</h3>
        <input
          value={inputs.name}
          onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
          type="text"
          placeholder="Enter your email address"
          style={{ padding: '5px', marginBottom: "12px" }}
        />
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
        <h3>Upload your pic</h3>
        <input
          onChange={(e) => postDetails(e.target.files[0])}
          type="file"
          placeholder='Enter password'
          style={{ padding: '5px', marginBottom: "12px" }}
        />
        <Button isLoading={loading} sx={{ bgColor: "white", color: "black", margin: "10px, 0px", padding: "10px", borderRadius: "0px" }} onClick={submitHandler}>Sign up</Button>
      </div>
    </div>
  )
}

export default Signup
