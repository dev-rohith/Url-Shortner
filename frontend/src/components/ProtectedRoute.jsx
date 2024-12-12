import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = ({children}) => {
    const {isLoggedIn} = useSelector(store=>store.user)
  if(!isLoggedIn){
    return <Navigate to='/login' replace />
  }else{
    return <Outlet />
  }
}
export default ProtectedRoute