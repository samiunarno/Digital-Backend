
# TODO - AI Project Builder (Google-vibe coding)

- [ ] Add backend endpoint: `POST /api/ai/project/generate` in `server/routes/ai.ts` (strict JSON `{ summary, files[] }`)
- [ ] Create frontend component `src/components/AIProjectBuilder.tsx` (prompt -> generate -> file tree + preview + download individual files)
- [ ] Wire route in `src/App.tsx`: `/project-builder`
- [ ] Verify build/typecheck + fix any TS/React issues
