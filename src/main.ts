import { emailAppointmentReport } from "./report.js";

const result = await emailAppointmentReport({ patientName: "Ava Chen", appointmentDate: "2026-09-04 09:30", clinician: "Dr. Rivera", recipient: process.env.DEMO_EMAIL_TO ?? "" });
console.log(`sent appointment report: ${result.message_id}`);
