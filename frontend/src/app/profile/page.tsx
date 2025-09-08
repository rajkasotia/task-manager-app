"use client";
import { fetchProfile, getAuthUser, isAuthenticated } from "@/utils/authClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ProfileData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  userId?: string;
  [key: string]: any;
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/signin");
      return;
    }
    const localUser = getAuthUser();
    fetchProfile()
      .then((res: any) => {
        const data = res?.data || localUser || null;
        setProfile(data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="container py-16">Loading...</div>;

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl rounded-lg border border-stroke bg-white p-8 shadow dark:border-dark-3 dark:bg-dark-2">
        <h1 className="mb-6 text-3xl font-semibold">Profile</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-dark-6">First Name</p>
            <p className="text-lg">{profile?.firstName || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-dark-6">Last Name</p>
            <p className="text-lg">{profile?.lastName || "-"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-dark-6">Email</p>
            <p className="text-lg">{profile?.email || "-"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-dark-6">User ID</p>
            <p className="text-lg break-all">{profile?.userId || "-"}</p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Link href="/dashboard" className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}


