import { useState } from "react";
import { cryptos, instruments } from "../../Instruments";
import moment from "moment";
import {
  Transaction,
  EditTableRowComponentProps,
  RegularTableRowComponentProps
} from "./interfaces";
import { deleteTransaction, updateTransaction, validateTransaction } from "./HisTrxOperations";

export function TableHead() {
  return (
    <thead>
      <tr>
        <th>Nr</th>
        <th>Operation</th>
        <th>From</th>
        <th>To</th>
        <th>From (RON)</th>
        <th>To (RON)</th>
        <th>Fee (RON)</th>
        <th>Amount (From)</th>
        <th>Transfered</th>
        <th>TxLink</th>
        <th>Date</th>
        <th>Edit</th>
      </tr>
    </thead>
  );
}

export const RegularTableRow: React.FC<RegularTableRowComponentProps> = ({
  transaction,
  setEditId,
  mapIndex,
}) => {
  return (
    <tr key={transaction.id}>
      <td className={transaction.operation}>{mapIndex + 1}</td>
      <td className={transaction.operation}>{transaction.operation}</td>
      <td className={transaction.operation}>{transaction.frominstrument}</td>
      <td className={transaction.operation}>{transaction.toinstrument}</td>
      <td className={transaction.operation}>{transaction.frominron}</td>
      <td className={transaction.operation}>{transaction.toinron}</td>
      <td className={transaction.operation}>{transaction.fees}</td>
      <td className={transaction.operation}>{transaction.amount}</td>
      <td className={transaction.operation}>
        {JSON.parse(transaction.what) ? JSON.parse(transaction.what)[0] : ""}
      </td>
      <td className={transaction.operation}>
        {JSON.parse(transaction.what) ? JSON.parse(transaction.what)[1] : ""}
      </td>
      <td className={transaction.operation}>
        {String(new Date(Number(transaction.timestamp)).toLocaleString())}
      </td>
      <td>
        <div className="flex items-center justify-center w-20 h-20">
          <div
            onClick={() => {
              setEditId(transaction.id);
            }}
            className="edit-btn w-10 h-10"
          >
            <img
              className="object-cover w-full h-full"
              src={"./images/edit.png"}
              alt="Edit"
            />
          </div>
        </div>
      </td>
    </tr>
  );
};

export const EditTableRow: React.FC<EditTableRowComponentProps> = ({
  transaction,
  setEditId,
  mapIndex,
  updateHistoryState,
}) => {
  const [currentTransaction, setCurrentTransaction] = useState<Transaction>({
    id: Number(transaction.id),
    operation: String(transaction.operation),
    what: String(transaction.what),
    frominstrument: String(transaction.frominstrument),
    toinstrument: String(transaction.toinstrument),
    frominron: Number(transaction.frominron),
    toinron: Number(transaction.toinron),
    fees: String(transaction.fees),
    amount: Number(transaction.amount),
    timestamp: Number(transaction.timestamp),
  });

  function handleChange(key: string, value: number | string) {
    const oldTransaction: Transaction = { ...currentTransaction };
    oldTransaction[key] = value;
    setCurrentTransaction(oldTransaction);
  }
  
  return (
    <tr key={currentTransaction.id}>
      <td className={currentTransaction.operation}>{mapIndex + 1}</td>
      <td className={currentTransaction.operation}>
        <select
          value={currentTransaction.operation}
          onChange={(e) => handleChange("operation", e.target.value)}
          className="choice mt-2"
          id="operation"
          name="operation"
        >
          {["BUY", "SELL", "EXCHANGE", "TRANSFER"].map((operation, index) => (
            <option key={index} value={operation}>
              {operation}
            </option>
          ))}
        </select>
      </td>
      <td className={currentTransaction.operation}>
        <select
          value={currentTransaction.frominstrument}
          onChange={(e) => handleChange("frominstrument", e.target.value)}
          className="choice mt-2"
          id="frominstrument"
          name="frominstrument"
        >
          {["Exchange", "Wallet", ...instruments].map(
            (frominstrument, index) => (
              <option key={index} value={frominstrument}>
                {frominstrument}
              </option>
            )
          )}
        </select>
      </td>
      <td className={currentTransaction.operation}>
        <select
          value={currentTransaction.toinstrument}
          onChange={(e) => handleChange("toinstrument", e.target.value)}
          className="choice mt-2"
          id="toinstrument"
          name="toinstrument"
        >
          {["Exchange", "Wallet", ...instruments].map((toinstrument, index) => (
            <option key={index} value={toinstrument}>
              {toinstrument}
            </option>
          ))}
        </select>
      </td>
      <td className={currentTransaction.operation}>
        <input
          value={currentTransaction.frominron}
          onChange={(e) => {
            if (Number(e.target.value) >= 0) {
              handleChange("frominron", Number(e.target.value));
            }
          }}
          type="number"
          id="frominron"
          name="frominron"
          step="0.01"
        />
      </td>
      <td className={currentTransaction.operation}>
        <input
          value={currentTransaction.toinron}
          onChange={(e) => {
            if (Number(e.target.value) >= 0) {
              handleChange("toinron", Number(e.target.value));
            }
          }}
          type="number"
          id="toinron"
          name="toinron"
          step="0.01"
        />
      </td>
      <td className={currentTransaction.operation}>
        <input
          value={currentTransaction.fees}
          onChange={(e) => handleChange("fees", e.target.value)}
          type="text"
          id="fees"
          name="fees"
        />
      </td>
      <td className={currentTransaction.operation}>
        <input
          value={currentTransaction.amount}
          onChange={(e) => {
            if (Number(e.target.value) > 0) {
              handleChange("amount", Number(e.target.value));
            }
          }}
          type="number"
          id="amount"
          name="amount"
          step="0.01"
        />
      </td>
      <td className={currentTransaction.operation}>
        <select
          value={
            currentTransaction.what !== "null"
              ? String(JSON.parse(currentTransaction.what)[0])
              : ""
          }
          onChange={(e) =>
            handleChange(
              "what",
              JSON.stringify([
                e.target.value,
                currentTransaction.what !== "null"
                  ? String(JSON.parse(currentTransaction.what)[1])
                  : "",
              ])
            )
          }
          className="choice mt-2"
          id="whatfirst"
          name="whatfirst"
        >
          <option value="" disabled></option>
          {cryptos.map((crypto, index) => (
            <option key={index} value={crypto}>
              {crypto}
            </option>
          ))}
        </select>
      </td>
      <td className={currentTransaction.operation}>
        <input
          value={
            currentTransaction.what !== "null"
              ? String(JSON.parse(currentTransaction.what)[1])
              : ""
          }
          onChange={(e) =>
            handleChange(
              "what",
              JSON.stringify([
                currentTransaction.what !== "null"
                  ? String(JSON.parse(currentTransaction.what)[0])
                  : "",
                e.target.value,
              ])
            )
          }
          type="text"
          id="whatsecond"
          name="whatsecond"
        />
      </td>
      <td className={currentTransaction.operation}>
        <input
          value={moment(currentTransaction.timestamp).format(
            "YYYY-MM-DDTHH:mm"
          )}
          onChange={(e) =>
            handleChange("timestamp", new Date(e.target.value).getTime())
          }
          type="datetime-local"
          id="timestamp"
          name="timestamp"
        />
      </td>
      <td>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => updateTransaction(updateHistoryState, currentTransaction, transaction, mapIndex, validateTransaction, setEditId)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
          <button
            onClick={() => deleteTransaction(updateHistoryState, currentTransaction, mapIndex)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};
