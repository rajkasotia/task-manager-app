"use client";
import { fetchProfile, getAuthUser, isAuthenticated } from "@/utils/authClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/signin");
      return;
    }
    const user = getAuthUser();
    setUserName(user ? `${user.firstName} ${user.lastName}` : "");
    fetchProfile().finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="container py-16">Loading...</div>;

  return (
    <div className="container py-16">
      {/* <h1 className="mb-4 text-3xl font-semibold">Dashboard</h1> */}
      <p className="mt-8 mb-8 text-lg">Welcome{userName ? `, ${userName}` : ""}!</p>
      {/* Content for task management dashboard will go here */}
    </div>
  );
}


