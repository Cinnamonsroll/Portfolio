"use client"
import "./contact.css"
import "../cafe.css"
import "./responsive.css"
import { WritingDeskFlow } from "./components/flow/WritingDesk";
import { ContactBackground } from "./components/layout/background";
import { ContactHeader } from "./components/layout/header";

export default function ContactPage() {
  return (
    <div className="contact-page">
      <ContactBackground />
      <ContactHeader />
      <WritingDeskFlow />
    </div>
  );
}
