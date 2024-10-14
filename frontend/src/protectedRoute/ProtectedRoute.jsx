import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({element}) =>{
    const authUser = useSelector(state=>state.userSlice)
    return authUser.status ? element : <Navigate to='/' />
}

export default ProtectedRoute;