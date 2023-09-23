import React, { useEffect, useState } from "react";
import axios from "axios";
import { SidePanel } from "../SidePanel";
import { HomeMainContent } from "./HomeMainContent"; // You might need to import this if it's used in your component

interface HomeContentProps {
    title: string;
}

interface File {
    name: string;
    createdOn: string;
    type: string;
    data: Data;
}

interface Data {
    bill_to: string;
    items: DataItem[];
    amount_due: string;
}

interface DataItem {
    item_description: string;
    item_quantity: string;
    item_price: string;
    item_total: string;
    tax_amount: string;
}

export function HomeContent(props: HomeContentProps) {

    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/fetchAllFiles");
                if (response.status !== 200) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: File[] = response.data.data; // Access the data property of the response object.
                setFiles(data);
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
