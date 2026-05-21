import DepositIcon from "@/assets/icons/activity/deposit.svg";
import WithdrawalIcon from "@/assets/icons/activity/withdrawal.svg";
import BuyOrderIcon from "@/assets/icons/activity/buyOrder.svg";

export interface QuickActionItem {
  id: string;
  title: string;
  Icon: React.FC<any>;
}

export const quickActions: QuickActionItem[] = [
  { id: "deposit", title: "Deposit", Icon: DepositIcon },
  { id: "withdrawals", title: "Withdrawals", Icon: WithdrawalIcon },
  { id: "buyOrder", title: "Buy Order", Icon: BuyOrderIcon },
];

export interface ActivityItem {
  id: string;
  pair: string;
  type: "L/B" | "L/S"; // L/B = Limit Buy, L/S = Limit Sell
  timestamp: string;
  amount: string;
  price: string;
  status: "Filled" | "Cancelled";
}

export const activitiesData: ActivityItem[] = [
  {
    id: "act-1",
    pair: "BTC/BUSD",
    type: "L/B",
    timestamp: "2021-08-02 04:39:26",
    amount: "0.49975/0.49975",
    price: "2652.00",
    status: "Filled",
  },
  {
    id: "act-2",
    pair: "BTC/BUSD",
    type: "L/S",
    timestamp: "2021-08-02 04:39:26",
    amount: "0.49975/0.49975",
    price: "2652.00",
    status: "Cancelled",
  },
  {
    id: "act-3",
    pair: "BTC/BUSD",
    type: "L/B",
    timestamp: "2021-08-02 04:39:26",
    amount: "0.49975/0.49975",
    price: "2652.00",
    status: "Filled",
  },
  {
    id: "act-4",
    pair: "BTC/BUSD",
    type: "L/S",
    timestamp: "2021-08-02 04:39:26",
    amount: "0.49975/0.49975",
    price: "2652.00",
    status: "Cancelled",
  },
];
