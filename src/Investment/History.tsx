import { useEffect, useState } from "react"
import './css/History.css'

export default function HistoryTable() {
    const [history, setHistory] = useState<any[]>();

    useEffect(()=>{
        async function fetchData() {
            try {
              const response = await fetch('http://localhost:8080/GetTransactions');
              if (!response.ok) {
                alert('Failed to fetch transactions history');
              }
              // Parse the JSON response
              const transactions: any[] = await response.json();
              // Sort it to cronological order   
              if (transactions.length > 1) {
                transactions.sort((a, b) => {
                    return Number(a.timestamp) - Number(b.timestamp);
                });
              }
              setHistory(transactions)
            } catch (error) {
              // Handle any errors that occurred during the fetch
              console.error('Error fetching transactions:', error);
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <table className="history-table">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Operation type</th>
                        <th>From</th>
                        <th>To</th>
                        <th>From (RON)</th>
                        <th>To (RON)</th>
                        <th>Fee (RON)</th>
                        <th>Amount (From)</th>
                        <th>Transfered</th>
                        <th>TSIG</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {history?.map((transaction) => (
                        <tr key={transaction.id}>
                            <td className={transaction.operation}>{transaction.id}</td>
                            <td className={transaction.operation}>{transaction.operation}</td>
                            <td className={transaction.operation}>{transaction.frominstrument}</td>
                            <td className={transaction.operation}>{transaction.toinstrument}</td>
                            <td className={transaction.operation}>{transaction.frominron}</td>
                            <td className={transaction.operation}>{transaction.toinron}</td>
                            <td className={transaction.operation}>{transaction.feeinron}</td>
                            <td className={transaction.operation}>{transaction.amount}</td>
                            <td className={transaction.operation}>{transaction.what ? JSON.parse(transaction.what)[0] : ""}</td>
                            <td className={transaction.operation}>{transaction.what ? JSON.parse(transaction.what)[1] : ""}</td>
                            <td className={transaction.operation}>{String(new Date(Number(transaction.timestamp)).toLocaleString())}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
