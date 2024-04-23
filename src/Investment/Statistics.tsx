import { useEffect, useState } from "react";
import {
  ProfitByCrypto,
  roundToTwoDecimalPlaces,
} from "./components/StatisticsComponents/StatisticsFunctions";
import "./css/Statistics.css";
import { NoTrHistoryWinow } from "../mainComponents/NoTrHistory";
import LoadingComponent from "../mainComponents/LoadingComponent";
import { StatisticsPanel } from "./components/StatisticsComponents/StatisticsComponent";

export function StatisticsComponent() {
  const [history, setHistory] = useState<any[]>([]);
  const [taxableProfit, setTaxableProfit] = useState<number>(0);
  const [above200profit, setAbove200Profit] = useState<number>(0);
  const [Profits, setProfits] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [totalInvestedAmount, setTotalInvestedAmount] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
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
        }
        // Parse the JSON response
        const transactions: any[] = await response.json();
        // Sort it to cronological order
        if (transactions.length > 1) {
          transactions.sort((a, b) => {
            return Number(a.timestamp) - Number(b.timestamp);
          });
        }

        const [[Profit, investedAmount], above200profit]= ProfitByCrypto(transactions);
        let TaxableProfit = 0;
        let ProfitChartData: any[] = [];
        for (let i in Profit) {
          const current = Profit[i];
          TaxableProfit += current;
          if (i !== "fiatFees") {
            const profit = roundToTwoDecimalPlaces(current);
            ProfitChartData.push({ asset: i, profit: profit });
          } else {
            
          }
        }

        setTotalInvestedAmount(investedAmount);
        setHistory(transactions);
        setProfits(ProfitChartData);
        setTaxableProfit(TaxableProfit);
        setAbove200Profit(above200profit);
      } catch (error) {
        console.error(
          "Error fetching transactions or calculating statistics:",
          error
        );
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <LoadingComponent />;

  return (
    <>
      {history && history.length > 0 && Profits ? (
        <>
          <StatisticsPanel totalInvestedAmount={totalInvestedAmount} taxableProfit={taxableProfit} above200profit={above200profit} Profits={Profits}/>
          <br/>
        </>
      ) : (
        <NoTrHistoryWinow
          title="Stats Unavailable: No History!"
          subtitle="No transaction history found or invalid. Double check for any cryptocurrency sales, exchanges not previously purchased."
        />
      )}
    </>
  );
}
