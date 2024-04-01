import { fiats } from "../Instruments";

interface averageBuyPrice {
  [key: string]: {avPrice: number, amount: number}
}
interface ballanceWithProfit{
  [key: string]: {ballance: number, profit: number }
}

export function getTotalInvestedAmount (history: any[]) {
  let investedAmount = 0
  for (let i of history) {
    if (i.operation === "BUY") {
      investedAmount += (Number(i.amount) * Number(i.frominron)) // I need to solve this  + Number(i.fees)
    }
  }
  return roundToTwoDecimalPlaces(investedAmount);
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

export function ballanceAndProfitByCrypto(history: any[]) {
  let averageBuyPrice: averageBuyPrice = averageBuyPriceAndBallance(history)
  let profitLoss: ballanceWithProfit = RealizedProfitAndLoss(history, averageBuyPrice)
  const currentBallancesAndProfits = FeesDeducter(history, profitLoss, averageBuyPrice)
  return currentBallancesAndProfits
}

function averageBuyPriceAndBallance(history: any[]) {
  let averageBuyPrice: averageBuyPrice = {}
  for (let i of history) {
    if (i.operation === "BUY" || i.operation === "EXCHANGE") {
      if (averageBuyPrice[i.toinstrument]) {
        const alreadyPaid = (Number(averageBuyPrice[i.toinstrument].avPrice) * Number(averageBuyPrice[i.toinstrument].amount)) + (Number(i.amount) * Number(i.frominron))
        const amount = Number(averageBuyPrice[i.toinstrument].amount) + ((Number(i.amount) * Number(i.frominron)) / Number(i.toinron))
        const avPrice = alreadyPaid / amount
        averageBuyPrice[i.toinstrument] = {avPrice: avPrice, amount: amount}
      } else {
        averageBuyPrice[i.toinstrument] = {avPrice: i.toinron, amount: (Number(i.amount) * Number(i.frominron)) / Number(i.toinron)}
      }
    }
  }
  return averageBuyPrice;
}

function RealizedProfitAndLoss(history: any[], averageBuyPrice: averageBuyPrice) {
  const ballanceProfit: ballanceWithProfit = {}
  for (let crypto in averageBuyPrice) {
    ballanceProfit[crypto] = {ballance: averageBuyPrice[crypto].amount, profit: 0}
  }
  for (let i of history) {
    if (i.operation === "SELL" || i.operation === "EXCHANGE") {
      const priceGap = i.frominron - averageBuyPrice[i.frominstrument].avPrice
      ballanceProfit[i.frominstrument] = {
        ballance: ballanceProfit[i.frominstrument].ballance - i.amount, 
        profit: ballanceProfit[i.frominstrument].profit + (priceGap * i.amount)
      }
    }
  }
  return ballanceProfit;
}

function FeesDeducter(history: any[], ballanceWithProfit: ballanceWithProfit, averageBuyPrice: averageBuyPrice) {
  let result = {...ballanceWithProfit}
  for (let i of history) {
    const fee = JSON.parse(i.fees)
    for (let j of fee) {
      if (!fiats.includes(j.instrument)) {
        const feeInRON = Number(j.amount) * Number(averageBuyPrice[j.instrument].avPrice)
        result[j.instrument] = {
          ballance: result[j.instrument].ballance - Number(j.amount), 
          profit: result[j.instrument].profit - feeInRON
        }
      } else {
        const fiatFeeInRON = Number(j.amount) * Number(i.frominron)
        if (result["fiatFees"]) {
          result["fiatFees"] = {
            ballance: 0, 
            profit: result["fiatFees"].profit - fiatFeeInRON
          }
        } else {
          result["fiatFees"] = {
            ballance: 0, 
            profit:  -1 * fiatFeeInRON
          }
        }
      }
    }
  }
  return result;
}

export function roundToTwoDecimalPlaces(num: number): number {
  let parts = num.toString().split(".");
  if (parts.length <= 1 || parts[1].length <= 2) {
    return parseFloat(num.toString());
  }
  let roundedNum = Number(num.toFixed(2));
  return roundedNum;
}
