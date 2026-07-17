export interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  type: "success" | "pending" | "warning";
  read: boolean;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Withdrawal Successful",
    subtitle:
      "You have successfully withdrawn lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: "success",
    read: false,
  },
  {
    id: "2",
    title: "Deposit Successful",
    subtitle:
      "You have successfully deposited lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: "pending",
    read: false,
  },
  {
    id: "3",
    title: "Login From An Unknown Device",
    subtitle:
      "Your account was logged from an unknown device lorem ipsum dolor sit amet, consectetur.",
    type: "warning",
    read: false,
  },
  {
    id: "4",
    title: "Withdrawal Successful",
    subtitle:
      "You have successfully withdrawn lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: "success",
    read: false,
  },
  {
    id: "5",
    title: "Withdrawal Successful",
    subtitle:
      "You have successfully withdrawn lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: "success",
    read: false,
  },
  {
    id: "6",
    title: "Withdrawal Successful",
    subtitle:
      "You have successfully withdrawn lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: "success",
    read: false,
  },
  {
    id: "7",
    title: "Withdrawal Successful",
    subtitle:
      "You have successfully withdrawn lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: "success",
    read: false,
  },
  {
    id: "8",
    title: "Withdrawal Successful",
    subtitle:
      "You have successfully withdrawn lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: "success",
    read: false,
  },
];
