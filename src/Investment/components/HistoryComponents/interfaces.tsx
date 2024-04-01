export interface RegularTableRowComponentProps {
    transaction: any;
    setEditId: React.Dispatch<React.SetStateAction<number>>;
    mapIndex: number;
}

export interface EditTableRowComponentProps extends RegularTableRowComponentProps {
    updateHistoryState: (
        currentTransaction: BodyTransaction,
        mapIndex: number,
        del: Boolean
    ) => void;
}

interface BaseTransaction {
    id: number;
    operation: string;
    what: string;
    frominstrument: string;
    toinstrument: string;
    fees: string;
    amount: number;
    timestamp: number;
    [key: string]: number | string | null;
}

export interface Transaction extends BaseTransaction {
    frominron: number;
    toinron: number;
}

export interface BodyTransaction extends BaseTransaction {
    frominron: number | null;
    toinron: number | null;
}
