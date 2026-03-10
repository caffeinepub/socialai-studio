# SocialAI Studio

## Current State
Empty project, no existing frontend or backend code.

## Requested Changes (Diff)

### Add
- Full social media automation platform UI with dummy data
- Dashboard with overview stats (posts scheduled, published, engagement)
- Idea Input flow: user enters a topic/keyword to kick off content workflow
- Caption Generator: shows 3 dummy caption options (short, story, engagement)
- Creative Generator: placeholder post graphic previews with aspect ratio options (1:1, 4:5, 9:16)
- Approval workflow: review, edit, approve or reject posts
- Caption Optimization step: shows an "optimized" version of the approved caption
- Hashtag Generator: displays trending, niche, and brand hashtags
- Smart Scheduling: suggest best time slots, allow user to pick and schedule
- Content Calendar: monthly/weekly view of scheduled posts
- Performance Analytics: dummy charts for engagement, reach, likes, comments
- Post status tracking: Draft, Pending Approval, Approved, Scheduled, Published

### Modify
- None

### Remove
- Real AI integrations (not supported)
- Real social media API connections (not supported)
- Video generation (not supported)

## Implementation Plan
1. Backend: store posts with fields (id, idea, captions, status, platform, scheduledAt, hashtags, analytics)
2. Backend: CRUD for posts, update status, save selected caption and hashtags
3. Frontend: multi-step workflow (Idea → Captions → Creative → Approval → Optimize → Hashtags → Schedule)
4. Frontend: Dashboard with stats cards and recent posts
5. Frontend: Content Calendar view
6. Frontend: Analytics page with dummy chart data
