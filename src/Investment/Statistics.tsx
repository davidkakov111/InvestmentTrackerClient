import { useEffect, useState } from "react";
import {
  getTotalInvestedAmount,
  ProfitByCrypto,
  roundToTwoDecimalPlaces,
} from "./components/StatisticsComponents/StatisticsFunctions";
import "./css/Statistics.css";
import { NoTrHistoryWinow } from "../mainComponents/NoTrHistory";
import LoadingComponent from "../mainComponents/LoadingComponent";
import { StatisticsPanel } from "./components/StatisticsComponents/StatisticsComponent";

export function StatisticsComponent() {
  const [history, setHistory] = useState<any[]>([]);
  const [taxableProfit, setTaxableProfit] = useState<{FiatGain:number, AllGain:number}>({FiatGain:0, AllGain:0});
  const [Profits, setProfits] = useState<{FiatGain:any[], AllGain:any[]}>();
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

        const [FiatGain, AllGain] = ProfitByCrypto(transactions);
        
        let TaxableFiatProfit = 0;
        let FiatGainChartData = [];
        for (let i in FiatGain) {
          const current = FiatGain[i];
          TaxableFiatProfit += current;
          if (i !== "fiatFees") {
            const profit = roundToTwoDecimalPlaces(current);
            FiatGainChartData.push({ asset: i, profit: profit });
          }
        }

        let TaxableAllProfit = 0;
        let AllGainChartData: any[] = [];
        for (let i in AllGain) {
          const current = AllGain[i];
          TaxableAllProfit += current;
          if (i !== "fiatFees") {
            const profit = roundToTwoDecimalPlaces(current);
            AllGainChartData.push({ asset: i, profit: profit });
          }
        }

        setTotalInvestedAmount(getTotalInvestedAmount(transactions));
        setHistory(transactions);
        setProfits({FiatGain: FiatGainChartData, AllGain: AllGainChartData});
        setTaxableProfit({FiatGain:roundToTwoDecimalPlaces(TaxableFiatProfit), AllGain:roundToTwoDecimalPlaces(TaxableAllProfit)});
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
      {history && history.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mx-2 mt-3">
          <div className="md:col-span-1 text-center bg-green-900 rounded-lg">
            <span
              title="Profits from both crypto-to-crypto exchanges and conversions to fiat currency, after deducting applicable fees."
              style={{ cursor: "help" }}
            >
              <p className="text-2xl mb-6 underline mt-2">Realized Gain (All Trades)</p>
            </span>
            <StatisticsPanel totalInvestedAmount={totalInvestedAmount} taxableProfit={taxableProfit.AllGain} Profits={Profits?.AllGain}/>
          </div>
          <div className="md:col-span-1 text-center bg-green-700 rounded-lg">
            <span
              title="Profits that have been converted and realized in fiat currency, after deducting applicable fees."
              style={{ cursor: "help" }}
            >
              <p className="text-2xl mb-6 underline mt-2">FIAT Realized Gain</p>
            </span>
            <StatisticsPanel totalInvestedAmount={totalInvestedAmount} taxableProfit={taxableProfit.FiatGain} Profits={Profits?.FiatGain}/>
          </div>
          <br/>
        </div>
      ) : (
        <NoTrHistoryWinow
          title="Stats Unavailable: No History!"
          subtitle="No transaction history found or invalid. Double check for any cryptocurrency sales, exchanges or paid fees not previously purchased."
        />
      )}
    </>
  );
}
