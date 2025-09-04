"use client";
import { useEffect, useState } from "react";
import { getHealthStatus } from "@/services/healthService";

export default function HealthPage() {
  const [status, setStatus] = useState<string>("Loading...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealthStatus()
      .then((data) => setStatus(data.status))
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch health status");
      });
  }, []);

  return (
    <div>
      <h2>Health Check</h2>
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>{status}</p>}
    </div>
  );
}


