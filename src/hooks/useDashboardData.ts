import { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface TransportRecord {
  createDate: string;
  primaryReference: string;
  status: string;
  weight: number;
  targetShipEarly: string;
  targetShipLate: string;
  targetDeliveryEarly: string;
  targetDeliveryLate: string;
  originCode: string;
  originName: string;
  originCity: string;
  originState: string;
  originZip: string;
  originCtry: string;
  destCode: string;
  destCity: string;
  destName: string;
  destState: string;
  destZip: string;
  destCtry: string;
}

export interface CustomerRecord {
  salesDivisionName: string;
  customerGroupDescription: string;
  shipToNumber: string;
  shipToName: string;
}

export interface MergedRecord extends TransportRecord {
  salesDivisionName: string;
  customerGroupDescription: string;
}

export function useDashboardData() {
  const [transportData, setTransportData] = useState<TransportRecord[]>([]);
  const [customerData, setCustomerData] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/transportation.csv")
        .then((r) => r.text())
        .then((text) => {
          const result = Papa.parse(text, { header: false, skipEmptyLines: true });
          const rows = result.data as string[][];
          const records: TransportRecord[] = rows.slice(1).map((row) => ({
            createDate: row[0] || "",
            primaryReference: row[1] || "",
            status: row[2] || "",
            weight: parseFloat(row[3]) || 0,
            targetShipEarly: row[4] || "",
            targetShipLate: row[5] || "",
            targetDeliveryEarly: row[6] || "",
            targetDeliveryLate: row[7] || "",
            originCode: row[8] || "",
            originName: row[9] || "",
            originCity: row[10] || "",
            originState: row[11] || "",
            originZip: row[12] || "",
            originCtry: row[13] || "",
            destCode: row[14] || "",
            destCity: row[15] || "",
            destName: row[16] || "",
            destState: row[17] || "",
            destZip: row[18] || "",
            destCtry: row[19] || "",
          }));
          setTransportData(records);
        }),
      fetch("/data/customer_groups.xlsx")
        .then((r) => r.arrayBuffer())
        .then((buffer) => {
          const wb = XLSX.read(buffer, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json<Record<string, string>>(ws);
          const records: CustomerRecord[] = json.map((row) => ({
            salesDivisionName: row["SALES DIVISION NAME"] || "",
            customerGroupDescription: row["CUSTOMER GROUP DESCRIPTION"] || "",
            shipToNumber: String(row["SHIP TO NUMBER"] || ""),
            shipToName: row["SHIP TO NAME"] || "",
          }));
          setCustomerData(records);
        }),
    ]).finally(() => setLoading(false));
  }, []);

  // Build lookup: destCode -> salesDivisionName (use destName as ship-to-name match key)
  const customerLookup = useMemo(() => {
    const map = new Map<string, CustomerRecord>();
    customerData.forEach((c) => {
      map.set(c.shipToNumber, c);
    });
    return map;
  }, [customerData]);

  const mergedData = useMemo<MergedRecord[]>(() => {
    return transportData.map((t) => {
      const customer = customerLookup.get(t.destCode);
      return {
        ...t,
        salesDivisionName: customer?.salesDivisionName || "UNASSIGNED",
        customerGroupDescription: customer?.customerGroupDescription || "",
      };
    });
  }, [transportData, customerLookup]);

  const divisions = useMemo(() => {
    const set = new Set(mergedData.map((d) => d.salesDivisionName));
    return Array.from(set).sort();
  }, [mergedData]);

  return { mergedData, divisions, loading };
}
