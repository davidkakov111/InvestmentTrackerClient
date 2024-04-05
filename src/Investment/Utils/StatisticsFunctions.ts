import { fiats } from "../Instruments";

interface averageBuyPrice {
  [key: string]: {avPrice: number, amount: number}
}
interface profits{
  [key: string]: number
}

export function getTax(taxableProfit: number, minimumGrossWage: number) {
  let CASS = 0
  let incomeTax = 0
  if (taxableProfit > 600) {
    incomeTax = taxableProfit * 0.1
  }
  if (taxableProfit > (minimumGrossWage * 6)) {
    CASS = (minimumGrossWage * 6) * 0.1
  }
  if (taxableProfit > (minimumGrossWage * 12)) {
    CASS = (minimumGrossWage * 12) * 0.1
  }
  if (taxableProfit > (minimumGrossWage * 24)) {
    CASS = (minimumGrossWage * 24) * 0.1
  }
  return [incomeTax, CASS]
}

export function ProfitByCrypto(history: any[]) {
  let averageBuyPrice: averageBuyPrice = averageBuyPriceAndBallance(history)
  let profitLoss: profits = RealizedProfitAndLoss(history, averageBuyPrice)
  const Profits = FeesDeducter(history, profitLoss, averageBuyPrice)
  const totalInvestedAmount = getTotalInvestedAmount(history, averageBuyPrice)
  const result: [profits, number]  = [Profits, totalInvestedAmount]
  return result
}

function averageBuyPriceAndBallance(history: any[]) {
  let averageBuyPrice: averageBuyPrice = {}
  for (let i of history) {
    if (i.operation === "BUY" || i.operation === "EXCHANGE") {
      if (averageBuyPrice[i.toinstrument]) {
        const alreadyPaid = (averageBuyPrice[i.toinstrument].avPrice * averageBuyPrice[i.toinstrument].amount) + (i.amount * i.frominron)
        const amount = averageBuyPrice[i.toinstrument].amount + ((i.amount * i.frominron) / i.toinron)
        const avPrice = alreadyPaid / amount
        averageBuyPrice[i.toinstrument] = {avPrice: avPrice, amount: amount}
      } else {
        averageBuyPrice[i.toinstrument] = {avPrice: i.toinron, amount: (i.amount * i.frominron) / i.toinron}
      }
    }
  }
  return averageBuyPrice;
}

function RealizedProfitAndLoss(history: any[], averageBuyPrice: averageBuyPrice) {
  const RealizedProfits: profits = {}
  for (let i of history) {
    if (i.operation === "SELL" || i.operation === "EXCHANGE") {
      const priceGap = i.frominron - averageBuyPrice[i.frominstrument].avPrice
      if (RealizedProfits[i.frominstrument]) {
        RealizedProfits[i.frominstrument] += (priceGap * i.amount)
      } else {
        RealizedProfits[i.frominstrument] = priceGap * i.amount
      }
    }
  }
  return RealizedProfits;
}

function FeesDeducter(history: any[], RealizedProfits: profits, averageBuyPrice: averageBuyPrice) {
  let result = {...RealizedProfits}
  for (let i of history) {
    const fee = JSON.parse(i.fees)
    for (let j of fee) {
      if (!fiats.includes(j.instrument)) {
        const feeInRON = j.amount * averageBuyPrice[j.instrument].avPrice
        if (result[j.instrument]) {
          result[j.instrument] -= feeInRON
        } else {
          result[j.instrument] = -1 * feeInRON
        }
      } else {
        const fiatFeeInRON = Number(j.amount) * Number(i.frominron)
        if (result["fiatFees"]) {
          result["fiatFees"] -= fiatFeeInRON
        } else {
          result["fiatFees"] = -1 * fiatFeeInRON
        }
      }
    }
  }
  return result;
}

export function getTotalInvestedAmount (history: any[], averageBuyPrice: averageBuyPrice) {
  let investedAmount = 0
  for (let i of history) {
    if (i.operation === "BUY") {
      investedAmount += (Number(i.amount) * Number(i.frominron))
      const fee = JSON.parse(i.fees)
      for (let j of fee) {
        if (!fiats.includes(j.instrument)) {
          const feeInRON = j.amount * averageBuyPrice[j.instrument].avPrice
          investedAmount += feeInRON
        } else {
          const fiatFeeInRON = Number(j.amount) * Number(i.frominron)
          investedAmount += fiatFeeInRON
        }
      }
    }
  }
  return roundToTwoDecimalPlaces(investedAmount);
}

export function roundToTwoDecimalPlaces(num: number): number {
  let parts = num.toString().split(".");
  if (parts.length <= 1 || parts[1].length <= 2) {
    return parseFloat(num.toString());
  }
  let roundedNum = Number(num.toFixed(2));
  return roundedNum;
}
