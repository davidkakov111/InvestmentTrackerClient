import { useEffect, useState } from "react";
import {
  getTotalInvestedAmount,
  getTax,
  ballanceAndProfitByCrypto,
  roundToTwoDecimalPlaces,
} from "./Utils/StatisticsFunctions";

export function StatisticsComponent() {
  const [history, setHistory] = useState<any[]>([]);
  const [minimumGrossWage, setMinimumGrossWage] = useState<string>("");
  const [taxableProfit, setTaxableProfit] = useState<number>();
  const [ballancesAndProfit, setBallancesAndProfit] = useState<{}>();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8080/GetTransactions", {
          credentials: "include",
        });
        if (!response.ok) {
          alert("Failed to fetch transactions history");
        }
        // Parse the JSON response
        const transactions: any[] = await response.json();
        // Sort it to cronological order
        if (transactions.length > 1) {
          transactions.sort((a, b) => {
            return Number(a.timestamp) - Number(b.timestamp);
          });
        }
      
        const currentBallancesAndProfits = ballanceAndProfitByCrypto(transactions)
        let TaxableProfit = 0
        for (let i in currentBallancesAndProfits) {
          TaxableProfit += currentBallancesAndProfits[i].profit
        }

        setHistory(transactions);
        setBallancesAndProfit(currentBallancesAndProfits)
        setTaxableProfit(roundToTwoDecimalPlaces(TaxableProfit))
      } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error("Error fetching transactions:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div className="bg-black border-4 border-green-500 rounded-lg p-4 max-w-xs">
          <p className="text-green-500">
            Total number of transactions: {history?.length}
          </p>
        </div>
        <div className="bg-black border-4 border-green-500 rounded-lg p-4 max-w-xs">
          <p className="text-green-500">
            Total invested: {getTotalInvestedAmount(history)} RON
          </p>
        </div>
        <div className="bg-black border-4 border-green-500 rounded-lg p-4 max-w-xs">
          <p className="text-green-500">
            Total realized taxable profit: {taxableProfit} RON
          </p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="bg-black border-4 border-green-500 rounded-lg p-4 max-w-md m-3">
          <p className="text-green-500 text-center text-2xl pb-3">
            Tax calculator
          </p>
          <label className="text-green-500" htmlFor="min-salary">
            Please provide the minimum gross wage in RON for the year{" "}
            {new Date().getFullYear() - 1} in Romania:
          </label>
          <input
            placeholder="0"
            value={minimumGrossWage}
            onChange={(e) => setMinimumGrossWage(e.target.value)}
            type="number"
            id="min-salary"
            name="min-salary"
            step="0.01"
          />
          {minimumGrossWage ? (
            <p className="text-green-500 text-xl">
              You should pay: <b>{getTax(1000, Number(minimumGrossWage))}</b> RON Tax
            </p>
          ) : (<></>)}
        </div>
      </div>
    </>
  );
}
