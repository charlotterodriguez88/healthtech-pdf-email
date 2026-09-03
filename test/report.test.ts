import assert from "node:assert/strict";
import { appointmentRequest, generatePdfReport } from "../src/report.js";

const valid = { patientName: "Ava", appointmentDate: "2026-09-04", clinician: "Dr. Rivera", recipient: "care@example.com" };
assert.equal(appointmentRequest.safeParse(valid).success, true);
assert.equal(appointmentRequest.safeParse({ ...valid, recipient: "not-an-email" }).success, false);
assert.match(new TextDecoder().decode(generatePdfReport(valid)), /Appointment report/);
console.log("report boundary test passed");
