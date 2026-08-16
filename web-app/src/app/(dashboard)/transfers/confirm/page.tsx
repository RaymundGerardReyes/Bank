import { redirect } from "next/navigation";
export default function DeprecatedConfirmPage() {
  redirect("/transfers");
}