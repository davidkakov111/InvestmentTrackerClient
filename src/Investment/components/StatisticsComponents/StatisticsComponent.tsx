import { useState } from "react";
import { getTax } from "./StatisticsFunctions";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";

interface StatisticsComponentProps {
  totalInvestedAmount: number,
  taxableProfit: number,
  Profits: any[] | undefined,
}

export const StatisticsPanel: React.FC<StatisticsComponentProps> = ({ 
  totalInvestedAmount,
  taxableProfit,
  Profits 
}) => {
  const [minimumGrossWage, setMinimumGrossWage] = useState<string>("");
  const [incomeTax, CASS] = getTax(taxableProfit, Number(minimumGrossWage));

  // Defining width for chart
  const barcontainerWidth =
      window.innerWidth < 900 ? window.innerWidth: window.innerWidth / 2.2;
  return (
    <>
      <div className="flex justify-center">
        <div className="bg-black border-2 border-green-500 rounded-lg p-4 max-w-md m-3">
          <p className="text-green-500 text-center text-2xl pb-3">
            Tax calculator
          </p>
          <label className="text-green-500" htmlFor="min-salary">
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
            id="min-salary"
            name="min-salary"
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
  )
}
