import React from "react";
import Chart from "chart.js/auto";
import { useRef, useState, useEffect } from "react";
import excelJS from "exceljs";


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
    const [chartInstance, setChartInstance] = useState<Chart<"line", number[], string> | null>(null);

    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    // State to store the selected year
    const [selectedChartYear, setSelectedChartYear] = useState<number | null>(null);

    const [filteredData, setFilteredData] = useState<Data[] | null>(null);
    const [totalOutflow, setTotalOutflow] = useState<string>("0");
    const [totalTax, setTotalTax] = useState<string>("0");
    const [invoiceCount, setInvoiceCount] = useState<string>("0");

    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 5;

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredData?.slice(indexOfFirstTransaction, indexOfLastTransaction);

    // Function to handle year selection
    const handleSelectChartYear = (year: number) => {
        setSelectedChartYear(year);
    };

    const exportToCSV = async () => {
        const workbook = new excelJS.Workbook();

        // Create INVOICES sheet
        const invoicesSheet = workbook.addWorksheet("INVOICES");

        // Define columns with a specific width
        invoicesSheet.columns = [
            { header: "Invoice Number", key: "invoice_number", width: 15 },
            { header: "Date", key: "invoice_date", width: 10 },
            { header: "Buyer", key: "bill_from", width: 15 },
            { header: "Seller", key: "bill_to", width: 15 },
            { header: "Amount", key: "amount_due", width: 10 },
            { header: "Tax Amount", key: "tax_amount", width: 10 },
            { header: "Total Spent", key: "grand_total", width: 12 },
            { header: "Transaction description", key: "transaction_description", width: 25 },
        ];



        _props.files.forEach((file) => {
            invoicesSheet.addRow({
                invoice_number: file.data.invoice_number,
                invoice_date: file.data.invoice_date,
                bill_from: file.data.bill_from,
                bill_to: file.data.bill_to,
                amount_due: file.data.amount_due,
                tax_amount: file.data.tax_amount,
                grand_total: file.data.grand_total,
                transaction_description: file.data.transaction_description,
            });
        });
        // Create TRANSACTIONS sheet
        const transactionsSheet = workbook.addWorksheet("TRANSACTIONS");

        // Define columns with a specific width
        transactionsSheet.columns = [
            { header: "Bill To", key: "bill_to", width: 15 },
            { header: "Item Description", key: "item_description", width: 25 },
            { header: "Quantity", key: "item_quantity", width: 10 },
            { header: "Price", key: "item_price", width: 10 },
            { header: "Total", key: "item_total", width: 10 },
            { header: "Tax Amount", key: "tax_amount", width: 10 },
            { header: "Amount Spent", key: "amount_due", width: 15 },
        ];

        _props.files.forEach((file) => {
            file.data.items.forEach((item) => {
                transactionsSheet.addRow({
                    bill_to: file.data.bill_to,
                    item_description: item.item_description,
                    item_quantity: item.item_quantity,
                    item_price: item.item_price,
                    item_total: item.item_total,
                    tax_amount: item.tax_amount,
                    amount_due: file.data.amount_due,
                });
            });
        });

        // After creating and populating the workbook
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "transactions.xlsx";
            document.body.appendChild(link); // Required for Firefox
            link.click();
            document.body.removeChild(link);
        });
    };

    // Combine all JSON data from different files into one array
    const allData = _props.files.flatMap((file) => file.data);

    /*
    Functions to calculate statistics for the filtered data (NUMERICAL)
    */

    // Function to get unique months and years from the data
    const getUniqueMonthsAndYears = (data: Data[]): string[] => {
        const uniqueDates = new Set();
        data.forEach((item) => {
            const date = new Date(item.invoice_date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Months are 0-indexed, so add 1
            uniqueDates.add(`${year}-${month}`);
        });
        return Array.from(uniqueDates).sort() as string[];
    };

    // Function to get the name of a month from its number (1-12)
    const getMonthName = (monthNumber: number) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[monthNumber - 1]; // Subtract 1 to get the correct index
    };

    // Updated calculateTotal function with two parameters (type and data)
    const calculateTotal = (type: string, data: Data[]) : string => {
        if (type === "outflow") {
            // Calculate the total outflow (sum of grand_total) and truncate to 2 decimal places
            return data.reduce((total, item) => {
                return total + parseFloat(item.grand_total);
            }, 0).toFixed(2);
        } else if (type === "tax_amount") {
            // Calculate the total tax (sum of tax_amount) and truncate to 2 decimal places
            return data.reduce((total, item) => {
                return total + parseFloat(item.tax_amount);
            }, 0).toFixed(2);
        } else if (type === "invoice_count") {
            // Calculate the number of invoices (count of Data_Item in every File object)
            return data.reduce((count, item) => {
                return count + item.items.length;
            }, 0).toString();
        } else {
            // Handle other types if needed
            return "0";
        }
    };

    // Function to handle month and year selection
    const handleSelectMonthYear = (month: number, year: number) => {
        setSelectedMonth(month);
        setSelectedYear(year);
    };

    // Function to filter data by month and year
    const filterDataByMonthYear = () => {
        if (selectedMonth !== null && selectedYear !== null) {
            return allData.filter((data) => {
                const date = new Date(data.invoice_date);
                const monthOneIndexed = date.getMonth() + 1;
                return monthOneIndexed === selectedMonth && date.getFullYear() === selectedYear;
            });
        }
        return allData; // Return all data if no month and year are selected
    };

    // Use an effect to update the filtered data and statistics when selectedMonth or selectedYear changes
    useEffect(() => {
        const filteredData = filterDataByMonthYear();
        console.log(filteredData);
        const totalOutflow = calculateTotal("outflow", filteredData);
        const totalTax = calculateTotal("tax_amount", filteredData);
        const invoiceCount = calculateTotal("invoice_count", filteredData);

        // Update the state variables
        setFilteredData(filteredData);
        setTotalOutflow(totalOutflow);
        setTotalTax(totalTax);
        setInvoiceCount(invoiceCount);
    }, [selectedMonth, selectedYear]);

    /*
    Functions to calculate statistics for the CHART
    */

    const getMonthlyDataForYear = (selectedYear: number | null, data: Data[]) => {
        // const monthNames = [
        //     "January", "February", "March", "April", "May", "June",
        //     "July", "August", "September", "October", "November", "December"
        // ];

        // Initialize arrays to store monthly data
        const totalOutflows = Array(12).fill(0);
        const totalTaxes = Array(12).fill(0);
        const invoiceCounts = Array(12).fill(0);

        data.forEach((item) => {
            const date = new Date(item.invoice_date);
            const year = date.getFullYear();
            const month = date.getMonth();

            // Check if the data is from the selected year
            if (year === selectedYear) {
                // Update monthly data
                totalOutflows[month] += parseFloat(item.grand_total);
                totalTaxes[month] += parseFloat(item.tax_amount);
                invoiceCounts[month] += item.items.length;
            }
        });

        return {
            totalOutflows,
            totalTaxes,
            invoiceCounts,
        };
    };

    const getUniqueYears = (data: Data[]): string[] => {
        const uniqueYears = new Set();
        data.forEach((item) => {
            const date = new Date(item.invoice_date);
            const year = date.getFullYear();
            uniqueYears.add(year);
        });
        return Array.from(uniqueYears).sort() as string[];
    };

    // Update chart data for the selected year
    const yearData = getMonthlyDataForYear(selectedChartYear, allData);

    // Prepare data for the pie chart
    useEffect(() => {
        const ctx = canvas.current;

        if (chartInstance) {
            chartInstance.destroy();
        }

        const chart = new Chart(ctx!, {
            type: "line",
            data: {
                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ],
                datasets: [{
                    label: "Total Outflows",
                    data: yearData.totalOutflows,
                }, {
                    label: "Total Taxes",
                    data: yearData.totalTaxes,
                }, {
                    label: "Total Invoice Count",
                    data: yearData.invoiceCounts,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                        labels: {
                            color: "white", // Color of the legend labels
                            font: {
                                size: 16, // Font size of the legend labels
                            },
                            padding: 20, // Add padding to the labels
                        },
                    },
                    title: {
                        display: true,
                        text: "Expense Overview",
                        font: {
                            size: 24, // Font size of the title
                        },
                        color: "white", // Color of the title
                    },
                },
                scales: {
                    x: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.2)", // Color of the X-axis grid lines
                        },
                        ticks: {
                            color: "white", // Color of the X-axis labels
                            font: {
                                size: 14, // Font size of the X-axis labels
                            },
                        },
                    },
                    y: {
                        grid: {
                            color: "rgba(255, 255, 255, 0.2)", // Color of the Y-axis grid lines
                        },
                        ticks: {
                            color: "white", // Color of the Y-axis labels
                            font: {
                                size: 14, // Font size of the Y-axis labels
                            },
                        },
                    },
                },
            },
        });
        setChartInstance(chart);

        // Destroy the chart when the component unmounts
        return () => {
            chart.destroy();
        };
    }, [selectedChartYear]); // Add chartInstance as a dependency

    return (
        <div className="h-full w-full overflow-y-auto rounded-3xl bg-gray-800 p-6 lg:w-8/12" >
            <h2 className="text-2xl font-bold text-white">Overview</h2>
            {/* Year selection dropdown */}
            <div className="mr-20 mt-4 flex items-center justify-end">
                <label className="text-lg text-white">Select Year:</label>
                <select
                    className="ml-2 rounded bg-gray-700 p-2 text-white"
                    onChange={(e) => {
                        const selectedYear = parseInt(e.target.value);
                        handleSelectChartYear(selectedYear);
                    }}
                >
                    <option value="">Select a Year</option>
                    {getUniqueYears(allData).map((year, index) => (
                        <option key={index} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            {/* Chart */}
            <div className="flex flex-wrap justify-center">
                <div className="w-full p-10">
                    <canvas ref={canvas}></canvas>
                </div>
            </div>
            {/* Add UI elements to select the month and year */}
            <div className="mr-10 flex flex-wrap items-center justify-end border-t border-gray-700 pt-10">
                <label className="text-lg text-white">Select Month and Year:</label>
                <select
                    className="ml-2 rounded bg-gray-700 p-2 text-white"
                    onChange={(e) => {
                        const [year, month] = e.target.value.split("-");
                        handleSelectMonthYear(parseInt(month), parseInt(year));
                    }}
                >
                    <option value="">Select a Month and Year</option>
                    {/* Add options for months and years */}
                    {getUniqueMonthsAndYears(allData).map((dateString, index) => {
                        const [year, month] = dateString.split("-");
                        return (
                            <option key={index} value={`${year}-${month}`}>
                                {getMonthName(parseInt(month))} {year}
                            </option>
                        );
                    })}
                </select>
            </div>
            {/* Display statistics for the selected month and year */}
            <div className="flex flex-wrap pt-10">
                <div className="w-full p-4 lg:w-1/3">
                    <h2 className="mb-4 text-2xl text-white">Total Monthly Outflow</h2>
                    <div className="rounded-lg bg-gray-700 p-4 py-5">
                        <p className="text-center text-xl font-bold text-white">${totalOutflow}</p>
                    </div>
                </div>
                <div className="w-full p-4 lg:w-1/3">
                    <h2 className="mb-4 text-2xl text-white">Total Monthly Taxes</h2>
                    <div className="rounded-lg bg-gray-700 p-4 py-5">
                        <p className="text-center text-xl font-bold text-white">${totalTax}</p>
                    </div>
                </div>
                <div className="w-full p-4 lg:w-1/3">
                    <h2 className="mb-4 text-2xl text-white">Monthly Invoice Count</h2>
                    <div className="rounded-lg bg-gray-700 p-4 py-5">
                        <p className="text-center text-xl font-bold text-white">{invoiceCount}</p>
                    </div>
                </div>
            </div>
            {/* Display transactions for the selected month and year */}
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
                        {Array.isArray(filteredData) && filteredData.map((data, index) => (
                            <tr key={index}>
                                <td className="border border-gray-500 px-4 py-2">{data.invoice_number}</td>
                                <td className="border border-gray-500 px-4 py-2">{data.invoice_date}</td>
                                <td className="border border-gray-500 px-4 py-2">{data.bill_from}</td>
                                <td className="border border-gray-500 px-4 py-2">{data.bill_to}</td>
                                <td className="border border-gray-500 px-4 py-2">{data.amount_due}</td>
                                <td className="border border-gray-500 px-4 py-2">{data.tax_amount}</td>
                                <td className="border border-gray-500 px-4 py-2">{data.grand_total}</td>
                                <td className="border border-gray-500 px-4 py-2">{data.transaction_description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="mt-4 flex justify-between">
                    {/* Export to CSV button */}
                    <div>
                        <button onClick={exportToCSV} className="rounded-full bg-sky-900 px-3 py-1 text-sm text-white hover:bg-sky-700">
                            Export to CSV
                        </button>
                    </div>
                    <div className="rounded-full bg-sky-900">
                        <button
                            className="rounded px-3 py-1 text-sm text-white"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            PREV
                        </button>
                        <span className="mx-4 text-sm text-white">
                            Page {currentPage} of {filteredData ? Math.ceil((filteredData.length ?? 0) / transactionsPerPage) : 0}
                        </span>
                        <button
                            className="rounded px-3 py-1 text-sm text-white"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentTransactions?.length !== transactionsPerPage}
                        >
                            NEXT
                        </button>
                    </div>
                </div>
            </div>
    );
}





