# ZABAL Live Hub - Farcaster Mini App Architecture

> Technical documentation for hybrid mini app implementation

---

## 📋 Table of Contents

- [Overview](#overview)
- [Farcaster Protocol](#farcaster-protocol)
- [Hybrid Architecture](#hybrid-architecture)
- [Vote Power System](#vote-power-system)
- [Database Schema](#database-schema)
- [API Integration](#api-integration)
- [Implementation Plan](#implementation-plan)
- [Testing Strategy](#testing-strategy)

---

## 🎯 Overview

### What We're Building

A **hybrid mini app** that works both:
1. **Inside Farcaster** (Warpcast, other clients) - Full mini app experience
2. **As standalone website** - Fallback for non-Farcaster users

### Key Features

- **FID-based voting** (no wallet connection friction)
- **Vote power calculation** based on Farcaster social graph
- **Native sharing** via `composeCast()`
- **Push notifications** when stream locks/goes live
- **Persistent voting** across devices
- **Real-time updates** via Supabase

### Technology Stack

**Frontend:**
- Farcaster Mini App SDK (`@farcaster/miniapp-sdk`)
- Vanilla JavaScript (no frameworks)
- HTML5 + CSS3

**Backend:**
- Supabase (PostgreSQL database)
- Neynar API (Farcaster data)
- Vercel (hosting + serverless functions)

**Integration:**
- Farcaster protocol (identity layer)
- Snapchain (data storage)
- Optimism L2 (FID registry)

---

*See full documentation in the repository*

**Built with ❤️ by the ZABAL community**

*Last updated: December 17, 2024*
