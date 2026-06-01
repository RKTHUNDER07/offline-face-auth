# EdgeAuth — Offline Biometric Attendance System

## Overview

EdgeAuth is an offline-first biometric authentication system built with React Native.

The project focuses on:

* Offline face registration
* Liveness validation
* Multi-angle embedding collection
* Local SQLite persistence
* Future offline attendance authentication

The system is designed for environments with unstable or unavailable internet connectivity.

---

# Current Features

## Completed

* React Native Android setup
* VisionCamera integration
* Real-time camera preview
* Offline ML Kit face detection
* Face alignment validation
* Left / Right pose validation
* Registration state machine
* Multi-stage registration flow
* Continuous embedding collection
* SQLite local storage
* Registration retrieval system
* Re-registration detection
* Offline persistence

---

# Registration Flow

```text
User Opens Registration
        ↓
Check Existing Registration
        ↓
Already Registered?
   ↙             ↘
YES               NO
↓                  ↓
Show              Start
Re-Register       Registration
Button            Flow
```

---

# Registration Pipeline

```text
Camera Preview
        ↓
Face Detection
        ↓
Face Normalization
        ↓
Registration State Machine
        ↓
Pose Validation
        ↓
Embedding Collection
        ↓
SQLite Persistence
        ↓
Registration Success
```

---

# Detailed Registration Flow

## 1. ALIGN

User aligns face inside circular frame.

Validation:

* Face detected
* Face close enough
* Face centered

---

## 2. CENTER HOLD

User holds center pose for a few seconds.

Purpose:

* Stable frontal embeddings
* Better face quality
* Lighting stabilization

Embeddings are continuously generated.

---

## 3. LEFT HOLD

User turns face left.

Purpose:

* Multi-angle biometric coverage
* Improve future authentication robustness

Embeddings continue generating.

---

## 4. RIGHT HOLD

User turns face right.

Purpose:

* Capture additional facial geometry
* Improve real-world attendance matching

Embeddings continue generating.

---

## 5. SUCCESS

After successful validation:

* Camera closes
* Registration finalizes
* Embeddings saved locally
* Registration marked complete

---

# Embedding Architecture

## Current State

Current embeddings are MOCK embeddings.

Example:

```ts
Array.from({ length: 128 }, () => Math.random())
```

This validates:

* pipeline architecture
* storage flow
* retrieval flow
* registration lifecycle

---

## Planned Real Embedding Pipeline

```text
Camera Capture
        ↓
Face Detection
        ↓
Face Crop
        ↓
Image Normalization
        ↓
TFLite FaceNet / MobileFaceNet
        ↓
Real Embedding Vector
        ↓
Embedding Averaging
        ↓
SQLite Storage
```

---

# SQLite Persistence Flow

```text
Registration Success
        ↓
saveRegistration()
        ↓
SQLite Insert
        ↓
Persistent Local Storage
        ↓
getRegistration()
        ↓
Offline Retrieval
```

---

# Current File Structure

```text
src/
│
├── core/
│   │
│   ├── auth/
│   │   └── liveness/
│   │       └── validators.ts
│   │
│   ├── detection/
│   │   └── normalizeDetection.ts
│   │
│   ├── embeddings/
│   │   └── generateEmbedding.ts
│   │
│   ├── registration/
│   │   ├── registrationMachine.ts
│   │   └── registrationEmbeddings.ts
│   │
│   └── storage/
│       ├── database.ts
│       ├── initDatabase.ts
│       ├── saveRegistration.ts
│       ├── getRegistration.ts
│       └── getAllRegistrations.ts
│
├── screens/
│   ├── HomeScreen.tsx
│   ├── RegistrationScreen.tsx
│   └── RegistrationCameraScreen.tsx
│
└── App.tsx
```

---

# Important Core Components

## Registration Machine

File:

```text
core/registration/registrationMachine.ts
```

Responsible for:

* registration stages
* pose validation
* user guidance
* stage transitions

---

## Embedding Collector

File:

```text
core/embeddings/generateEmbedding.ts
```

Responsible for:

* embedding generation
* continuous embedding collection
* future real embedding integration

---

## SQLite Layer

Files:

```text
core/storage/
```

Responsible for:

* database initialization
* local persistence
* retrieval
* offline registration state

---

# Technologies Used

| Technology            | Purpose                |
| --------------------- | ---------------------- |
| React Native          | Mobile application     |
| VisionCamera          | Camera pipeline        |
| ML Kit Face Detection | Offline face detection |
| SQLite                | Offline persistence    |
| TypeScript            | Type safety            |
| Hermes                | React Native JS engine |

---

# Current Technical Decisions

## Why SQLite?

SQLite provides:

* offline persistence
* fast local retrieval
* lightweight storage
* no internet dependency

Perfect for offline attendance systems.

---

## Why Continuous Embeddings?

Instead of storing a single embedding:

* multiple embeddings improve robustness
* captures different angles
* improves future authentication accuracy

---

## Why Left / Right Validation?

Real-world attendance conditions vary.

Multi-angle registration:

* improves recognition stability
* reduces pose dependency
* increases authentication success rate

---

# Current Limitations

## Mock Embeddings

Real face embeddings are not implemented yet.

Current embeddings are placeholder vectors.

---

## No Authentication Pipeline Yet

Attendance authentication is planned but not implemented.

---

## No Real-Time Frame Processing Yet

Current implementation:

* captures photos periodically
* runs ML Kit on captured images

Future versions may use:

* VisionCamera frame processors
* real-time inference

---

# Future Roadmap

## Phase 1 — Current

* Offline registration
* SQLite persistence
* Registration pipeline

---

## Phase 2

* Real TFLite embeddings
* Face cropping pipeline
* Embedding averaging

---

## Phase 3

* Cosine similarity matching
* Offline attendance authentication

---

## Phase 4

* Realtime frame processing
* Faster inference pipeline
* Optimization layer

---

## Phase 5

* Secure encryption
* Multi-user support
* Admin dashboard
* Sync architecture

---

# Planned Authentication Flow

```text
Open Attendance
        ↓
Live Face Detection
        ↓
Liveness Validation
        ↓
Generate Live Embedding
        ↓
Fetch Stored Embedding
        ↓
Cosine Similarity Match
        ↓
Attendance Success / Failure
```

---

# Project Status

Current status:

## Stable MVP Registration System

Working:

* Camera
* Face detection
* Pose validation
* Registration flow
* Embedding collection
* SQLite persistence
* Retrieval system

Next milestone:

* Real biometric embeddings

---

# Author

Built as part of an offline-first biometric attendance system hackathon project.
"""
