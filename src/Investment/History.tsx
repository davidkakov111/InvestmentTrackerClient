import { useEffect, useState } from "react";
import "./css/History.css";
import {
  EditTableRow,
  RegularTableRow,
  TableHead,
} from "./components/HistoryComponents/HistoryComponents";
import { BodyTransaction } from "./components/HistoryComponents/interfaces";
import { fetchTransactionHistory } from "./components/HistoryComponents/HisTrxOperations";
import { DeleteTransactionHistory } from "./components/HistoryComponents/DropHistory";
import { NoTrHistoryWinow } from "../mainComponents/NoTrHistory";
import LoadingComponent from "../mainComponents/LoadingComponent";

export default function HistoryTable() {
  const [history, setHistory] = useState<any[]>();
  const [editId, setEditId] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchData() {
      const trHistory = await fetchTransactionHistory();
      setHistory(trHistory?.reverse())
      setLoading(false);
    }
    fetchData();
  }, []);

  function updateHistoryState(
    transaction: BodyTransaction,
    index: number,
    del: Boolean
  ) {
    if (!history) return;
    const historyCopy = [...history];
    if (del) {
      historyCopy.splice(index, 1);
      setHistory(historyCopy);
      return;
    }
    historyCopy[index] = {
      id: transaction.id,
      operation: transaction.operation,
      what: transaction.what,
      frominstrument: transaction.frominstrument,
      toinstrument: transaction.toinstrument,
      frominron: transaction.frominron,
      toinron: transaction.toinron,
      fees: transaction.fees,
      amount: transaction.amount,
      timestamp: transaction.timestamp,
      user_email: historyCopy[index].user_email,
    };
    setHistory(historyCopy);
  }

  if (loading) return <LoadingComponent/>

  return (
    <>
      {history && history.length > 0 ? (
        <>
          <div className="flex justify-center">
            <button className="bg-gradient-to-br from-green-500 
              to-green-900 bg-opacity-20 text-black rounded-full
              hover:bg-green-700 focus:outline-none focus:ring-2 
              focus:ring-green-500 focus:ring-opacity-50 mb-3 p-2 text-lg"
              onClick={()=>{setHistory([...history].reverse())}}
            >
              <b>Reverse Chronology</b>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="history-table table-auto">
              <TableHead />
              <tbody>
                {history?.map((transaction, index) =>
                  transaction.id !== editId ? (
                    <RegularTableRow
                      transaction={transaction}
                      setEditId={setEditId}
                      key={index}
                    />
                  ) : (
                    <EditTableRow
                      transaction={transaction}
                      mapIndex={index}
                      setEditId={setEditId}
                      updateHistoryState={updateHistoryState}
                      key={index}
                    />
                  )
                )}
              </tbody>
            </table>
          </div>
          <DeleteTransactionHistory
            deleteHistoryState={() => {
              setHistory([]);
            }}
          />
        </>
      ) : (
        <NoTrHistoryWinow title="No transaction history found!" subtitle="Start tracking your transactions now."/>
      )}
    </>
  );
}
