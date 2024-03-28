import { useState } from "react";
import "../css/Form.css";
import { fiats, instruments } from "../Instruments";

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
  if (!from || !to || !fromInRon || !toInRon || !amount || !date || feeInputs.length === 0) {
    alert("All the fields are required!");
    return false;
  }
  if (operation === "BUY") {
    if (!fiats.includes(from) || fiats.includes(to)) {
      alert(
        "You can only buy cryptocurrencies with fiat."
      );
      return false;
    }
  } else if (operation === "SELL") {
    if (fiats.includes(from) || !fiats.includes(to)) {
      alert(
        "You can only sell cryptocurrencies to fiat."
      );
      return false;
    }
  } else {
    if (fiats.includes(from) || fiats.includes(to)) {
      alert("Exchange is only for crypto-to-crypto transactions. In this case, you should either buy or sell.");
      return false;
    }    
  }
  
  for (let fee of feeInputs) {
    if (!fee.instrument || !fee.amount || !fee.priceInRON) {
      alert("Fee input(s) can't be empty!")
      return false;
    }
  }

  const oldestTS = new Date('2009-01-03').getTime();
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
  const [feeInputs, setFeeInputs] = useState([{ instrument: '', amount: '', priceInRON:''}]);

  const handleAddFeeInput = () => {
    setFeeInputs([...feeInputs, { instrument: '', amount: '', priceInRON:''}])
  };

  const handleRemoveFeeInput = (index: number) => {
    let array = [...feeInputs]
    array.splice(index, 1);
    setFeeInputs(array)
  };

  const handleFeeChange = (index: number, value: string, field:"instrument"|"priceInRON"|"amount") => {
    const newInputs = [...feeInputs]
    newInputs[index][field] = value
    setFeeInputs(newInputs);
  };

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
    ) return;

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

    const response = await fetch("http://localhost:8080/SaveTransaction", {
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
    setFeeInputs([{ instrument: '', amount: '', priceInRON:''}]);
  }

  return (
    <div className="investment-form">
      <div className="form-title">Trade</div>
      <div className="flex justify-between">
        <label htmlFor="from">From:</label>
        <label htmlFor="from-in-ron">{from ? from : "From"} Price In RON:</label>
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
              setFromInRon(e.target.value)
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
        <label htmlFor="to">To:</label>
        <label htmlFor="to-in-ron">{to ? to : "To"} Price In RON:</label>
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
              setToInRon(e.target.value)
            }
          }}
          type="number"
          id="to-in-ron"
          name="to-in-ron"
          step="0.01"
          required
        />
      </div>


    
      <label htmlFor="amount">Amount ({from ? from : "From"}):</label>
      <input
        placeholder="0"
        value={amount}
        onChange={(e) => {
          if (Number(e.target.value) >= 0) {
            setAmount(e.target.value)
          }
        }}
        type="number"
        id="amount"
        name="amount"
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
      {feeInputs.map((value, index) => (
        <div key={index}>
          <div className="flex justify-between">
            <div>Fee paid in:</div>
            <div className="mx-auto">Fee amount:</div>
            <div>{value.instrument ? value.instrument : "Fee"} price in RON:</div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={value.instrument}
              onChange={(e) => handleFeeChange(index, e.target.value, "instrument")}
              className="choice mt-2"
              required
            >
              <option value="" disabled>
                Select
              </option>
              {instruments.map((inst, idx) => (
                <option key={idx} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
            <input
              placeholder="amount"
              type="number"
              value={value.amount}
              onChange={(e) => {
                if (Number(e.target.value) >= 0) {
                  handleFeeChange(index, e.target.value, "amount")
                }
              }}
            />
            <input
              placeholder="In RON"
              type="number"
              value={value.priceInRON}
              onChange={(e) => {
                if (Number(e.target.value) >= 0) {
                  handleFeeChange(index, e.target.value, "priceInRON")
                }}
              }
            />
            <button type="button" onClick={()=>{handleRemoveFeeInput(index)}} className="bg-red-500 text-2xl text-white rounded-md w-8 h-8 flex items-center justify-center">🗑</button>
          </div>
        </ div>
      ))}
      <button type="button" onClick={handleAddFeeInput} className="bg-green-500 text-white rounded-md w-12 h-8 flex items-center justify-center">+Fee</button>
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
