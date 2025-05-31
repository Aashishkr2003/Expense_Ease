import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useFinancialRecords } from "../../contexts/financial-record-context";

export const FinancialRecordForm = () => {
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [amountType, setAmountType] = useState<"deposit" | "expense">("deposit");
  const { addRecord } = useFinancialRecords();

  const { user } = useUser();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let parsedAmount = parseFloat(amount);
    if (amountType === "expense") {
      parsedAmount = -Math.abs(parsedAmount);
    } else {
      parsedAmount = Math.abs(parsedAmount);
    }

    const newRecord = {
      userId: user?.id ?? "",
      date: new Date(),
      description: description,
      amount: parsedAmount,
      category: category,
      paymentMethod: paymentMethod,
    };

    addRecord(newRecord);
    setDescription("");
    setAmount("");
    setCategory("");
    setPaymentMethod("");
    setAmountType("deposit");
  };

  return (
    <div
      className="form-container form-container-centered"
      style={{
        borderRadius: "14px",
        boxShadow: "0 4px 24px rgba(44, 62, 80, 0.10)",
        padding: "2rem 2.5rem",
        marginBottom: "2rem",
        width: "100%",
        maxWidth: "500px",
        background: "var(--box-bg, #fff)",
        color: "var(--text-main, #213547)",
        border: "1.5px solid var(--input-border, #ccc)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="form-field">
          <label style={{ textAlign: "left", display: "block" }}>Description:</label>
          <input
            type="text"
            required
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label style={{ textAlign: "left", display: "block" }}>Amount:</label>
          <input
            type="number"
            required
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />
          <div style={{ marginTop: "0.2rem", display: "flex", gap: "1.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: 500 }}>
              <input
                type="radio"
                name="amountType"
                value="deposit"
                checked={amountType === "deposit"}
                onChange={() => setAmountType("deposit")}
              />
              Revenue
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: 500 }}>
              <input 
                type="radio"
                name="amountType"
                value="expense"
                checked={amountType === "expense"}
                onChange={() => setAmountType("expense")}
              />
              Expense 
            </label>
          </div>
        </div>
        <div className="form-field">
          <label style={{ textAlign: "left", display: "block" }}>Category:</label>
          <select
            required
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a Category</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Salary">Salary</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-field">
          <label style={{ textAlign: "left", display: "block" }}>Payment Method:</label>
          <select
            required
            className="input"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select a Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <button type="submit" className="button">
          Add Record
        </button>
      </form>
    </div>
  );
};
