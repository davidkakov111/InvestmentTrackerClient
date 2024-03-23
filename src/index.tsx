import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import InvestForm from './Investment/Form';
import HistoryTable from './Investment/History';
import { NavbarComponent } from './mainComponents/Navbar';
import SignUpForm from './Auth/SignUp';
import SignInForm from './Auth/SignIn';
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavbarComponent><h1 className='text-green-500 text-3xl text-center'>Home</h1></NavbarComponent>
  },
  {
    path: "/signup",
    element: <NavbarComponent><SignUpForm/></NavbarComponent>
  },
  {
    path: "/signin",
    element: <NavbarComponent><SignInForm/></NavbarComponent>
  },
  {
    path: "/saveTransactionForms",
    element: <NavbarComponent><InvestForm/></NavbarComponent>
  },
  {
    path: "/history",
    element: <NavbarComponent><HistoryTable/></NavbarComponent>
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RouterProvider router={router} />
);
