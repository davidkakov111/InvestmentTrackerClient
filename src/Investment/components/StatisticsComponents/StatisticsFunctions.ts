interface averageBuyPrice {
  [key: string]: {avPrice: number, amount: number}
}
interface profits {
  [key: string]: number
}

export function getTax(taxableProfit: number, above200profits:number, minimumGrossWage: number) {
  let incomeTax = 0
  if (taxableProfit > 600) {
    incomeTax = taxableProfit * 0.1
  } else {
    incomeTax = above200profits * 0.1
  }
  const integerPart = Math.floor(incomeTax);
  const decimalPart = incomeTax - integerPart;
  if (decimalPart > 0.5) {
    incomeTax = integerPart + 1; 
  } else {
    incomeTax = integerPart;
  }
  let CASS = 0
  if (taxableProfit >= (minimumGrossWage * 6)) CASS = (minimumGrossWage * 6) * 0.1
  if (taxableProfit >= (minimumGrossWage * 12)) CASS = (minimumGrossWage * 12) * 0.1
  if (taxableProfit >= (minimumGrossWage * 24)) CASS = (minimumGrossWage * 24) * 0.1
  return [incomeTax, roundToTwoDecimalPlaces(CASS)]
}

export function ProfitByCrypto(history: any[]) {
  let [averageBuyPrice, investedAmount] = avrBuyPriceAndInvestedAmount(history)
  let [profitLoss, above200Profits] = RealizedProfitAndLoss(history, averageBuyPrice)
  const result: [[profits, number], number] = [[profitLoss, investedAmount], above200Profits];
  return result;
}

function avrBuyPriceAndInvestedAmount(history: any[]) {
  let investedAmount = 0
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
    if (i.operation === "BUY") {
      let feeInRON = 0;
      for (let fee of JSON.parse(i.fees)) {
        feeInRON += (fee.amount * fee.priceInRON)
      }
      investedAmount += (i.amount * i.frominron) + feeInRON
    }
  }
  const result: [averageBuyPrice, number] = [averageBuyPrice, roundToTwoDecimalPlaces(investedAmount)]
  return result;
}

function RealizedProfitAndLoss(history: any[], averageBuyPrice: averageBuyPrice) {
  const assetFees1: profits = {}
  const assetFees2: profits = {}
  let above200Profits = 0
  const RealizedProfits: profits = {}
  for (let i of history) {
    TransactionFeeCollector(assetFees1, assetFees2, i)
    if (i.operation === "SELL" || i.operation === "EXCHANGE") {
      const priceGap = i.frominron - averageBuyPrice[i.frominstrument].avPrice
      const profitOrLoss = (priceGap * i.amount) + assetFees1[i.frominstrument]
      assetFees1[i.frominstrument] = 0
      if (RealizedProfits[i.frominstrument]) {
        RealizedProfits[i.frominstrument] += profitOrLoss 
      } else {
        RealizedProfits[i.frominstrument] = profitOrLoss
      }
      if ((priceGap * i.amount) >= 200 || (priceGap * i.amount) < 0  ) {
        above200Profits += (priceGap * i.amount) + assetFees2[i.frominstrument]
        assetFees2[i.frominstrument] = 0
      }
    }
  }
  const result: [profits, number] = [RealizedProfits, above200Profits]
  return result;
}

function TransactionFeeCollector(assetFees1:profits, assetFees2:profits, transaction:any) {
  let feeInRON = 0;
  for (let fee of JSON.parse(transaction.fees)) {
    feeInRON += (fee.amount * fee.priceInRON)
  }
  let cryptoCurrnecy;
  if (transaction.operation === "BUY") {
    cryptoCurrnecy = transaction.toinstrument
  } else if (transaction.operation === "TRANSFER") {
    cryptoCurrnecy = JSON.parse(transaction.what)[0]
  } else if (transaction.operation === "SELL" || transaction.operation === "EXCHANGE") {
    cryptoCurrnecy = transaction.frominstrument
  }
  if (assetFees1[cryptoCurrnecy]) {
    assetFees1[cryptoCurrnecy] -= feeInRON
    assetFees2[cryptoCurrnecy] -= feeInRON
  } else {
    assetFees1[cryptoCurrnecy] = -1 * feeInRON
    assetFees2[cryptoCurrnecy] = -1 * feeInRON
  }
}

export function roundToTwoDecimalPlaces(num: number): number {
  let parts = num.toString().split(".");
  if (parts.length <= 1 || parts[1].length <= 2) {
    return parseFloat(num.toString());
  }
  let roundedNum = Number(num.toFixed(2));
  return roundedNum;
}
