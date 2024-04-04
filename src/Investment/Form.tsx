import ExchangeFormComponent from "./components/FormComponents/ExchangeForm";
import TransferFormComponent from "./components/FormComponents/TransferForm";

export default function InvestForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-1">
        <ExchangeFormComponent />
      </div>
      <div className="md:col-span-1">
        <TransferFormComponent />
      </div>
    </div>
  );
}
