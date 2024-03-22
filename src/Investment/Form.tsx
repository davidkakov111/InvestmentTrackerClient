import ExchangeFormComponent from "./components/ExchangeForm"
import TransferFormComponent from "./components/TransferForm"

export default function InvestForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
      <div className="md:col-span-1">
        <ExchangeFormComponent />
      </div>
      <div className="md:col-span-1">
        <TransferFormComponent />
      </div>
    </div>
  )
}
