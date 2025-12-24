Below is the **updated PRD (v0.90.3)** in **English**, with your **two new items properly integrated into the correct sections**, and an **updated Change Log** exactly as requested.
The structure still follows **BMad-Method PM standards**, but now reflects **commercialization and distribution strategy**, which is critical for selling to clinics.

---

# Product Requirements Document (PRD)

## Clinic CRM & Patient Engagement Mobile Application

---

## Change Log

| Date       | Version | Description                           | Author      |
| ---------- | ------- | ------------------------------------- | ----------- |
| 2025-12-18 | 0.90.1  | Initial PRD                           | Austin      |
| 2025-12-19 | 0.90.2  | Rewrite by ChatGPT                    | Bmad-Method |
| 2025-12-20 | 0.90.3  | Add pricing model & installation flow | Bmad-Method |

---

## 1. Document Information

| Item             | Description                         |
| ---------------- | ----------------------------------- |
| Product Name     | Clinic CRM & Patient Engagement App |
| Platform         | Mobile App (iOS / Android)          |
| Initial Target   | Medical Aesthetic Clinics           |
| Future Expansion | Pediatrics, ENT, Dental Clinics     |
| PRD Version      | v0.90.3                             |
| Status           | Draft                               |
| Methodology      | BMad-Method                         |

---

## 2. Product Vision & Objectives

### 2.1 Vision

Build a **patient-centric, clinic-efficient mobile CRM platform** that becomes the primary interaction channel between clinics and customers by integrating:

* Appointment booking
* Treatment records
* Patient communication
* Payment history
* Inventory workflows

into **one unified mobile experience**.

---

### 2.2 Product Goals

**For Patients**

* Simple and reliable appointment booking
* Transparent access to treatment history
* Reduced waiting time and communication friction

**For Clinics**

* Lower manual scheduling workload
* Better treatment and inventory tracking
* Stronger long-term customer relationship management (CRM)

---

## 3. Target Users & Personas

### 3.1 User Types

#### Patient (Customer)

* Installs the app via clinic-provided QR code
* Books appointments and reviews records
* Uses Barcode as clinic ID

#### Clinic Staff

* Manages appointments and treatments
* Scans Barcodes for workflow and inventory
* Communicates with patients

#### Clinic Admin

* Manages treatment catalog and pricing
* Reviews payment and operational reports
* Controls staff roles and permissions

---

## 4. Commercial Model & Licensing Strategy

### 4.1 Sales Model

This application is **sold to clinics (B2B)**, not directly to end users.

Pricing is determined by a **tiered model** based on:

* **Number of registered users**
* **Quarterly active users (QAU)**
* **Clinic’s quarterly average revenue range**

The pricing tiers and ranges will vary depending on:

* Clinic type (medical aesthetic, dental, pediatric, etc.)
* Clinic scale (solo practice vs. multi-doctor clinic)

---

### 4.2 Minimum Plan Constraint

* The application **must have a minimum required plan**
* Clinics cannot operate the system below the minimum defined tier
* Minimum tier ensures:

  * System sustainability
  * Core CRM feature availability
  * Baseline operational support

> Exact pricing numbers are **out of scope for this PRD** and will be defined in a separate Pricing Specification document.

---

## 5. Product Distribution & Installation Flow

### 5.1 App Installation Method

End users (patients) **do not search for the app independently**.

Instead, installation is initiated via **QR code scanning**, provided by the clinic.

---

### 5.2 QR Code Distribution Channels

Clinic-generated QR codes may be distributed through:

* Printed business cards
* In-clinic posters or flyers
* Facebook pages
* Official websites
* Other marketing or social media channels

---

### 5.3 QR Code Behavior

* QR code redirects user to:

  * App Store / Google Play (if app not installed)
  * App deep link (if already installed)
* QR code may embed:

  * Clinic identifier
  * Campaign or referral source (future use)

---

## 6. Product Scope

### 6.1 In Scope (Phase 1)

* Appointment booking & cancellation
* Treatment record management
* Barcode-based identification
* Notification system
* Payment history records
* Backend inventory control (clinic only)
* QR-code-based onboarding

---

### 6.2 Out of Scope (Future Phases)

* Insurance claim integration
* Deep EMR/HIS system integration
* Cross-clinic membership sharing
* Built-in app store marketing

---

## 7. Functional Requirements

---

### 7.1 Appointment & Booking System

**Overview**

* Bi-weekly rolling calendar (current week + next week only)
* Two booking modes:

  1. Specific doctor + specific time slot (queue-based)
  2. Specific doctor + time period (long treatments)

**Key Requirements**

* Doctor schedule change → patient must rebook
* Patient cancellation → slot released immediately
* Each booking generates a unique Reservation ID

---

### 7.2 Treatment Records

* Full patient treatment history
* Includes date, doctor, treatment type, notes
* System-generated suggestions:

  * Next treatment
  * Related treatments
  * Post-treatment cautions

---

### 7.3 Barcode System

* Unique Barcode (QR Code) per patient
* Used for:

  * Patient identification
  * Treatment workflow
  * Medicine and supply tracking
  * Inventory in/out control

---

### 7.4 Treatment Catalog (Treatment Pool)

* List of all treatments with descriptions and advantages
* Authorized staff can manage:

  * Content
  * Instructions
  * Cautions
  * Pricing

---

### 7.5 Notification System

* Event-driven notifications:

  * Booking updates
  * Treatment reminders
  * Promotions
* Channels:

  * App push (Phase 1)
  * Email / LINE (Phase 2)

---

### 7.6 Inventory Control (Backend Only)

* Clinic staff only
* Barcode-based inventory tracking
* Linked to treatment usage

---

### 7.7 Payment & Transaction Records

* Record all payment history
* Support discounts and special campaigns
* Viewable by patients

> Payment gateway integration planned for Phase 2

---

### 7.8 Authentication & Authorization

* Patient registration & login
* Staff login with role-based permissions
* Admin-level access for configuration

---

### 7.9 Navigation Structure (Patient App)

* Home
* My Reservations
* Book Appointment
* My Records
* More

---

### 7.10 Chat & Feedback

* Patient feedback on treatments
* Chat grouping:

  * By clinic department
  * By assigned doctor

---

## 8. Non-Functional Requirements

* Secure handling of medical-related data
* System availability ≥ 99%
* Scalable for multi-clinic deployment
* Mobile-first performance

---

## 9. Success Metrics (KPIs)

* Appointment booking success rate
* Rebooking rate after cancellation
* Quarterly active users (QAU)
* Reduction in clinic manual scheduling workload
* Clinic retention rate by pricing tier

---

## 10. Recommended Next Steps (BMad-Method)

Suggested continuation:

1. **Define Pricing Tier Specification (separate doc)**
2. **UX Expert** → Onboarding & QR-based install flow
3. **Architect** → Multi-tenant & licensing-aware architecture
4. **PO** → MVP epics and stories

---

If you want, next I can:
1️⃣ Create a **Pricing Tier & Licensing Spec**
2️⃣ Design the **QR-based onboarding user flow**
3️⃣ Break this PRD into **MVP Epics & User Stories**

Just tell me which one you want next.
