import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About the Editors",
  description:
    "Student engineers focused on cloud computing, backend engineering, system design, and frontend development.",
};

export default function AboutPage() {
  return <AboutClient />;
}
