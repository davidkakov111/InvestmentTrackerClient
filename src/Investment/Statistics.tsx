import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";
import {
  getTax,
  getTotalInvestedAmount,
  ProfitByCrypto,
  roundToTwoDecimalPlaces,
} from "./Utils/StatisticsFunctions";
import "./css/Statistics.css";
import { NoTrHistoryWinow } from "../mainComponents/NoTrHistory";
import LoadingComponent from "../mainComponents/LoadingComponent";

export function StatisticsComponent() {
  const [history, setHistory] = useState<any[]>([]);
  const [minimumGrossWage, setMinimumGrossWage] = useState<string>("");
  const [taxableProfit, setTaxableProfit] = useState<number>(0);
  const [Profits, setProfits] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [totalInvestedAmount, setTotalInvestedAmount] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const JWTToken = localStorage.getItem('JWTToken');
        if (!JWTToken) {alert("Please SignIn first!"); return}  

        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/GetTransactions`, {
          method: "GET",
          headers: {
            "Authorization": JWTToken
          },
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

        const currentProfits = ProfitByCrypto(transactions);
        
        let TaxableProfit = 0;
        let chartData = [];
        for (let i in currentProfits) {
          const current = currentProfits[i];
          TaxableProfit += current;
          if (i !== "fiatFees") {
            const profit = roundToTwoDecimalPlaces(current);
            chartData.push({ asset: i, profit: profit });
          }
        }

        setTotalInvestedAmount(getTotalInvestedAmount(transactions))
        setHistory(transactions);
        setProfits(chartData);
        setTaxableProfit(roundToTwoDecimalPlaces(TaxableProfit));
      } catch (error) {
        console.error("Error fetching transactions or calculating statistics:", error);
      }
      setLoading(false)
    }
    fetchData();
  }, []);

  if (loading) return <LoadingComponent/>

  // Defining width for charts
  const barcontainerWidth =
    window.innerWidth < 900 ? window.innerWidth : window.innerWidth / 1.1;

  const [incomeTax, CASS] = getTax(taxableProfit, Number(minimumGrossWage))

  return (<>
    {history && history.length > 0 ? (
      <>
        <div className="flex justify-center">
          <div className="bg-black border-2 border-green-500 rounded-lg p-4 max-w-md m-3">
            <p className="text-green-500 text-center text-2xl pb-3">
              Tax calculator
            </p>
            <label className="text-green-500" htmlFor="min-salary">
              Provide the minimum gross wage in RON for the year{" "}
              {new Date().getFullYear() - 1} in Romania (It is necessary to calculate your taxes accurately.):
            </label>
            <input
              placeholder="0"
              value={minimumGrossWage}
              onChange={(e) => {
                if (Number(e.target.value) >= 0) {
                  setMinimumGrossWage(e.target.value);
                }
              }}
              type="number"
              id="min-salary"
              name="min-salary"
              step="0.01"
            />
            {minimumGrossWage ? (
              <p className="text-green-500 text-xl">
                You should pay <b>{incomeTax}</b> RON in income tax and <b>{CASS}</b> RON in <abbr title="'Contribuția de Asigurări Sociale de Sănătate' (Contribution for Health Insurance)">CASS</abbr> tax, so your total tax is <b>{incomeTax + CASS}</b> RON.
              </p>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-wrap gap-4">
            <div className="bg-black border-2 border-green-500 rounded-lg p-4 max-w-xs">
              <p className="text-green-500">
                Total invested: <b>{totalInvestedAmount}</b> RON
              </p>
            </div>
            <div className="bg-black border-2 border-green-500 rounded-lg p-4 max-w-xs">
              <p className="text-green-500">
                Total realized taxable profit: <b>{taxableProfit}</b> RON
              </p>
            </div>
          </div>
        </div>
        <br />
        <div
          style={{ width: barcontainerWidth }}
          className="justify-center bar-chart-container pt-5 pr-5 border-2 border-green-500"
        >
          <p className="text-green-500 text-center text-2xl pb-3">
            Realized profit in RON / Asset
          </p>
          <br />
          <BarChart
            width={barcontainerWidth}
            height={barcontainerWidth / 2.5}
            data={Profits}
          >
            <XAxis dataKey="asset" />
            <YAxis dataKey="profit" />
            <Tooltip />
            <Legend />
            <Bar dataKey="profit" fill="green" opacity={1} />
          </BarChart>
        </div>
        <br />
      </>
    ):( 
      <NoTrHistoryWinow title="Stats Unavailable: No History!" subtitle="No transaction history found or invalid. Double check for any cryptocurrency sales, exchanges or paid fees not previously purchased."/>
    )}
  </>);
}
