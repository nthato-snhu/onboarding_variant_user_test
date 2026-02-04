# AI Fundamentals Onboarding A/B Test

Test prototype comparing two onboarding prompt approaches.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
ANTHROPIC_API_KEY=your_key_here

3. Run locally:
```bash
npm run dev
```

4. Open http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy

## Structure

- **Version A (Connection)**: Warmth-first, builds emotional connection
- **Version B (Transparency)**: Clarity-first, explains purpose upfront
- Users experience both versions in random order
- All conversation data logged to console
