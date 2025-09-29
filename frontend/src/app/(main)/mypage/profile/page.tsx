import { serverFetch } from "@/lib/http/server";
import { useUser } from "@/hooks/useUser";
import { accountAPI } from "@/lib/api/account";
import ProfileClient from "@/components/main/mypage/profile/ProfileClient";

async function getProfile() {
  const res = await serverFetch("/api/v1/users/me/profile");
  return res.ok ? res.json() : null;
}

export default async function Profile() {
  const profile = await getProfile();

  return <ProfileClient initialProfile={profile} />;
}
