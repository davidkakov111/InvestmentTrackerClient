import { useState } from "react";
import "../css/Form.css";
import { instruments } from "../Instruments";

type historyInterface = {
  operation: "TRANSFER",
  what: string,
  frominstrument: string,
  toinstrument: string,
  feeinron: number,
  amount: number,
  timestamp: number
}

function validateInputs(from: string, to: string, currency: string, txLink: string, amount: string, feeInRON: string, date: string) {
  if (
    !from ||
    !to ||
    !currency ||
    !txLink ||
    !amount ||
    !feeInRON ||
    !date
  ) {
    alert("All the fields are required!");
    return false;
  }
  if (
    Number(feeInRON) < 0 ||
    Number(amount) < 0
  ) {
    alert("Number(s) can't be negative!");
    return false;
  }
  return true;
}

export default function TransferFormComponent() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [currency, setCurrency] = useState("");
  const [txLink, setTxLink] = useState("");
  const [amount, setAmount] = useState("");
  const [feeInRON, setFeeInRON] = useState("");
  const [date, setDate] = useState("");

  async function handler() {
    if(!validateInputs(from, to, currency, txLink, amount, feeInRON, date)) return;

    const timeStamp = new Date(date).getTime()
    const newHistory: historyInterface = {
      operation: "TRANSFER",
      what: JSON.stringify([currency, txLink]),
      frominstrument: from,
      toinstrument: to,
      feeinron: Number(feeInRON),
      amount: Number(amount),
      timestamp: timeStamp
    }

    const response = await fetch('http://localhost:8080/SaveTransaction', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(newHistory)
      }
    )
    if (!response.ok) {
      alert("Error saving the transaction! (API -> backend -> API)")
      return;
    }

    setFrom("");
    setTo("");
    setCurrency("");
    setTxLink("");
    setAmount("");
    setFeeInRON("");
    setDate("");
  }

  return (
    <div className="investment-form">
      <div className="form-title">Transfer</div>
      <label htmlFor="from-account">From:</label>
      <input 
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        type="text" 
        id="from-account" 
        name="from-account"
      />
      <label htmlFor="to-account">To:</label>
      <input 
        value={to}
        onChange={(e) => setTo(e.target.value)}
        type="text" 
        id="to-account" 
        name="to-account"
      />
      <label htmlFor="transfer-amount">Amount:</label>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        id="transfer-amount"
        name="transfer-amount"
        required
      />
      <label htmlFor="transfer-fee">Fee in RON:</label>
      <input
        value={feeInRON}
        onChange={(e) => setFeeInRON(e.target.value)}
        type="number"
        id="transfer-fee"
        name="transfer-fee"
        required
      />
      <label htmlFor="transfered-currency">Currency:</label>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="choice"
        id="transfered-currency"
        name="transfered-currency"
        required
      >
        <option value="" disabled>
          Currency
        </option>
        {instruments.map((inst, index) => (
          <option key={index} value={inst}>
            {inst}
          </option>
        ))}
      </select>
      <label htmlFor="tx-link">Transaction link:</label>
      <input 
        value={txLink}
        onChange={(e) => setTxLink(e.target.value)}
        type="text" 
        id="tx-link" 
        name="tx-link"
      />
      <label htmlFor="transfer-date">Date:</label>
      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="datetime-local"
        id="transfer-date"
        name="transfer-date"
        required
      />
      <button
        className="button transfer-btn"
        onClick={() => {
        handler();
        }}
      >
        Transfer
      </button>
    </div>
  );
}
