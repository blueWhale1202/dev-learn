# Interactive LMS – Real-Time Learning Platform for Web Programming

**Interactive LMS** is a real-time, modular learning platform designed for hands-on web programming education. Unlike traditional LMS platforms, it integrates live coding sessions, secure code execution, collaborative whiteboards, and student progress tracking to create an engaging and practical learning experience.

---

## Problem Statement

Most LMS systems offer static content and asynchronous learning, which limits learner engagement and makes it difficult to replicate a classroom environment. Real-time collaboration, live streaming, and secure programming practice remain underdeveloped in current solutions.

---

## What Interactive LMS Offers

### Real-Time Coding Lectures with Resilient Ingress Architecture

To support low-latency, real-time lectures, the LMS integrates a **self-hosted ingress cluster** built on top of **LiveKit’s Ingress nodes**. These nodes receive video streams (via RTMP/WHIP) and forward them as **WebRTC data** to connected students.

**Key architectural components:**

* **TCP Load Balancer**: Distributes ingest traffic evenly across multiple LiveKit Ingress nodes to ensure availability and horizontal scalability.
* **Ingress Cluster**: Each node is responsible for converting upstream streams (e.g., RTMP from OBS) into WebRTC format and forwarding them to the main **LiveKit Server**.
* **LiveKit Server**: Authenticates sessions, handles signaling, and routes WebRTC data to participants in the classroom.
* **Redis Pub/Sub + Store**: Maintains real-time state about active ingress nodes, enabling dynamic scaling and fault recovery.

![Self-hosting Ingress Service](https://github.com/user-attachments/assets/06baae4f-3c5b-47a7-8209-ddcc0ade122a)


> This design allows students to join live lectures from unstable networks without stream interruption. The multi-node ingest layer acts as a fault-tolerant, scalable entry point that isolates traffic spikes and enables real-time switching between instructors or encoding pipelines.

### Flexible Video Infrastructure with Modular Strategy

To accommodate various levels of scalability, cost, and control, the system supports both **off-the-shelf** video APIs and **fully customizable** DIY streaming pipelines:

* The architecture sits across a spectrum: **MUX** offers ease of use and deep analytics for video-on-demand, while our **in-house pipeline** supports real-time encoding and live events.
* The hybrid setup allows seamless fallback, experimentation, and scaling depending on workload and event type.

![Video Integration Spectrum](https://github.com/user-attachments/assets/dcf53f1f-2efa-4b41-ab45-0f905af971ce)

> Diagram: Landscape showing tradeoffs between MUX (API-driven), LMS-hosted pipelines, and real-time options like LiveKit.

### DIY Livestream Processing Pipeline

We developed a lightweight, in-house video processing pipeline to support custom livestream scenarios:

* **Ingress Layer**: Streams are received via RTMP/SRT from OBS/FFmpeg, entering through a distributed reverse proxy gateway.
* **Processing Engine**: Handles transcoding (codec normalization), bitrate ladder generation, and adaptive packaging (e.g., HLS).
* **Segmentation & Origin**: Live streams are chopped into segments (2–6s) and stored on origin servers behind a CDN.
* **Egress + Delivery**: Streams are distributed via global CDNs with manifest routing, tokenized URLs, and adaptive bitrate playback.

![DIY Livestream Footprint](https://github.com/user-attachments/assets/1bc78bab-5d6e-44b2-bc95-eafa7865fdc7)

> Diagram: Modular stream processing system—supports real-time ingest, ABR packaging, and global delivery via CDN.

### Mux-Powered Video-on-Demand (VOD) and BI Integration

For recorded sessions and high-quality video playback, we use **MUX** to:

* Handle RTMP ingest and automatic transcoding.
* Generate playback-ready HLS streams with thumbnails, captions, and QoE metrics.
* Export detailed engagement data into custom BI dashboards via Mux Data Streaming.

![MUX Footprint](https://github.com/user-attachments/assets/883cfad8-4e56-4338-9461-ebdbc007d4ed)

> Diagram: MUX pipeline from live session → storage → adaptive delivery → playback analytics.

---

## Architecture Summary

| Component           | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| **LiveKit Ingress** | Handles real-time ingest for WebRTC sessions with load balancing         |
| **MUX Platform**    | Manages recorded lecture delivery, VOD hosting, and playback analytics   |
| **DIY Pipeline**    | Supports live video events with in-house encoding and segmentation       |
| **Redis**           | Maintains real-time cluster sync and ingress node availability tracking  |
| **CDN + HLS**       | Used for efficient adaptive video delivery (especially on Mux VOD flows) |
| **Offline Editor**  | Uses Yjs + IndexedDB for local persistence and CRDT-based collaboration  |

---

## Value Delivered

| Stakeholder      | Value                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------- |
| **Learners**     | Join live classes, access on-demand videos, and collaborate in real-time                 |
| **Educators**    | Deliver low-latency classes, track learning outcomes, and scale across sessions          |
| **Institutions** | Balance between hosted and API-based video solutions, gain insights, and ensure security |

---

## Development Highlights

* Hybrid livestream model: LiveKit for real-time; MUX for VOD.
* Cluster-ready LiveKit Ingress setup with Redis coordination.
* Modular livestream pipeline for DIY encoding and delivery.
* Emphasis on scalability, observability, and failover control.

> Interactive LMS provides architectural flexibility and operational resilience—bridging the needs of real-time learning, scalable video infrastructure, and collaborative content delivery.
