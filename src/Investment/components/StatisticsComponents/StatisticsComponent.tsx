import { useState } from "react";
import { getTax } from "./StatisticsFunctions";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";

interface StatisticsComponentProps {
  totalInvestedAmount: number,
  taxableProfit: {FiatGain:number, AllGain:number}
  Profits: any[] | undefined,
}

interface TaxCalculatorProps {
  taxableProfit: number
}

export const StatisticsPanel: React.FC<StatisticsComponentProps> = ({ 
  totalInvestedAmount,
  taxableProfit,
  Profits 
}) => {
  // Defining width for chart
  const barcontainerWidth =
    window.innerWidth < 900 ? window.innerWidth: window.innerWidth / 1.2;
  return (
    <>
      <br/>
      <div className="flex flex-wrap gap-4 justify-center">
        <div style={{border:"2px solid green"}} className="bg-black rounded-lg p-4 max-w-xs">
          <p className="text-green-500 text-lg">
            Total invested: <b>{totalInvestedAmount}</b> RON
          </p>
        </div>
      </div>
      <br/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">  
        <div style={{backgroundColor:"#22543d", margin:'4px'}} className="md:col-span-1 text-center rounded-lg">
          <span
            title="Profits from both crypto-to-crypto exchanges and conversions to fiat currency, after deducting applicable fees."
            style={{ cursor: "help" }}
          >
            <p className="text-3xl mb-6 underline mt-2">Realized Gain (All Trades)</p>
          </span>
          <div className="border-2 border-green-500 rounded-lg p-4 max-w-xs">
            <p>
              Total realized taxable profit: <b>{taxableProfit.AllGain}</b> RON
            </p>
          </div>
          <TaxCalculator taxableProfit={taxableProfit.AllGain}/>
        </div>
        <div style={{backgroundColor:"#2F855A", margin:'4px'}} className="md:col-span-1 text-center rounded-lg"> 
          <span
            title="Profits that have been converted and realized in fiat currency, after deducting applicable fees."
            style={{ cursor: "help" }}
          >
            <p className="text-3xl mb-6 underline mt-2">FIAT Realized Gain</p>
          </span>
          <div className="border-2 rounded-lg border-green-500 p-4 max-w-xs">
            <p>
              Total realized taxable profit: <b>{taxableProfit.FiatGain}</b> RON
            </p>
          </div>
          <TaxCalculator taxableProfit={taxableProfit.FiatGain}/>
        </div>
      </div>
      <br/>
      <div
        style={{ width: barcontainerWidth }}
        className="justify-center bar-chart-container pt-5 pr-5 border-2 border-green-500"
      >
        <br/>
        <p className="text-green-500 text-center text-2xl pb-3">
          Realized gain in RON / Asset (All Trades)
        </p>
        <br />
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
  )
}

const TaxCalculator: React.FC<TaxCalculatorProps> = ({taxableProfit}) => {
  const [minimumGrossWage, setMinimumGrossWage] = useState<string>("");
  const [incomeTax, CASS] = getTax(taxableProfit, Number(minimumGrossWage));

  return(
  <>
    <div className="flex justify-center">
      <div className="bg-black border-2 border-green-500 rounded-lg p-4 max-w-md m-3">
        <p className="text-green-500 text-center text-2xl pb-3">
          Tax calculator
        </p>
        <label className="text-green-500" htmlFor={`min-salary ${taxableProfit}`}>
          Provide the minimum gross wage in RON for the year{" "}
          {new Date().getFullYear() - 1} in Romania (It is necessary to
          calculate your taxes accurately.):
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
          id={`min-salary ${taxableProfit}`}
          name={`min-salary ${taxableProfit}`}
          step="0.01"
        />
        {minimumGrossWage ? (
          <p className="text-green-500 text-xl">
            You should pay <b>{incomeTax}</b> RON in income tax and{" "}
            <b>{CASS}</b> RON in{" "}
            <abbr title="'Contribuția de Asigurări Sociale de Sănătate' (Contribution for Health Insurance)">
              CASS
            </abbr>{" "}
            tax, so your total tax is <b>{incomeTax + CASS}</b> RON.
          </p>
        ) : (
          <></>
        )}
      </div>
    </div>
    <br/>
  </>
  );
}
