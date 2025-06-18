import {Route,Routes,BrowserRouter} from 'react-router-dom'
import VerifyOTP from './components/verifyOTP';
import SetPassword from './components/SetPassword';
import AdminLogin from './components/AdminLogin';
import UserLogin from './components/UserLogin';
import UserDashBoard from './components/UserDashBoard';
import AdminDashBoard from './components/AdminDashBoard';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import UserRegister from './components/UserRegister';
import UserProducts from './components/UserProducts';
import EditProduct from './components/EditProduct';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Gallery from './components/Gallery';
import ViewProduct from './components/ViewProduct';
import UserCart from './components/UserCart';
import ContactUs from './components/ContactUs';
import AddAddress from './components/AddAddress';
import CheckOut from './components/CheckOut';
import UpdateAddress from './components/UpdateAddress';
import UserOrder from './components/UserOrder';
import AdminOrder from './components/AdminOrder';
import UpdateOrder from './components/UpdateOrder';
import About from './components/AboutUs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from './components/ForgotPassword';
import AdminContactList from './components/AdminContactList';




function App() {
 

  return (
      <>
      <Routes>    
        <Route path="/user/register" element={<UserRegister/>} />
        <Route path="/verify-otp" element={<VerifyOTP/>} />
        <Route path="/set-password" element={<SetPassword/>} />
        <Route path='/admin/login' element={<AdminLogin/>} />
        <Route path='/user/login' element={<UserLogin/>} />
        <Route path='/user/dashboard' element={<UserDashBoard/>} />
        <Route path='/admindashboard' element={<AdminDashBoard/>} />
        <Route path='/addproduct' element={<AddProduct/>} />
        <Route path='/productlist' element={<ProductList/>} />
        <Route path='/user/productlist' element={<UserProducts/>} />
        <Route path='/editproduct/:id' element={<EditProduct/>} />
        <Route path='/' element={<Home/>} />
        <Route path='/navbar' element={<Navbar/>} />
        <Route path='/gallery' element={<Gallery/>} />
        <Route path='/user/product/:id' element={<ViewProduct/>} />
        <Route path='/user/cart' element={<UserCart/>} />
        <Route path='/ContactUs' element={<ContactUs/>} />
        <Route path='/user/addadress' element={<AddAddress/>} />
        <Route path='/user/checkout' element={<CheckOut/>} />
        <Route path='/user/updateaddress/:id' element={<UpdateAddress/>} />
        <Route path='/user/orders' element={<UserOrder/>} />
        <Route path='/admin/orders' element={<AdminOrder/>} />
        <Route path='/admin/updateorder/:id' element={<UpdateOrder/>} />
        <Route path='/aboutus' element={<About/>} />
        <Route path='/user/forgotpassword' element={<ForgotPassword/>} />
        <Route path='/admin/contact' element={<AdminContactList/>} />
        
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App
