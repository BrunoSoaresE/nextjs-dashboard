import CustomersTable from "@/src/ui/customers/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Customers',
};

export default function Page() {
  
  return <CustomersTable ></CustomersTable>;
}