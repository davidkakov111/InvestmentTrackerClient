import { useContext } from "react";
import "./Investment/css/Home.css"
import { UserContext } from "./Context/UserContext";
import { Link } from "react-router-dom";


export default function HomeComponent() {
  const {user, setUser} = useContext(UserContext);

  return (
      <div style={{color: 'rgb(137, 253, 137)'}} className="mx-auto px-4  text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Crypto Investment Tracker</h1>
          <p className="text-lg">Track, analyze, and optimize your cryptocurrency investments with ease.</p>
        </div>
  
        <div className="flex flex-wrap justify-center -mx-4 mb-8">
          <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
            <div className="bg-green-600 text-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-2">Tax Calculator</h2>
              <p>Calculate taxes on crypto transactions accurately.</p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
            <div className="bg-green-600 text-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-2">Portfolio Management</h2>
              <p>View portfolio statistics, including individual asset breakdowns.</p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
            <div className="bg-green-600 text-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
              <p>Maintain a detailed history of all your transactions.</p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/3 px-4 mb-4">
              <div className="bg-green-600 text-white rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-2">Save Transactions</h2>
                  <p>Record cryptocurrency transactions with ease using detailed forms.</p>
              </div>
          </div>
        </div>
  
        <div>
          <p className="text-lg mb-4">This platform is designed to provide Romanian crypto investors with the tools and insights they need to succeed in the cryptocurrency market. Start tracking your investments today!</p>
          <Link
            to={user.isAuthenticated ? "/saveTransactionForms" : "/signup"}
            className="get-started-btn py-2 px-6 rounded-lg inline-block font-semibold"
          >
            Get Started
          </Link>
        </div>
      </div>
  );
}
