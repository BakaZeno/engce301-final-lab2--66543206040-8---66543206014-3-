# ENGCE301 -- Final Lab Set 2

| ชื่อ | รหัสนักศึกษา | หน้าที่ |
|-----|-----|-----|
| นายจิรวัฒน์ มาลัยวรรณ | 66543206070-5
| นายณัฐกิตติ์ ยั่งยืนปิยรัตน์ | 66543206014-3
| นายจักรกฤษณ์ จาปัญญะ | 66543206040-8
 URL จริงของทุก Service บน Railway

## ระบบจัดการงานแบบ Microservices (Docker + Railway)

## 📌 ภาพรวมโปรเจกต์

โปรเจกต์นี้เป็นระบบ **Task Management System** ที่พัฒนาด้วยแนวคิด **Microservices
Architecture**\
โดยใช้เทคโนโลยีหลักดังนี้

-   **Node.js + Express**
-   **PostgreSQL**
-   **Docker / Docker Compose**
-   **Railway Cloud Platform**

ระบบแบ่งออกเป็น **3 Services หลัก** และแต่ละ Service มี **Database แยกกัน**
ตามหลักการของ Microservices

### Services ในระบบ

-   **Auth Service** -- จัดการการสมัครสมาชิกและเข้าสู่ระบบ (JWT
    Authentication)
-   **User Service** -- จัดการข้อมูลผู้ใช้งาน
-   **Task Service** -- จัดการรายการงาน (CRUD Tasks)

------------------------------------------------------------------------

# 🏗 โครงสร้างระบบ (Architecture)

Frontend (Nginx)

เชื่อมต่อไปยัง Backend 3 Service

Frontend → Auth Service → Auth Database\
Frontend → User Service → User Database\
Frontend → Task Service → Task Database

------------------------------------------------------------------------

# 🧩 รายละเอียด Microservices

## 1️⃣ Auth Service

ใช้สำหรับจัดการระบบ Authentication

### API Endpoints

  Method   Endpoint    คำอธิบาย
  -------- ----------- -------------------------
  POST     /register   สมัครสมาชิก
  POST     /login      เข้าสู่ระบบและรับ JWT Token

### ตัวอย่าง Register

``` bash
curl -X POST https://auth-service-production-eaac.up.railway.app/register \
-H "Content-Type: application/json" \
-d '{"username":"alice","email":"alice@example.com","password":"123456"}'
```

------------------------------------------------------------------------

## 2️⃣ User Service

ใช้สำหรับจัดการข้อมูลผู้ใช้งาน

### API Endpoints

  Method   Endpoint     คำอธิบาย
  -------- ------------ ----------------
  GET      /users       ดูรายชื่อผู้ใช้ทั้งหมด
  GET      /users/:id   ดูข้อมูลผู้ใช้ตาม ID

------------------------------------------------------------------------

## 3️⃣ Task Service

ใช้สำหรับจัดการงานของผู้ใช้

### API Endpoints

  Method   Endpoint     คำอธิบาย
  -------- ------------ ------------
  GET      /tasks       ดูรายการงาน
  POST     /tasks       สร้างงาน
  PUT      /tasks/:id   แก้ไขงาน
  DELETE   /tasks/:id   ลบงาน

### ตัวอย่างการสร้าง Task

``` bash
curl -X POST https://task-service-production-8e3f.up.railway.app/tasks \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{"title":"Finish Final Lab"}'
```

------------------------------------------------------------------------

# 🐳 วิธีรันโปรเจกต์บนเครื่อง (Docker)

## 1️⃣ Clone Repository

``` bash
git clone git@github.com:BakaZeno/engce301-final-lab2--66543206040-8---66543206014-3-.git
```

## 2️⃣ รัน Docker Compose

``` bash
docker compose up --build
```

## 3️⃣ ตรวจสอบ Container

``` bash
docker ps
```

ควรเห็น container ดังนี้

-   auth-service
-   user-service
-   task-service
-   auth-db
-   user-db
-   task-db
-   nginx
-   frontend

------------------------------------------------------------------------

# ☁️ Deployment บน Railway

  Service        URL
  -------------- -----------------------------------------------------
  Auth Service   https://auth-service-production-eaac.up.railway.app
  User Service   https://user-service-production-32c4.up.railway.app
  Task Service   https://task-service-production-8e3f.up.railway.app

------------------------------------------------------------------------

# 🧪 ตัวอย่างการทดสอบ API

### สมัครสมาชิก

``` bash
curl -X POST https://auth-service-production-eaac.up.railway.app/register \
-H "Content-Type: application/json" \
-d '{"username":"test","email":"test@test.com","password":"123456"}'
```

### Login

``` bash
curl -X POST https://auth-service-production-eaac.up.railway.app/login \
-H "Content-Type: application/json" \
-d '{"email":"test@test.com","password":"123456"}'
```

### สร้าง Task

``` bash
curl -X POST https://task-service-production-8e3f.up.railway.app/tasks \
-H "Authorization: Bearer TOKEN" \
-H "Content-Type: application/json" \
-d '{"title":"Task 1"}'
```

------------------------------------------------------------------------

# 📂 โครงสร้างโปรเจกต์

    project-root
    │
    ├── auth-service
    ├── user-service
    ├── task-service
    ├── frontend
    ├── nginx
    └── docker-compose.yml

------------------------------------------------------------------------

# 🧑‍💻 เทคโนโลยีที่ใช้

-   Node.js
-   Express.js
-   PostgreSQL
-   Docker
-   Docker Compose
-   Nginx
-   Railway Cloud

------------------------------------------------------------------------

# 🎯 วัตถุประสงค์ของโปรเจกต์

โปรเจกต์นี้ช่วยให้เข้าใจ

-   Microservices Architecture
-   การใช้ Docker สำหรับ Containerization
-   การสร้าง REST API
-   การ Deploy ระบบขึ้น Cloud
-   การจัดการหลาย Service และหลาย Database
