import { useState } from "react";
import "../css/Form.css";
import { fiats, instruments } from "../Instruments";
import { FeeInputsComponent } from "./FeeComponent";

type historyInterface = {
  operation: string;
  frominstrument: string;
  toinstrument: string;
  frominron: number;
  toinron: number;
  fees: string;
  amount: number;
  timestamp: number;
};

function validateInputs(
  from: string,
  to: string,
  fromInRon: string,
  toInRon: string,
  amount: string,
  date: string,
  feeInputs: any[],
  operation: string
) {
  if (
    !from ||
    !to ||
    !fromInRon ||
    !toInRon ||
    !amount ||
    !date ||
    feeInputs.length === 0
  ) {
    alert("All the fields are required!");
    return false;
  }
  if (operation === "BUY") {
    if (!fiats.includes(from) || fiats.includes(to)) {
      alert("You can only buy cryptocurrencies with fiat.");
      return false;
    }
  } else if (operation === "SELL") {
    if (fiats.includes(from) || !fiats.includes(to)) {
      alert("You can only sell cryptocurrencies to fiat.");
      return false;
    }
  } else {
    if (fiats.includes(from) || fiats.includes(to)) {
      alert(
        "Exchange is only for crypto-to-crypto transactions. In this case, you should either buy or sell."
      );
      return false;
    }
  }

  for (let fee of feeInputs) {
    if (!fee.instrument || !fee.amount) {
      alert("Fee input(s) can't be empty!");
      return false;
    }
  }

  const oldestTS = new Date("2009-01-03").getTime();
  const transactionTS = new Date(date).getTime();
  const currentTS = new Date().getTime();

  if (transactionTS < oldestTS || transactionTS > currentTS) {
    alert("The transaction date is impossible!");
    return false;
  }

  return true;
}

export default function ExchangeFormComponent() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromInRon, setFromInRon] = useState("");
  const [toInRon, setToInRon] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [feeInputs, setFeeInputs] = useState([{ instrument: "", amount: "" }]);

  async function handler(operation: string) {
    if (
      !validateInputs(
        from,
        to,
        fromInRon,
        toInRon,
        amount,
        date,
        feeInputs,
        operation
      )
    )
      return;

    const timeStamp = new Date(date).getTime();
    const newHistory: historyInterface = {
      operation: operation,
      frominstrument: from,
      toinstrument: to,
      frominron: Number(fromInRon),
      toinron: Number(toInRon),
      fees: JSON.stringify(feeInputs),
      amount: Number(amount),
      timestamp: timeStamp,
    };

    const response = await fetch("https://investment-tracker-server.vercel.app/SaveTransaction", {
      method: "POST",
      credentials: "include",
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
    setAmount("");
    setDate("");
    setFeeInputs([{ instrument: "", amount: "" }]);
  }

  return (
    <div className="investment-form">
      <div className="form-title">Trade</div>
      <div className="flex justify-between">
        <span
          title="Select the instrument (fiat currency or cryptocurrency) used to make this transaction. For instance, if you traded EUR for BTC, select EUR."
          style={{ cursor: "help" }}
        >
          From:
        </span>
        <span title="Enter the price of this instrument (fiat currency or cryptocurrency) in RON (Romanian Leu)." style={{ cursor: "help" }}>
          {from ? from : "From"} Price In RON:
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="choice mt-2"
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
        <input
          placeholder="0"
          value={fromInRon}
          onChange={(e) => {
            if (Number(e.target.value) >= 0) {
              setFromInRon(e.target.value);
            }
          }}
          type="number"
          id="from-in-ron"
          name="from-in-ron"
          step="0.01"
          required
        />
      </div>
      <div className="flex justify-between">
        <span
          title="Select the instrument (fiat currency or cryptocurrency) for which you made this transaction. For instance, if you traded EUR for BTC, select BTC."
          style={{ cursor: "help" }}
        >
          To:
        </span>
        <span title="Enter the price of this instrument (fiat currency or cryptocurrency) in RON (Romanian Leu)." style={{ cursor: "help" }}>
          {to ? to : "To"} Price In RON:
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="choice mt-2"
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
        <input
          placeholder="0"
          value={toInRon}
          onChange={(e) => {
            if (Number(e.target.value) >= 0) {
              setToInRon(e.target.value);
            }
          }}
          type="number"
          id="to-in-ron"
          name="to-in-ron"
          step="0.01"
          required
        />
      </div>
      <span title="Enter the amount you traded in this transaction using the first (from) instrument. For example, if you traded 1 EUR for BTC, then enter 1." style={{ cursor: "help" }}>
        Amount ({from ? from : "From"}):
      </span>
      <input
        placeholder="0"
        value={amount}
        onChange={(e) => {
          if (Number(e.target.value) >= 0) {
            setAmount(e.target.value);
          }
        }}
        type="number"
        id="amount"
        name="amount"
        required
      />
      <span title="Select the precise time at which you made this transaction." style={{ cursor: "help" }}>
        Date:
      </span>
      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="datetime-local"
        id="date"
        name="date"
        required
      />
      <FeeInputsComponent feeInputs={feeInputs} setFeeInputs={setFeeInputs} />
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
