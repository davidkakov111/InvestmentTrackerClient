import { useState } from "react";
import { DeleteTransactionHistoryProps } from "./interfaces";
import { SignOut } from "../../../Auth/SignOut";

export const DeleteTransactionHistory: React.FC<DeleteTransactionHistoryProps> = ({deleteHistoryState}) => {
    const [del, setDel] = useState(false);
    const [password, setPassword] = useState('');

    function handleDelete() {
        if (password.length < 6) {
            alert('The password is too short. It must be at least 6 characters long.');
            return;
        }
        const JWTToken = localStorage.getItem("JWTToken");
        if (!JWTToken) {
            alert("Please SignIn first!");
            return;
        }
        fetch(`${process.env.REACT_APP_BACKEND_API}/DeleteAllTransactionHistory`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: JWTToken,
            },
            body: JSON.stringify({ password: password }),
        })
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                const serverResponse = response.response;
                if (serverResponse === "Unauthorized") {
                    alert("You dont have valid JWT, you need to SignIn again.")
                    SignOut()
                } else if (serverResponse === "Access denied") {
                    alert("Wrong password try again.")
                    setDel(!del)
                } else if (serverResponse === "Server error") {
                    alert("There was a problem on the server deleting the transaction history.")
                    setDel(!del)
                } else if (serverResponse === "Success") {
                    alert("Transaction history successfully deleted!");
                    deleteHistoryState()
                    setDel(!del)
                }
            })
            .catch((error) => {
                alert(
                    "There was a problem with the transaction history deleter fetch operation."
                );
                console.error(
                    "There was a problem with the transaction history deleter fetch operation:",
                    error
                );
                setDel(!del)
            });
        setPassword("");
    }

    return (<>
    {!del ? 
        <div className="flex justify-center items-center">
          <button onClick={() => {if (window.confirm("Are you sure you want to delete All Transaction History?")) {
                setDel(!del)
            }}} className="mt-4 mb-4 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline">
            Delete All Transaction History
          </button>
        </div> 
      : 
        <form className="passwordform">
            <div className="mb-4">
            <label htmlFor="password" className="block text-lg font-medium text-red-500">
                Enter your password to delete <b>All Transaction History</b>:
            </label>
            <input
                autoComplete='off'
                placeholder='Just you know'
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
                className="mt-1 p-2 w-full h-8 bg-white border rounded-md"
            />
            </div>
            <div className="flex">
                <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 mr-1 text-md h-11 bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                >
                    Delete
                </button>
                <button
                    type="button"
                    onClick={() => setDel(false)}
                    className="flex-1 ml-1 tx-sm h-11 bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
                >
                    Cancel
                </button>
            </div>
        </form>
    }
    </>);
}
