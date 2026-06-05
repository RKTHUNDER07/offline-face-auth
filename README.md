# EdgeAuth — Offline First Biometric Attendance System

## Overview

EdgeAuth is a lightweight offline-first biometric attendance system built using React Native, TensorFlow Lite, ML Kit Face Detection, and SQLite.

The project focuses on performing complete on-device facial authentication without requiring continuous internet connectivity.

The system was designed specifically for:

* low-connectivity environments
* field attendance systems
* lightweight mobile deployment
* privacy-focused biometric authentication
* mid-range Android devices

The complete biometric pipeline runs fully on-device using TensorFlow Lite inference and local SQLite persistence.

---

# Core Features

## Implemented

### Biometric Registration System

* Multi-stage face registration
* Multi-angle embedding collection
* Continuous embedding generation
* Offline SQLite persistence
* Re-registration support

### Attendance Authentication System

* Real-time attendance authentication
* Embedding-bank matching
* Similarity-based authentication
* Adaptive embedding updates
* Duplicate attendance prevention

### Offline-First Architecture

* Local attendance persistence
* Queue-based deferred sync
* Offline attendance support
* Sync recovery system

### AI Inference Pipeline

* TensorFlow Lite inference
* MobileFaceNet embeddings
* Real image preprocessing
* Face crop normalization
* Embedding comparison pipeline

### Storage & Lifecycle Management

* SQLite persistence
* Temp image cleanup
* Attendance history
* Sync state management

---

# System Architecture

```text
User
 ↓
Vision Camera
 ↓
ML Kit Face Detection
 ↓
Face Alignment & Liveness Validation
 ↓
Face Crop & Preprocessing
 ↓
TensorFlow Lite Inference
 ↓
Face Embedding Generation
 ↓
Embedding-Bank Authentication
 ↓
SQLite Persistence
 ↓
Offline Queue
 ↓
Sync Trigger
(App Startup / Attendance Success)
 ↓
Cloud Sync Layer
```

---

# Current Architecture Design

The system follows a modular layered architecture where:

* biometric processing
* authentication
* persistence
* synchronization
* UI workflows

are isolated into separate service layers.

This separation improves:

* maintainability
* future scalability
* enterprise integration
* offline reliability
* modular deployment

---

# Registration Pipeline

The registration system performs complete offline biometric enrollment.

Current flow:

```text
User Opens Registration
        ↓
Face Alignment Validation
        ↓
Center Hold Validation
        ↓
Left Pose Validation
        ↓
Right Pose Validation
        ↓
Continuous Embedding Collection
        ↓
Embedding Bank Creation
        ↓
SQLite Persistence
        ↓
Registration Success
```

---

# Detailed Registration Stages

## 1. Face Alignment

User aligns face inside guide overlay.

Validation:

* face detected
* face centered
* stable alignment
* sufficient face size

Purpose:

* stable face geometry
* deterministic crop region
* improved embedding consistency

---

## 2. Multi-Angle Registration

The system captures embeddings during:

* frontal pose
* left pose
* right pose

Purpose:

* improve authentication robustness
* reduce pose dependency
* improve real-world matching accuracy

---

## 3. Continuous Embedding Collection

Instead of storing a single embedding:

* multiple embeddings are collected continuously
* tiny facial variations are captured
* embedding diversity improves matching stability

Purpose:

* improved cosine similarity robustness
* reduced false rejection
* adaptive face representation

---

## 4. TensorFlow Lite Inference

Current AI pipeline:

```text
Captured Image
        ↓
Face Crop
        ↓
Resize (112x112)
        ↓
RGB Extraction
        ↓
Normalization [-1,1]
        ↓
Float32 Tensor Conversion
        ↓
MobileFaceNet Inference
        ↓
128-Dimensional Embedding
```

Current model:

* MobileFaceNet (.tflite)

Runtime:

* react-native-fast-tflite

---

## 5. SQLite Registration Persistence

Registration stores:

* uid
* embedding bank
* registration timestamp

Persistence flow:

```text
Registration Success
        ↓
saveRegistration()
        ↓
SQLite Insert
        ↓
Persistent Offline Storage
```

---

# Attendance Authentication Pipeline

The attendance system performs real-time biometric authentication fully offline.

Current flow:

```text
Attendance Camera
        ↓
Face Alignment Validation
        ↓
ML Kit Face Detection
        ↓
Liveness Validation
        ↓
Face Preprocessing
        ↓
TensorFlow Lite Inference
        ↓
Live Embedding Generation
        ↓
Embedding-Bank Authentication
        ↓
Attendance Storage
        ↓
Queue-Based Sync
        ↓
Temp Cleanup
```

---

# Current Authentication Logic

## Embedding-Bank Authentication

The system authenticates against multiple stored embeddings instead of a single vector.

Current flow:

```text
Live Embedding
        ↓
Compare Against Embedding Bank
        ↓
Best Similarity Score
        ↓
Threshold Validation
        ↓
Attendance Decision
```

Benefits:

* improved robustness
* lighting tolerance
* pose variation handling
* better long-term authentication stability

---

## Adaptive Embedding Updates

If authentication similarity exceeds:

```text
0.90+
```

the live embedding is added back into the embedding bank.

Purpose:

* adaptive identity refinement
* improved long-term recognition
* real-world appearance adaptation

Embedding bank size remains bounded using FIFO cleanup logic.

---

# Offline Queue Architecture

Attendance is always stored locally first.

Current flow:

```text
Attendance Success
        ↓
SQLite Attendance Logs
        ↓
Pending Sync Queue
        ↓
Sync Trigger
(App Startup / Attendance Success)
        ↓
Internet Available?
        ↓
Cloud Sync
        ↓
Mark Synced = 1
```

Current sync layer:

* mocked locally
* AWS-ready architecture

---

# Temporary File Lifecycle

The system automatically deletes temporary biometric images after processing.

Current lifecycle:

```text
Camera Capture
        ↓
Register Temp File
        ↓
Inference Pipeline
        ↓
Attendance / Registration Complete
        ↓
Automatic Cleanup
```

Purpose:

* reduce storage accumulation
* privacy-focused design
* lightweight deployment

Only embeddings persist permanently.

---

# Benchmark Results

| Operation                | Average Time |
| ------------------------ | ------------ |
| Embedding Authentication | ~13 ms       |
| Embedding Generation     | ~146 ms      |
| Face Detection           | ~536 ms      |
| Camera Capture           | ~805 ms      |

---

# Current Bottlenecks

## Camera Capture Latency

Current attendance flow uses:

* photo-based capture

instead of:

* real-time frame processors

This increases camera overhead.

---

## ML Kit Detection Overhead

Face detection contributes significant latency on lower-end devices.

Future frame-based inference can reduce this overhead significantly.

---

# Current Technical Status

## Fully Working

### Registration

* VisionCamera
* ML Kit face detection
* Multi-angle registration
* Real TFLite embeddings
* Embedding collection
* SQLite persistence

### Attendance

* Real-time authentication
* Embedding-bank matching
* Offline attendance
* Queue sync
* Adaptive embeddings
* Temp cleanup

### Infrastructure

* SQLite architecture
* Deferred sync layer
* Benchmark system
* Attendance history
* Sync state tracking

---

# Current File Structure

```text
src/
│
├── assets/
│   └── models/
│       └── mobilefacenet.tflite
│
├── screens/
│   ├── HomeScreen.tsx
│   ├── RegistrationScreen.tsx
│   ├── RegistrationCameraScreen.tsx
│   ├── AttendanceScreen.tsx
│   ├── AttendanceCameraScreen.tsx
│   └── BenchmarkScreen.tsx
│
├── core/
│   │
│   ├── auth/
│   │   ├── authMachine.ts
│   │   ├── authTypes.ts
│   │   └── runEmbeddingAuth.ts
│   │
│   ├── embeddings/
│   │   ├── cropFace.ts
│   │   ├── preprocessFace.ts
│   │   ├── generateEmbedding.ts
│   │   ├── compareEmbeddings.ts
│   │   ├── normalizeEmbedding.ts
│   │   └── loadModel.ts
│   │
│   ├── detection/
│   │   └── normalizeDetection.ts
│   │
│   ├── liveness/
│   │   └── validators.ts
│   │
│   ├── registration/
│   │   ├── registrationMachine.ts
│   │   └── registrationEmbeddings.ts
│   │
│   ├── attendance/
│   │   └── markAttendance.ts
│   │
│   ├── storage/
│   │   ├── database.ts
│   │   ├── initDatabase.ts
│   │   ├── saveRegistration.ts
│   │   ├── getRegistration.ts
│   │   ├── saveAttendance.ts
│   │   ├── getAttendanceLogs.ts
│   │   ├── syncAttendance.ts
│   │   ├── markAttendanceAsSynced.ts
│   │   ├── getTodayAttendance.ts
│   │   └── resetTodayAttendance.ts
│   │
│   └── location/
│       └── getCurrentLocation.ts
│
├── utils/
│   ├── benchmark.ts
│   └── tempFileManager.ts
│
└── App.tsx
```

---

# Technologies Used

| Technology            | Purpose                           |
| --------------------- | --------------------------------- |
| React Native          | Cross-platform mobile application |
| VisionCamera          | Camera pipeline                   |
| ML Kit Face Detection | Offline face detection            |
| TensorFlow Lite       | On-device AI inference            |
| MobileFaceNet         | Face embedding generation         |
| SQLite                | Offline persistence               |
| NetInfo               | Connectivity monitoring           |
| react-native-fs       | Temp file lifecycle               |
| TypeScript            | Type safety                       |

---

# Current Technical Decisions

## Why MobileFaceNet?

Chosen because:

* lightweight model size
* mobile optimized inference
* fast embedding generation
* low-end device compatibility

---

## Why SQLite?

SQLite provides:

* offline persistence
* lightweight deployment
* fast local retrieval
* no cloud dependency

Perfect for offline attendance systems.

---

## Why Embedding Banks?

Instead of storing a single embedding:

* multiple embeddings improve robustness
* captures real-world variations
* improves authentication stability

---

## Why Offline-First?

Field environments often:

* lack stable internet
* operate in remote regions
* require uninterrupted attendance capability

Local-first persistence ensures reliability.

---

# Current Limitations

* Current sync layer is mocked locally
* Current liveness validation is basic
* No encrypted SQLite layer yet
* Current attendance pipeline uses photo capture
* Single-user-per-device architecture

---

# Future Scope

* Real-time frame processors
* Advanced anti-spoofing
* AWS production backend
* Background sync services
* Encrypted biometric storage
* Enterprise SDK architecture
* Multi-user organization support
* Low-end device optimization

---

# Enterprise Integration Possibilities

Current implementation exposes:

* registration screens
* attendance screens
* local persistence layer
* sync layer
* authentication pipeline

Future enterprise integration can convert these into:

* reusable SDK modules
* embeddable biometric workflows
* workforce management integrations

Potential future integration APIs:

```ts
FaceAuth.register()

FaceAuth.authenticate()

FaceAuth.sync()
```

The current modular architecture was intentionally designed to support future enterprise integration without major biometric pipeline rewrites.

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

## Install Dependencies

```bash
npm install
```

---

# Android Setup

## Start Metro

```bash
npx react-native start
```

## Run Android

```bash
npx react-native run-android
```

---

# Required Permissions

## Android

* Camera
* Storage
* Internet
* Location



# Conclusion

EdgeAuth demonstrates a practical offline-first biometric attendance architecture optimized for lightweight mobile deployment and real-world field attendance environments.

The system combines:

* on-device AI inference
* offline persistence
* adaptive biometric authentication
* queue-based synchronization
* modular architecture

while remaining lightweight, privacy-focused, and scalable for future enterprise deployment.
