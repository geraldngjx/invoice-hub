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
    const [chartInstance, setChartInstance] = useState<Chart<"line", number[], string> | null>(null);

    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    // State to store the selected year
    const [selectedChartYear, setSelectedChartYear] = useState<number | null>(null);

    const [filteredData, setFilteredData] = useState<Data[] | null>(null);
    const [totalOutflow, setTotalOutflow] = useState<number>(0);
    const [totalTax, setTotalTax] = useState<number>(0);
    const [invoiceCount, setInvoiceCount] = useState<number>(0);

    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 10;

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredData?.slice(indexOfFirstTransaction, indexOfLastTransaction);

    // Function to handle year selection
    const handleSelectChartYear = (year: number) => {
        setSelectedChartYear(year);
    };

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
    const allData = _props.files.flatMap((file) => file.data);

    /*
    Functions to calculate statistics for the filtered data (NUMERICAL)
    */

    // Function to get unique months and years from the data
    const getUniqueMonthsAndYears = (data: Data[]) : string[] => {
        const uniqueDates = new Set();
        data.forEach((item) => {
            const date = new Date(item.invoice_date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Months are 0-indexed, so add 1
            uniqueDates.add(`${year}-${month}`);
        });
        return Array.from(uniqueDates) as string[];
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
    const calculateTotal = (type : string, data : Data[]) => {
        if (type === "outflow") {
            // Calculate the total outflow (sum of grand_total)
            return data.reduce((total, item) => {
                return total + parseFloat(item.grand_total);
            }, 0);
        } else if (type === "tax_amount") {
            // Calculate the total tax (sum of tax_amount)
            return data.reduce((total, item) => {
                return total + parseFloat(item.tax_amount);
            }, 0);
        } else if (type === "invoice_count") {
            // Calculate the number of invoices (count of Data_Item in every File object)
            return data.reduce((count, item) => {
                return count + item.items.length;
            }, 0);
        } else {
            // Handle other types if needed
            return 0;
        }
    };

    // Function to handle month and year selection
    const handleSelectMonthYear = (month: string, year: string) => {
        const monthInt = parseInt(month);
        const yearInt = parseInt(year);
        if (!isNaN(monthInt) && !isNaN(yearInt)) {
            setSelectedMonth(monthInt);
            setSelectedYear(yearInt);
        } else {
            setSelectedMonth(null);
            setSelectedYear(null);
        }
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

    const getMonthlyDataForYear = (selectedYear : number | null, data : Data[]) => {
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

    const getUniqueYears = (data: Data[]) : string[] => {
        const uniqueYears = new Set();
        data.forEach((item) => {
            const date = new Date(item.invoice_date);
            const year = date.getFullYear();
            uniqueYears.add(year);
        });
        return Array.from(uniqueYears) as string[];
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
            <div className="mr-12 mt-4 flex items-center justify-end">
                <label className="text-white">Select Year:</label>
                <select
                    className="ml-2 rounded bg-gray-700 p-2 text-sm text-white"
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
            <div className="mr-10 flex flex-wrap items-center justify-between border-t border-white pt-5">
                <div>
                    <h2 className="ml-5 pb-20 text-2xl font-bold text-white">Analysis</h2>
                </div>
                <div>
                    <label className="text-white">Select Month and Year:</label>
                    <select
                        className="ml-2 rounded bg-gray-700 p-2 text-sm text-white"
                        onChange={(e) => {
                            const [year, month] = e.target.value.split("-");
                            handleSelectMonthYear(month, year);
                        }}
                    >
                        <option value="null-null">Select a Month and Year</option>
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
            </div>
            {/* Display statistics for the selected month and year */}
            { selectedMonth !== null && selectedYear !== null ? (
            <div>
                <div className="flex flex-wrap">
                    <div className="w-full p-4 lg:w-1/3">
                        <h2 className="mb-4 text-lg text-white">Total Monthly Outflow</h2>
                        <div className="rounded-lg bg-gray-700 p-4 py-5">
                            <p className="text-center font-bold text-white">${totalOutflow}</p>
                        </div>
                    </div>
                    <div className="w-full p-4 lg:w-1/3">
                        <h2 className="mb-4 text-lg text-white">Total Monthly Taxes</h2>
                        <div className="rounded-lg bg-gray-700 p-4 py-5">
                            <p className="text-center font-bold text-white">${totalTax}</p>
                        </div>
                    </div>
                    <div className="w-full p-4 lg:w-1/3">
                        <h2 className="mb-4 text-lg text-white">Monthly Invoice Count</h2>
                        <div className="rounded-lg bg-gray-700 p-4 py-5">
                            <p className="text-center font-bold text-white">{invoiceCount}</p>
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
                            {Array.isArray(currentTransactions) && currentTransactions.map((data, index) => (
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
                        <button onClick={exportToCSV} className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-700">
                            Export to CSV
                        </button>
                    </div>
                    <div>
                        <button
                            className="rounded bg-blue-500 px-3 py-1 text-white"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="mx-4 text-white">
                            Page {currentPage} of {filteredData ? Math.ceil((filteredData.length ?? 0) / transactionsPerPage) : 0}
                        </span>
                        <button
                            className="rounded bg-blue-500 px-3 py-1 text-white"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentTransactions?.length !== transactionsPerPage}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            ) : 
            (<div className="rounded-lg bg-gray-700 p-4 py-5">
                <p className="text-center text-sm text-white">Select a valid timeframe to view insights</p>
            </div>
            )}
        </div>
    );
}

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




