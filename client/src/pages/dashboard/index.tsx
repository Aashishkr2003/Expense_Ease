import { useUser } from "@clerk/clerk-react";
import { FinancialRecordForm } from "./financial-record-form";
import { FinancialRecordList } from "./financial-record-list";
import "./financial-record.css";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import { useMemo } from "react";
export const Dashboard = () => {
  const { user } = useUser();
  const { records } = useFinancialRecords();

  const totalMonthly = useMemo(() => {
    let totalAmount = 0;
    records.forEach((record) => {
      totalAmount += record.amount;
    });

    return totalAmount;
  }, [records]);

  return (
    <div className="dashboard-container">
      <h1
        style={{
          color: "#4e97e5",
          fontWeight: 700,
          fontSize: "3.2rem",
          letterSpacing: "1px",
          marginBottom: "1.5rem",
          textShadow: "0 2px 8px rgba(44, 62, 80, 0.10)",
          textAlign: "center",
          width: "100%",
        }}
      >
        Welcome {user?.firstName}!
        <span
          style={{
            display: "block",
            fontWeight: 400,
            fontSize: "1.2rem",
            color: "var(--text-main, #2c3e50)",
            marginTop: "0.3rem",
            letterSpacing: "0.5px",
            textShadow: "none",
          }}
        >
          Here Are Your Finances🪙💵
        </span>
      </h1>
      <FinancialRecordForm />
      <div className="total-monthly-card">
        <span className="total-label">TOTAL AMOUNT:</span>
        <span className="total-value">${totalMonthly}</span>
      </div>
      <FinancialRecordList />
    </div>
  );
};
