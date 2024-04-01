import { useState } from "react";
import "../../css/Form.css";
import { cryptos } from "../../Instruments";
import { FeeInputsComponent } from "./FeeComponent";

type historyInterface = {
  operation: "TRANSFER";
  what: string;
  frominstrument: string;
  toinstrument: string;
  fees: string;
  amount: number;
  timestamp: number;
};

function validateInputs(
  from: string,
  to: string,
  currency: string,
  txLink: string,
  amount: string,
  feeInputs: any[],
  date: string
) {
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

export default function TransferFormComponent() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [currency, setCurrency] = useState("");
  const [txLink, setTxLink] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [feeInputs, setFeeInputs] = useState([{ instrument: "", amount: "" }]);

  async function handler() {
    if (!validateInputs(from, to, currency, txLink, amount, feeInputs, date))
      return;

    const timeStamp = new Date(date).getTime();
    const newHistory: historyInterface = {
      operation: "TRANSFER",
      what: JSON.stringify([currency, txLink]),
      frominstrument: from,
      toinstrument: to,
      fees: JSON.stringify(feeInputs),
      amount: Number(amount),
      timestamp: timeStamp,
    };

    const JWTToken = localStorage.getItem("JWTToken");
    if (!JWTToken) {
      alert("Please SignIn first!");
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_API}/SaveTransaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: JWTToken,
        },
        body: JSON.stringify(newHistory),
      }
    );
    if (!response.ok) {
      alert("Error saving the transaction! (API -> backend -> API)");
      return;
    }

    setFrom("");
    setTo("");
    setCurrency("");
    setTxLink("");
    setAmount("");
    setDate("");
    setFeeInputs([{ instrument: "", amount: "" }]);
  }

  return (
    <div className="investment-form">
      <div className="form-title">Transfer</div>
      <div className="flex justify-between">
        <span
          title="Select the starting point for the transfer transaction."
          style={{ cursor: "help" }}
        >
          From:
        </span>
        <span
          title="Select the destination for the transfer transaction."
          style={{ cursor: "help" }}
        >
          To:
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="choice"
          id="from-account"
          name="from-account"
          title="from-account"
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
          title="to-account"
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
      <span
        title="Select the cryptocurrency you transferred in this transaction."
        style={{ cursor: "help" }}
      >
        Cryptocurrency:
      </span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="choice"
        id="transfered-currency"
        name="transfered-currency"
        title="transfered-currency"
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
      <span
        title="Enter the amount of the chosen cryptocurrency to be transferred in this transaction."
        style={{ cursor: "help" }}
      >
        Amount:
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
        id="transfer-amount"
        name="transfer-amount"
        title="transfer-amount"
        required
      />
      <span
        title="Enter the blockchain explorer link of this transaction for evidence."
        style={{ cursor: "help" }}
      >
        Transaction link:
      </span>
      <input
        placeholder="https://www.explorer.com"
        value={txLink}
        onChange={(e) => setTxLink(e.target.value)}
        type="text"
        id="tx-link"
        name="tx-link"
        title="tx-link"
      />
      <span
        title="Select the precise time at which you transferred this transaction."
        style={{ cursor: "help" }}
      >
        Date:
      </span>
      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="datetime-local"
        id="transfer-date"
        name="transfer-date"
        title="transfer-date"
        required
      />
      <FeeInputsComponent feeInputs={feeInputs} setFeeInputs={setFeeInputs} />
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
