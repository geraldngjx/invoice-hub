import React, { useEffect, useState } from "react";
import { SidePanel } from "../SidePanel";
import { HomeMainContent } from "./HomeMainContent"; // You might need to import this if it's used in your component

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

interface HomeContentProps {
    title: string;
}

export function HomeContent(props: HomeContentProps) {

    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/fetchAllFiles"); // Updated API route
                if (response.status !== 200) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: { data: File[] } = await response.json();
                setFiles(data.data);
            } catch (error) {
                console.error("There has been a problem with your fetch operation:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex h-full flex-wrap overflow-auto">
            <HomeMainContent files={files} />
            <SidePanel />
        </div>
    );
}
