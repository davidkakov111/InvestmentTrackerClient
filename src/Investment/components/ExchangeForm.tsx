import { useState } from "react";
import "../css/Form.css";
import { fiats, instruments } from "../Instruments";

type historyInterface = {
  operation: string;
  frominstrument: string;
  toinstrument: string;
  frominron: number;
  toinron: number;
  feeinron: number;
  amount: number;
  timestamp: number;
};

function validateInputs (from: string, to: string, fromInRon: string, toInRon: string, feeInRON: string, amount: string, date: string, operation: string) {
  if (
    !from ||
    !to ||
    !fromInRon ||
    !toInRon ||
    !feeInRON ||
    !amount ||
    !date
  ) {
    alert("All the fields are required!");
    return false;
  }
  if (operation === "BUY" || operation === "SELL") {
    if (!fiats.includes(from)) {
      if (!fiats.includes(to)) {
        alert(
          "You can only buy or sell cryptocurrencies with fiat. Otherwise, you need to exchange them. Please use the exchange button!"
        );
        return false;
      }
    }
  }
  if (
    Number(fromInRon) < 0 ||
    Number(toInRon) < 0 ||
    Number(feeInRON) < 0 ||
    Number(amount) < 0
  ) {
    alert("Number(s) can't be negative!");
    return false;
  }
  return true;
}

export default function ExchangeFormComponent() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromInRon, setFromInRon] = useState("");
  const [toInRon, setToInRon] = useState("");
  const [feeInRON, setFeeInRON] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  async function handler(operation: string) {
    if (!validateInputs(from, to, fromInRon, toInRon, feeInRON, amount, date, operation)) return

    const timeStamp = new Date(date).getTime();
    const newHistory: historyInterface = {
      operation: operation,
      frominstrument: from,
      toinstrument: to,
      frominron: Number(fromInRon),
      toinron: Number(toInRon),
      feeinron: Number(feeInRON),
      amount: Number(amount),
      timestamp: timeStamp,
    };

    const response = await fetch("http://localhost:8080/SaveTransaction", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newHistory),
    });
    if (!response.ok) {
      alert("Error saving the transaction! (API -> backend -> API)");
      return;
    }

    setFrom("");
    setTo("");
    setFromInRon("");
    setToInRon("");
    setFeeInRON("");
    setAmount("");
    setDate("");
  }

  return (
    <div className="investment-form">
      <div className="form-title">Trade</div>
      <label htmlFor="from">From:</label>
      <select
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="choice"
        id="from"
        name="from"
        required
      >
        <option value="" disabled>
          From
        </option>
        {instruments.map((inst, index) => (
          <option key={index} value={inst}>
            {inst}
          </option>
        ))}
      </select>
      <label htmlFor="to">To:</label>
      <select
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="choice"
        id="to"
        name="to"
        required
      >
        <option value="" disabled>
          To
        </option>
        {instruments.map((inst, index) => (
          <option key={index} value={inst}>
            {inst}
          </option>
        ))}
      </select>
      <label htmlFor="from-in-ron">{from ? from : "From"} Price In RON:</label>
      <input
        placeholder="0"
        value={fromInRon}
        onChange={(e) => setFromInRon(e.target.value)}
        type="number"
        id="from-in-ron"
        name="from-in-ron"
        step="0.01"
        required
      />
      <label htmlFor="to-in-ron">{to ? to : "To"} Price In RON:</label>
      <input
        placeholder="0"
        value={toInRon}
        onChange={(e) => setToInRon(e.target.value)}
        type="number"
        id="to-in-ron"
        name="to-in-ron"
        step="0.01"
        required
      />
      <label htmlFor="amount">Amount ({from ? from : "From"}):</label>
      <input
        placeholder="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        id="amount"
        name="amount"
        required
      />
      <label htmlFor="fee">Fee in RON:</label>
      <input
        placeholder="0"
        value={feeInRON}
        onChange={(e) => setFeeInRON(e.target.value)}
        type="number"
        id="fee"
        name="fee"
        required
      />
      <label htmlFor="date">Date:</label>
      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="datetime-local"
        id="date"
        name="date"
        required
      />
      <div className="button-box">
        <button
          className="Buy button"
          onClick={() => {
            handler("BUY");
          }}
        >
          Buy
        </button>
        <button
          className="Sell button"
          onClick={() => {
            handler("SELL");
          }}
        >
          Sell
        </button>
        <button
          className="Exchange button"
          onClick={() => {
            handler("EXCHANGE");
          }}
        >
          Exchange
        </button>
      </div>
    </div>
  );
}
