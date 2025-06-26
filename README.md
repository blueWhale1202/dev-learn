# Interactive LMS – Real-Time Learning Platform for Web Programming

**Interactive LMS** is a real-time, modular learning platform designed for hands-on web programming education. Unlike traditional LMS platforms, it integrates live coding sessions, secure code execution, collaborative whiteboards, and student progress tracking to create an engaging and practical learning experience.

---

## 💡 Problem Statement

Most LMS systems offer static content and asynchronous learning, which limits learner engagement and makes it difficult to replicate a classroom environment. Real-time collaboration, live streaming, and secure programming practice remain underdeveloped in current solutions.

---

## 🚀 What Interactive LMS Offers

### ✔️ Real-Time Coding Lectures

* Powered by **LiveKit**, instructors can deliver low-latency, real-time WebRTC-based lessons.
* Students can join via browsers, interact, and follow synchronized code and slides.

### ✔️ Secure & Scalable Livestream Infrastructure

* Ingest system built with self-hosted **LiveKit Ingress** services behind a TCP load balancer.
* Uses **Redis Pub/Sub** to manage distributed ingress node info.

![Self-hosting Ingress Service](https://github.com/user-attachments/assets/0e3ac494-b418-47e4-96fb-d885c2f9d069)

![Uploading ingress-ingress-service-light.svg…]()


> Diagram: Ingress architecture showing LiveKit Ingress clusters, Redis sync, and load balancing.

### ✔️ Flexible Video Infrastructure

* Adopted a hybrid between API-driven (Mux) and self-hosted DIY video streaming models.
* Allows customization from off-the-shelf to full infrastructure control.

![Video Integration Spectrum](https://github.com/user-attachments/assets/dcf53f1f-2efa-4b41-ab45-0f905af971ce)

![image](https://github.com/user-attachments/assets/49146097-b336-42c0-9a6e-9e82cf0de534)

> Diagram: Industry landscape showing where Mux, LiveKit, and LMS DIY livestreaming fit.

### ✔️ DIY Livestream Processing

* In-house video ingest system supports transcoding, bitrate adaptation, and HLS packaging.
* Reverse proxy gateway handles input streams from local/remote encoders.

![DIY Livestream Footprint](https://github.com/user-attachments/assets/1bc78bab-5d6e-44b2-bc95-eafa7865fdc7)


> Diagram: From raw video stream to segmented delivery via CDN, using modular pipeline.

### ✔️ Mux-Powered VOD + Analytics

* For recorded sessions, **MUX** handles RTMP ingest, storage, and playback with HLS.
* Includes playback stats, thumbnails, alerts, and data exports for BI integration.


![MUX Footprint](https://github.com/user-attachments/assets/883cfad8-4e56-4338-9461-ebdbc007d4ed)


> Diagram: Mux integration showing data flow from camera to viewer and BI systems.

---

## 🧱 Architecture Summary

| Component           | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| **LiveKit Ingress** | Handles real-time ingest for WebRTC sessions with load balancing         |
| **MUX Platform**    | Manages recorded lecture delivery, VOD hosting, and playback analytics   |
| **Redis**           | Maintains real-time cluster sync and ingress node availability tracking  |
| **CDN + HLS**       | Used for efficient adaptive video delivery (especially on Mux VOD flows) |
| **Offline Editor**  | Uses Yjs + IndexedDB for local persistence and CRDT-based collaboration  |

---

## 🏫 Value Delivered

| Stakeholder      | Value                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------- |
| **Learners**     | Join live classes, access on-demand videos, and collaborate in real-time                 |
| **Educators**    | Deliver low-latency classes, track learning outcomes, and scale across sessions          |
| **Institutions** | Balance between hosted and API-based video solutions, gain insights, and ensure security |

---

## 🔧 Development Highlights

* Hybrid livestream model: LiveKit for real-time; Mux for VOD.
* Cluster-ready LiveKit Ingress setup with Redis coordination.
* Diagram-driven design and modular deployments (video, code, collaboration).

> This LMS is not just another e-learning tool—it redefines the interactive classroom by combining scalable video infrastructure with real-time programming collaboration.
