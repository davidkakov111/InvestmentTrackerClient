import { instruments } from "../../Instruments";
import "../../css/Form.css";
interface feeInputs {
  instrument: string;
  amount: string;
}
interface FeeInputsComponentProps {
  feeInputs: feeInputs[];
  setFeeInputs: React.Dispatch<React.SetStateAction<feeInputs[]>>;
}

export const FeeInputsComponent: React.FC<FeeInputsComponentProps> = ({
  feeInputs,
  setFeeInputs,
}) => {
  const handleAddFeeInput = () => {
    setFeeInputs([...feeInputs, { instrument: "", amount: "" }]);
  };
  const handleRemoveFeeInput = (index: number) => {
    let array = [...feeInputs];
    array.splice(index, 1);
    setFeeInputs(array);
  };
  const handleFeeChange = (
    index: number,
    value: string,
    field: "instrument" | "amount"
  ) => {
    const newInputs = [...feeInputs];
    newInputs[index][field] = value;
    setFeeInputs(newInputs);
  };

  return (
    <>
      {feeInputs.map((value, index) => (
        <div key={index}>
          <div className="flex justify-between">
            <span
              title="Select the instrument (fiat currency or cryptocurrency) in which you paid for the transaction. If you used multiple instruments, simply press the '+fee' button to save more."
              style={{ cursor: "help" }}
            >
              Fee paid in:
            </span>
            <span
              title="Enter the quantity you paid with this instrument for this transaction."
              className="mx-auto"
              style={{ cursor: "help" }}
            >
              Fee amount:
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <select
              name={`feeInstrument${index}`}
              title={`feeInstrument${index}`}
              value={value.instrument}
              onChange={(e) =>
                handleFeeChange(index, e.target.value, "instrument")
              }
              className="choice mt-2"
              required
            >
              <option value="" disabled>
                Select
              </option>
              {instruments.map((inst, idx) => (
                <option key={idx} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
            <input
              name={`feeAmount${index}`}
              title={`feeAmount${index}`}
              placeholder="amount"
              type="number"
              value={value.amount}
              onChange={(e) => {
                if (Number(e.target.value) >= 0) {
                  handleFeeChange(index, e.target.value, "amount");
                }
              }}
            />
            <button
              onClick={() => {
                handleRemoveFeeInput(index);
              }}
              type="button"
              style={{ width: 80 }}
              className="bg-red-500 text-2xl text-white rounded-md h-8 flex items-center justify-center"
            >
              🗑
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={handleAddFeeInput}
        type="button"
        className="bg-green-500 text-white rounded-md w-12 h-8 flex items-center justify-center"
      >
        +Fee
      </button>
    </>
  );
};
