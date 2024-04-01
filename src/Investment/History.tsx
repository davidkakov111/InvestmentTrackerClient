import { useEffect, useState } from "react";
import "./css/History.css";
import {
  EditTableRow,
  RegularTableRow,
  TableHead,
} from "./components/HistoryComponents/HistoryComponents";
import { BodyTransaction } from "./components/HistoryComponents/interfaces";
import { fetchTransactionHistory } from "./components/HistoryComponents/HisTrxOperations";

export default function HistoryTable() {
  const [history, setHistory] = useState<any[]>();
  const [editId, setEditId] = useState<number>(-1);

  useEffect(() => {
    async function fetchData() {
      const trHistory = await fetchTransactionHistory();
      if (trHistory) setHistory(trHistory);
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

  return (
    <>
      <table className="history-table">
        <TableHead />
        <tbody>
          {history?.map((transaction, index) =>
            transaction.id !== editId ? (
              <RegularTableRow
                transaction={transaction}
                mapIndex={index}
                setEditId={setEditId}
              />
            ) : (
              <EditTableRow
                transaction={transaction}
                mapIndex={index}
                setEditId={setEditId}
                updateHistoryState={updateHistoryState}
              />
            )
          )}
        </tbody>
      </table>
    </>
  );
}
