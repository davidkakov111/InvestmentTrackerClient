import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import InvestForm from './Investment/Form';
import HistoryTable from './Investment/History';
import { NavbarComponent } from './mainComponents/Navbar';
import SignUpForm from './Auth/SignUp';
import SignInForm from './Auth/SignIn';
import "./index.css";
import { UserContextProvider } from './Context/UserContext';
import { NotRequireSignIn, RequireSignIn } from './mainComponents/RequireSignIn';
import { StatisticsComponent } from './Investment/Statistics';

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavbarComponent><h1 className='text-green-500 text-3xl text-center'>Home</h1></NavbarComponent>
  },
  {
    path: "/signup",
    element: <NotRequireSignIn><NavbarComponent><SignUpForm/></NavbarComponent></NotRequireSignIn>
  },
  {
    path: "/signin",
    element: <NotRequireSignIn><NavbarComponent><SignInForm/></NavbarComponent></NotRequireSignIn>
  },
  {
    path: "/saveTransactionForms",
    element: <RequireSignIn><NavbarComponent><InvestForm/></NavbarComponent></RequireSignIn>
  },
  {
    path: "/history",
    element: <RequireSignIn><NavbarComponent><HistoryTable/></NavbarComponent></RequireSignIn>
  },
  {
    path: "/statistics",
    element: <RequireSignIn><NavbarComponent><StatisticsComponent/></NavbarComponent></RequireSignIn>
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <UserContextProvider>
    <RouterProvider router={router} />
  </UserContextProvider>
);
