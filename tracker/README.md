# 📄 Invoice Tracker System

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/SpringBoot-3.x-brightgreen)
![Maven](https://img.shields.io/badge/Build-Maven-blue)
![License](https://img.shields.io/badge/License-MIT-lightgrey)
![Status](https://img.shields.io/badge/Status-Active-success)


Health Monitoring APIs;
/actuator/health
/actuator/metrics
/actuator/loggers
/actuator/httptrace



---

## 🚀 Overview

The **Invoice Tracker System** is a scalable backend application built using **Spring Boot** that helps businesses manage:

- 📑 Invoices  
- 💳 Payments  
- 🛒 Items  
- 🔔 Notifications  

It follows a **multi-tenant architecture**, ensuring secure data isolation for different shops.

---

## ✨ Features

- ✅ Multi-tenant secure system  
- ✅ Invoice lifecycle management  
- ✅ Payment tracking  
- ✅ Event-driven notifications  
- ✅ Async email service  
- ✅ Clean layered architecture  

---

## 🧱 Tech Stack

| Layer        | Technology            |
|-------------|----------------------|
| Backend     | Java, Spring Boot    |
| ORM         | Hibernate / JPA      |
| Security    | Spring Security      |
| Build Tool  | Maven                |
| Database    | MySQL / PostgreSQL   |

---

## 🏗️ Architecture

### 🔹 High-Level Flow


---

### 🔹 Project Structure

com.invoice.tracker
│
├── controller       # REST APIs
├── service       # Business logic
├── repository       # DB operations
├── entity       # Database models
├── dto       # Request/Response models
├── security       # Authentication & Authorization
├── notification       # Email + In-app system
└── common       # Exceptions & utilities

---

## 📦 Core Modules

### 📑 Invoice Module

- Create and manage invoices
- Maintain invoice lifecycle

**Fields:**
- `invoiceNumber`
- `shopId`
- `customerName`
- `totalAmount`
- `status (PENDING, PAID, OVERDUE)`
- `dueDate`

---

### 🧾 Invoice Items

Each invoice contains multiple items.
total = quantity × price

---

### 🛒 Item Catalog

- Reusable product list per shop  
- Linked with invoices  

---

### 💳 Payment Module

Handles:
- Payment creation  
- Invoice updates  
- Event publishing  

**Flow:**
Payment → Invoice Updated → Event → Notification

---

### 🔔 Notification System

Supports:
- 📧 Email notifications  
- 📱 In-app notifications  

**Features:**
- Async processing (`@Async`)
- Event-driven architecture

---

## 🔐 Security

### Multi-Tenant Validation

```java
if (!invoice.getShopId().equals(shopId)) {
    throw new AccessDeniedException("Unauthorized access");
}


Highlights:
    User-based authentication
    Shop-level data isolation
    Secure endpoints


// ===============================
// API Endpoints
// ===============================

Invoice APIs:
POST   /api/invoices
GET    /api/invoices/{id}
GET    /api/invoices
PUT    /api/invoices/{id}


Payment APIs:
POST   /api/payments


Notification APIs:
GET    /api/notifications
GET    /api/notifications/unread
PUT    /api/notifications/read/{id}


// ===================================
Invoice Lifecycle
PENDING → PAID → OVERDUE