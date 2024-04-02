import { Link } from "react-router-dom";

interface NoTrHistoryWinowComponentProps {
  title: string, 
  subtitle: string
}

export const NoTrHistoryWinow: React.FC<NoTrHistoryWinowComponentProps> = ({title, subtitle}) => {
  return (
      <div className="noHistory text-white p-4 rounded-md flex flex-col items-center justify-center">
        <p className="text-lg font-semibold mb-2">
          {title}
        </p>
        <p className="text-sm text-center">
          {subtitle}
        </p>
        <Link
          to={"/saveTransactionForms"}
          className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Add Transaction
        </Link>
      </div>
  );
}
