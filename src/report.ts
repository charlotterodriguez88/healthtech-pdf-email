import { z } from "zod";
import { infrai } from "./infrai.js";

export const appointmentRequest = z.object({ patientName: z.string().min(1), appointmentDate: z.string().min(1), clinician: z.string().min(1), recipient: z.string().email() });
export type AppointmentRequest = z.infer<typeof appointmentRequest>;

export function generatePdfReport(input: AppointmentRequest): Uint8Array {
  const text = `Appointment report\\nPatient: ${input.patientName}\\nDate: ${input.appointmentDate}\\nClinician: ${input.clinician}`;
  return new TextEncoder().encode(`%PDF-1.4\\n${text}\\n%%EOF`);
}

export async function emailAppointmentReport(raw: unknown) {
  const input = appointmentRequest.parse(raw);
  const pdf = generatePdfReport(input);
  const html = `<h1>Appointment report</h1><p>Patient: ${input.patientName}</p><p>Date: ${input.appointmentDate}</p><p>Clinician: ${input.clinician}</p><p>PDF report generated (${pdf.byteLength} bytes).</p>`;
  return infrai.email.send({ to: input.recipient, subject: `Appointment report for ${input.patientName}`, html }, `appointment-${input.appointmentDate}-${input.recipient}`);
}
