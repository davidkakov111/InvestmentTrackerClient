import { useState } from "react";
import { getTax, roundToTwoDecimalPlaces } from "./StatisticsFunctions";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";

interface StatisticsComponentProps {
  totalInvestedAmount: number,
  taxableProfit: number,
  above200profit: number,
  Profits: any[]
}

interface TaxCalculatorProps {
  taxableProfit: number,
  above200profit: number,
  Profits: any[]
}

export const StatisticsPanel: React.FC<StatisticsComponentProps> = ({ 
  totalInvestedAmount,
  taxableProfit,
  above200profit,
  Profits 
}) => {
  // Defining width for chart
  const barcontainerWidth =
    window.innerWidth < 900 ? window.innerWidth: window.innerWidth / 1.2;
  return (
    <>
      <br/>
      <TaxCalculator taxableProfit={taxableProfit} above200profit={above200profit} Profits={Profits}/>
      <div className="flex flex-wrap gap-4 justify-center">
        <div style={{border:"2px solid green"}} className="bg-black rounded-lg p-4 max-w-xs">
          <p className="text-green-500 text-lg">
            Total invested: <b>{totalInvestedAmount}</b> RON
          </p>
        </div>
        <div style={{border:"2px solid green"}} className="bg-black rounded-lg p-4 max-w-xs">
          <p className="text-green-500 text-lg">
            Total taxable profit: <b>{roundToTwoDecimalPlaces(taxableProfit)}</b> RON
          </p>
        </div>
      </div>
      <br/>
      <div
        style={{ width: barcontainerWidth }}
        className="justify-center bar-chart-container pt-5 pr-5 border-2 border-green-500"
      >
        <br/>
        <p className="text-green-500 text-center text-2xl pb-3">
          Profit or Loss in RON / Asset
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

const TaxCalculator: React.FC<TaxCalculatorProps> = ({taxableProfit, above200profit}) => {
  const [minimumGrossWage, setMinimumGrossWage] = useState<string>("");
  const [incomeTax, CASS] = getTax(taxableProfit, above200profit, Number(minimumGrossWage));

  return (<>
    <div className="flex justify-center">
      <div style={{border:"2px solid green"}} className="bg-black p-4 max-w-md m-3 rounded-lg">
        <p className="text-green-500 text-center text-2xl pb-3">
          Tax calculator
        </p>
        <label className="text-green-500" htmlFor={`min-salary`}>
          Provide the minimum gross wage in RON at the time of submitting the tax declaration in Romania, to accurately calculate your taxes:
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
          id={`min-salary`}
          name={`min-salary`}
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
  </>);
}
