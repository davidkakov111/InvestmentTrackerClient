import { cryptos, fiats, instruments } from "../../Instruments";
import { BodyTransaction, Transaction } from "./interfaces";

export function deleteTransaction(updateHistoryState: (
    currentTransaction: BodyTransaction,
    mapIndex: number,
    del: Boolean
  ) => void, currentTransaction: Transaction, mapIndex: number) {
  if (
    !window.confirm(
      "Are you sure you want to delete the selected transaction?"
    )
  )
    return;
  const JWTToken = localStorage.getItem("JWTToken");
  if (!JWTToken) {
    alert("Please SignIn first!");
    return;
  }
  fetch(`${process.env.REACT_APP_BACKEND_API}/DeleteTransaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JWTToken,
    },
    body: JSON.stringify({ id: currentTransaction.id }),
  })
    .then((response) => {
      if (!response.ok) {
        alert("Error deleting the transaction! (API -> backend -> API)");
        return;
      }
      updateHistoryState(currentTransaction, mapIndex, true);
      alert("Successfull delete!");
    })
    .catch((error) => {
      alert(
        "There was a problem with the transaction deleter fetch operation."
      );
      console.error(
        "There was a problem with the transaction deleter fetch operation:",
        error
      );
    });
}

export function updateTransaction(updateHistoryState: (
    currentTransaction: BodyTransaction,
    mapIndex: number,
    del: Boolean
  ) => void, 
  currentTransaction: Transaction, 
  transaction: Transaction,
  mapIndex: number, 
  validateTransaction: (currentTransaction:Transaction)=>Boolean,
  setEditId: React.Dispatch<React.SetStateAction<number>>
  ) {
  if (!validateTransaction(currentTransaction)) return;
  if (currentTransaction.operation === "TRANSFER") {
    if (
      currentTransaction.operation === String(transaction.operation) &&
      currentTransaction.what === String(transaction.what) &&
      currentTransaction.frominstrument ===
        String(transaction.frominstrument) &&
      currentTransaction.toinstrument === String(transaction.toinstrument) &&
      currentTransaction.fees === String(transaction.fees) &&
      currentTransaction.amount === Number(transaction.amount) &&
      currentTransaction.timestamp === Number(transaction.timestamp)
    ) {
      setEditId(-1);
      return;
    }
  } else {
    if (
      currentTransaction.operation === String(transaction.operation) &&
      currentTransaction.frominstrument ===
        String(transaction.frominstrument) &&
      currentTransaction.toinstrument === String(transaction.toinstrument) &&
      currentTransaction.frominron === Number(transaction.frominron) &&
      currentTransaction.toinron === Number(transaction.toinron) &&
      currentTransaction.fees === String(transaction.fees) &&
      currentTransaction.amount === Number(transaction.amount) &&
      currentTransaction.timestamp === Number(transaction.timestamp)
    ) {
      setEditId(-1);
      return;
    }
  }
  let body: BodyTransaction = { ...currentTransaction };
  if (currentTransaction.operation === "TRANSFER") {
    body["frominron"] = null;
    body["toinron"] = null;
  } else {
    body["what"] = JSON.stringify(null);
  }
  const JWTToken = localStorage.getItem("JWTToken");
  if (!JWTToken) {
    alert("Please SignIn first!");
    return;
  }
  fetch(`${process.env.REACT_APP_BACKEND_API}/UpdateTransaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JWTToken,
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (!response.ok) {
        alert("Error updating the transaction! (API -> backend -> API)");
        return;
      }
      updateHistoryState(body, mapIndex, false);
      setEditId(-1);
      alert("Successfull update!");
    })
    .catch((error) => {
      alert(
        "There was a problem with the transaction updater fetch operation."
      );
      console.error(
        "There was a problem with the transaction updater fetch operation:",
        error
      );
    });
}

export async function fetchTransactionHistory() {
  try {
    const JWTToken = localStorage.getItem("JWTToken");
    if (!JWTToken) {
      alert("Please SignIn first!");
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_API}/GetTransactions`,
      {
        method: "GET",
        headers: {
          Authorization: JWTToken,
        },
      }
    );
    if (!response.ok) {
      alert("Failed to fetch transactions history");
      return;
    }
    // Parse the JSON response
    const transactions: any[] = await response.json();
    // Sort it to cronological order
    if (transactions.length > 1) {
      transactions.sort((a, b) => {
        return Number(a.timestamp) - Number(b.timestamp);
      });
    }
    return transactions;
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error("Error fetching transactions:", error);
  }
}

export function validateTransaction(transaction: Transaction) {
  if (transaction.operation === "TRANSFER") {
    if (
      !["Exchange", "Wallet"].includes(transaction.frominstrument) ||
      !["Exchange", "Wallet"].includes(transaction.toinstrument)
    ) {
      alert("You can only transfer between Exchange and Wallet.");
      return false;
    }
    if (!JSON.parse(transaction.what)) {
      alert(
        "You should provide the transferred instrument and the transaction link."
      );
      return false;
    }
    if (!cryptos.includes(JSON.parse(transaction.what)[0])) {
      alert("You can only transfer cryptocurrency.");
      return false;
    }
    if (!JSON.parse(transaction.what)[1]) {
      alert("For evidence, provide the transaction link.");
      return false;
    }
  } else {
    if (transaction.operation === "BUY") {
      if (
        !fiats.includes(transaction.frominstrument) ||
        !cryptos.includes(transaction.toinstrument)
      ) {
        alert("You can only buy cryptocurrencies with fiat.");
        return false;
      }
    } else if (transaction.operation === "SELL") {
      if (
        !cryptos.includes(transaction.frominstrument) ||
        !fiats.includes(transaction.toinstrument)
      ) {
        alert("You can only sell cryptocurrencies to fiat.");
        return false;
      }
    } else {
      if (
        !cryptos.includes(transaction.frominstrument) ||
        !cryptos.includes(transaction.toinstrument)
      ) {
        alert("Exchange is only for crypto-to-crypto transactions.");
        return false;
      }
    }
  }
  try {
    for (let fee of JSON.parse(transaction.fees)) {
      if (!fee.instrument || !fee.amount || !fee.priceInRON || !instruments.includes(fee.instrument) || Number(fee.amount) < 0 || Number(fee.priceInRON) < 0) {
        alert("Fee input(s) invalid!");
        return false;
      }
    }
  } catch {
    alert("Fee input(s) invalid!");
    return false;
  }
  const oldestTS = new Date("2009-01-03").getTime();
  const transactionTS = new Date(transaction.timestamp).getTime();
  const currentTS = new Date().getTime();
  if (transactionTS < oldestTS || transactionTS > currentTS) {
    alert("The transaction date is impossible!");
    return false;
  }
  return true;
}
