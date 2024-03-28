import { useState } from "react";
import "../css/Form.css";
import { cryptos, instruments } from "../Instruments";

type historyInterface = {
  operation: "TRANSFER",
  what: string,
  frominstrument: string,
  toinstrument: string,
  fees: string;
  amount: number,
  timestamp: number
}

function validateInputs(from: string, to: string, currency: string, txLink: string, amount: string, feeInputs: any[], date: string) {
  if (
    !from ||
    !to ||
    !currency ||
    !txLink ||
    !amount ||
    feeInputs.length === 0 ||
    !date
  ) {
    alert("All the fields are required!");
    return false;
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

export default function TransferFormComponent() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [currency, setCurrency] = useState("");
  const [txLink, setTxLink] = useState("");
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

  async function handler() {
    if(!validateInputs(from, to, currency, txLink, amount, feeInputs, date)) return;

    const timeStamp = new Date(date).getTime()
    const newHistory: historyInterface = {
      operation: "TRANSFER",
      what: JSON.stringify([currency, txLink]),
      frominstrument: from,
      toinstrument: to,
      fees: JSON.stringify(feeInputs),
      amount: Number(amount),
      timestamp: timeStamp
    }

    const response = await fetch('http://localhost:8080/SaveTransaction', 
      {
        method: 'POST',
        credentials: 'include',
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
    setDate("");
    setFeeInputs([{ instrument: '', amount: '', priceInRON:''}]);
  }

  return (
    <div className="investment-form">
      <div className="form-title">Transfer</div>     
      <div className="flex justify-between">
        <label htmlFor="from-account">From:</label>
        <label htmlFor="to-account">To:</label>
      </div>
      <div className="flex items-center space-x-4">
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="choice"
          id="from-account"
          name="from-account"
          required
        >
          <option value="" disabled>
            From
          </option>
          <option key={0} value={"Exchange"}>
            {"Exchange"}
          </option>
          <option key={1} value={"Wallet"}>
            {"Wallet"}
          </option>
        </select>
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="choice"
          id="to-account"
          name="to-account"
          required
        >
          <option value="" disabled>
            To
          </option>
          <option key={0} value={"Exchange"}>
            {"Exchange"}
          </option>
          <option key={1} value={"Wallet"}>
            {"Wallet"}
          </option>
        </select>
      </div> 
      <label htmlFor="transfered-currency">Cryptocurrency:</label>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="choice"
        id="transfered-currency"
        name="transfered-currency"
        required
      >
        <option value="" disabled>
          Cryptocurrency
        </option>
        {cryptos.map((inst, index) => (
          <option key={index} value={inst}>
            {inst}
          </option>
        ))}
      </select>
      <label htmlFor="transfer-amount">Amount:</label>
      <input
        placeholder="0"
        value={amount}
        onChange={(e) => { 
          if (Number(e.target.value) >= 0) {
            setAmount(e.target.value)
          }
        }}
        type="number"
        id="transfer-amount"
        name="transfer-amount"
        required
      />
      <label htmlFor="tx-link">Transaction link:</label>
      <input 
        placeholder="https://www.explorer.com"
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
            <button onClick={()=>{handleRemoveFeeInput(index)}} type="button" className="bg-red-500 text-2xl text-white rounded-md w-8 h-8 flex items-center justify-center">🗑</button>
          </div>
        </ div>
      ))}
      <button onClick={handleAddFeeInput} type="button" className="bg-green-500 text-white rounded-md w-12 h-8 flex items-center justify-center">+Fee</button>
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
