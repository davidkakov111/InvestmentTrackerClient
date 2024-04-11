import { fiats } from "../../Instruments";

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
    CASS = (minimumGrossWage * 6)
  }
  if (taxableProfit > (minimumGrossWage * 12)) {
    CASS = (minimumGrossWage * 12)
  }
  if (taxableProfit > (minimumGrossWage * 24)) {
    CASS = (minimumGrossWage * 24)
  }
  return [incomeTax, CASS * 0.1]
}

export function ProfitByCrypto(history: any[]) {
  let averageBuyPrice: averageBuyPrice = averageBuyPriceAndBallance(history)
  let profitLossFiat: profits = RealizedProfitAndLoss(history, averageBuyPrice)
  let profitLossAll: profits = RealizedProfitAndLoss(history, averageBuyPrice, true)
  const ProfitsFiat = FeesDeducter(history, profitLossFiat, averageBuyPrice)
  const ProfitsAll = FeesDeducter(history, profitLossAll, averageBuyPrice)
  
  return [ProfitsFiat, ProfitsAll]
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

function RealizedProfitAndLoss(history: any[], averageBuyPrice: averageBuyPrice, exchange: boolean = false) {
  const RealizedProfits: profits = {}
  for (let i of history) {
    if (exchange) {
      if (i.operation === "SELL" || i.operation === "EXCHANGE") {
        const priceGap = i.frominron - averageBuyPrice[i.frominstrument].avPrice
        const profitOrLoss = priceGap * i.amount
        if (RealizedProfits[i.frominstrument]) {
          RealizedProfits[i.frominstrument] += profitOrLoss
        } else {
          RealizedProfits[i.frominstrument] = profitOrLoss
        }
      }
    } else {
      if (i.operation === "SELL") {
        const priceGap = i.frominron - averageBuyPrice[i.frominstrument].avPrice
        const profitOrLoss = priceGap * i.amount
        if (RealizedProfits[i.frominstrument]) {
          RealizedProfits[i.frominstrument] += profitOrLoss
        } else {
          RealizedProfits[i.frominstrument] = profitOrLoss
        }
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
        let price = 0
        if (j.instrument === i.frominstrument) {
          price = i.frominron            
        } else if (j.instrument === i.toinstrument) {
          price = i.toinron
        } else {
          price = averageBuyPrice[j.instrument].avPrice
        }
        const feeInRON = j.amount * price
        if (result[j.instrument]) {
          result[j.instrument] -= feeInRON
        } else {
          result[j.instrument] = -1 * feeInRON
        }
      } else {
        if (j.instrument !== i.frominstrument) {
          const response = `You can only pay a fiat fee in ${j.instrument}, when you buy cryptocurrency with ${j.instrument}!`
          alert(response)
          throw new Error(response);
        }
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

export function getTotalInvestedAmount (history: any[]) {
  let investedAmount = 0
  for (let i of history) {
    if (i.operation === "BUY") {
      investedAmount += (Number(i.amount) * Number(i.frominron))
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
