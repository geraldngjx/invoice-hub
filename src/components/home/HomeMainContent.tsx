import React from "react";
import Chart from "chart.js/auto";
import { useRef, useState, useEffect } from "react";

interface DataItem {
    item_description: string;
    item_quantity: string;
    item_price: string;
    item_total: string;
    tax_amount: string;
}

interface Data {
    bill_to: string;
    items: DataItem[];
    amount_due: string;
    tax_amount: string;
    bill_from: string;
    invoice_number: string;
    invoice_date: string;
    grand_total: string;
    transaction_description: string;
}

interface File {
    name: string;
    createdOn: string;
    type: string;
    data: Data; // Changed from JSON[] to Data
}

interface HomeMainContentProps {
    files: File[]; // Array of File objects, each containing JSON data
}




export function HomeMainContent(_props: HomeMainContentProps) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const [chartInstance, setChartInstance] = useState<Chart<"pie", number[], string> | null>(null);


    const exportToCSV = () => {
        let csvStr = "Bill To, Item Description, Quantity, Price, Total, Tax Amount, Amount Spent\n";


        _props.files.forEach((file) => {
            file.data.items.forEach((item) => {
                const row = [
                    file.data.bill_to,
                    item.item_description,
                    item.item_quantity,
                    item.item_price,
                    item.item_total,
                    item.tax_amount,
                    file.data.amount_due,
                ];
                csvStr += row.join(", ") + "\n";
            });
        });

        const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "transactions.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    // Combine all JSON data from different files into one array
    // const allData = props.files.flatMap((file) => file.data);

    const mockData = [
        {
            type: "inflow",
            category: "Salary",
            amount: "5000",
        },
        {
            type: "inflow",
            category: "Bonus",
            amount: "1000",
        },
        {
            type: "outflow",
            category: "Rent",
            amount: "1200",
        },
        {
            type: "outflow",
            category: "Groceries",
            amount: "300",
        },
        {
            type: "inflow",
            category: "Side Gig",
            amount: "800",
        },
        {
            type: "outflow",
            category: "Utilities",
            amount: "400",
        },
    ];

    // Calculate total money inflow and outflow

    // Change mockData to allData
    const calculateTotal = (type: string) => {
        return mockData.reduce((total, item) => {
            if (item.type === type) {
                return total + parseFloat(item.amount);
            }
            return total;
        }, 0);
    };

    // Calculate categories for inflow and outflow

    // Change mockData to allData
    const inflowCategories = Array.from(
        new Set(
            mockData
                .filter((item) => item.type === "inflow")
                .map((item) => item.category)
        )
    );

    // Change mockData to allData
    const outflowCategories = Array.from(
        new Set(
            mockData
                .filter((item) => item.type === "outflow")
                .map((item) => item.category)
        )
    );

    // Prepare data for the pie chart
    useEffect(() => {
        const ctx = canvas.current;

        if (chartInstance) {
            chartInstance.destroy();
        }

        const chart = new Chart(ctx!, {
            type: "pie",
            data: {
                labels: [
                    "Red",
                    "Blue",
                    "Yellow"
                ],
                datasets: [{
                    label: "My First Dataset",
                    data: [300, 50, 100],
                    backgroundColor: [
                        "rgb(255, 99, 132)",
                        "rgb(54, 162, 235)",
                        "rgb(255, 205, 86)"
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    title: {
                        display: true,
                        text: "Number of animals in the zoo",
                    },
                },
            },
        });
        setChartInstance(chart);

        // Destroy the chart when the component unmounts
        return () => {
            chart.destroy();
        };
    }, []); // Add chartInstance as a dependency

    return (
        <div className="h-full w-full overflow-y-auto rounded-3xl bg-gray-800 p-6 lg:w-8/12" >
            <h2 className="mb-4 text-2xl text-white">Overview</h2>
            <div className="flex flex-wrap justify-center">
                <div className="w-full p-4 lg:w-1/2">
                    <canvas ref={canvas}></canvas>
                </div>
            </div>
            <div className="mt-10 flex flex-wrap border-t border-gray-700 pt-10">
                <div className="w-full p-4 lg:w-1/3">
                    <h2 className="mb-4 text-2xl text-white">Net Monthly Flow</h2>
                    <div className="rounded-lg bg-gray-700 p-4 py-5">
                        <p className="text-center text-xl font-bold text-white">${calculateTotal("inflow") - calculateTotal("outflow")}</p>
                    </div>
                </div>
                <div className="w-full p-4 lg:w-1/3">
                    <h2 className="mb-4 text-2xl text-white">Total Monthly Inflow</h2>
                    <div className="rounded-lg bg-gray-700 p-4 py-5">
                        <p className="text-center text-xl font-bold text-white">${calculateTotal("inflow")}</p>
                    </div>
                </div>
                <div className="w-full p-4 lg:w-1/3">
                    <h2 className="mb-4 text-2xl text-white">Total Monthly Outflow</h2>
                    <div className="rounded-lg bg-gray-700 p-4 py-5">
                        <p className="text-center text-xl font-bold text-white">${calculateTotal("outflow")}</p>
                    </div>
                </div>
            </div>
            {/* <h2 className="mt-10 border-t border-gray-700 pb-5 pt-10 text-center text-2xl text-white">Categories</h2>
            <div className="w-full p-4">
                <div className="flex w-full">
                    <div className="w-1/2">
                        <table className="w-full border-collapse bg-gray-700 text-white">
                            <thead>
                                <tr>
                                    <th className="border border-gray-500 px-4 py-2">Inflow</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inflowCategories.map((category, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-500 px-4 py-2">{category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-1/2">
                        <table className="w-full border-collapse bg-gray-700 text-white">
                            <thead>
                                <tr>
                                    <th className="border border-gray-500 px-4 py-2">Outflow</th>
                                </tr>
                            </thead>
                            <tbody>
                                {outflowCategories.map((category, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-500 px-4 py-2">{category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div> */}

            <h2 className="mt-10 border-t border-gray-700 pb-5 pt-10 text-center text-2xl text-white">Transactions</h2>
            <div className="flex flex-wrap justify-center">
                <table className="w-full border-collapse bg-gray-700 text-white">
                    <thead>
                        <tr>
                            <th className="border border-gray-500 px-4 py-2">Invoice Number</th>
                            <th className="border border-gray-500 px-4 py-2">Date</th>
                            <th className="border border-gray-500 px-4 py-2">Buyer</th>
                            <th className="border border-gray-500 px-4 py-2">Seller</th>
                            <th className="border border-gray-500 px-4 py-2">Amount</th>
                            <th className="border border-gray-500 px-4 py-2">Tax Amount</th>
                            <th className="border border-gray-500 px-4 py-2">Total Spent</th>
                            <th className="border border-gray-500 px-4 py-2">Transaction description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(_props.files) && _props.files.map((file, index) => (
                            <tr key={index}>
                                <td className="border border-gray-500 px-4 py-2">{file.data.invoice_number}</td>
                                <td className="border border-gray-500 px-4 py-2">{file.data.invoice_date}</td>
                                <td className="border border-gray-500 px-4 py-2">{file.data.bill_from}</td>
                                <td className="border border-gray-500 px-4 py-2">{file.data.bill_to}</td>
                                <td className="border border-gray-500 px-4 py-2">{file.data.amount_due}</td>
                                <td className="border border-gray-500 px-4 py-2">{file.data.tax_amount}</td>
                                <td className="border border-gray-500 px-4 py-2">{file.data.grand_total}</td>
                                <td className="border border-gray-500 px-4 py-2">{file.data.transaction_description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <button onClick={exportToCSV} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Export to CSV
                </button>
            </div>
        </div>
    );
}




