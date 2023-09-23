import React from "react";

export function SidePanel() {
  // Mock data for the latest company transactions
  const latestTransactions = [
    {
      id: 1,
      description: "Invoice #12345",
      amount: "$1,200.00",
      date: "Dec 12, 2023",
      type: "inflow",
    },
    {
      id: 2,
      description: "Payment Received",
      amount: "$500.00",
      date: "Dec 11, 2023",
      type: "inflow",
    },
    {
      id: 3,
      description: "Invoice #12344",
      amount: "$2,000.00",
      date: "Dec 10, 2023",
      type: "inflow",
    },
    {
      id: 4,
      description: "Refund Issued",
      amount: "$300.00",
      date: "Dec 9, 2023",
      type: "outflow",
    },
  ];

  return (
    <div className="mt-8 w-full lg:mt-0 lg:w-4/12 lg:pl-4">
      <div className="rounded-3xl bg-gray-800 px-6 pt-6">
        <div className="flex pb-6 text-2xl font-bold text-white">
          <p>Latest Transactions</p>
        </div>
        <div>
          {latestTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex w-full border-t border-gray-700 p-4 hover:bg-gray-700 2xl:items-start">
              <div className="w-full pl-4">
                <div className={`mb-2 text-lg font-medium text-white ${
                transaction.type === "inflow" ? "text-green-500" : "text-red-500"
              }`}>
                  {transaction.description}
                </div>
                <div className="text-sm text-gray-400">
                  Amount:{" "}
                  <span className="text-white">{transaction.amount}</span>
                </div>
                <p className="text-right text-sm text-gray-400">
                  {transaction.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}