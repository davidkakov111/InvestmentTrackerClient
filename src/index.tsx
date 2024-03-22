import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import InvestForm from './Investment/Form';
import HistoryTable from './Investment/History';
import "./Investment/css/Index.css";
import { NavbarComponent } from './Investment/components/Navbar';

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavbarComponent><h1 className='text-white text-3xl text-center'>Home</h1></NavbarComponent>
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
