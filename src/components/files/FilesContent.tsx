import { SidePanel } from "../SidePanel";
import { FilesMainContent } from "./FilesMainContent";

interface ContentProps {
  title: string;
  files: File[];
}

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
  _id: string;
  fileName: string;
  createdOn: string;
  fileType: string;
  data: Data;
}

export function FilesContent(props: ContentProps) {
  const files = props;

  return (
    <div className="flex h-full flex-wrap">
      <FilesMainContent title={props.title} files={files.files} />
      <SidePanel />
    </div>
  );
}
