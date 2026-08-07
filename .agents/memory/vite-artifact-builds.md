---
name: Vite artifact build defaults
description: Environment behavior needed when building workspace artifacts outside managed workflows.
---

Vite artifact configs require `PORT` and `BASE_PATH` for both development and builds, while managed workflows inject them automatically.

**Why:** Running the root workspace build directly otherwise reports a false failure even though the managed preview and production artifact configuration are valid.

**How to apply:** Keep standalone `build` scripts self-contained with defaults matching each artifact's managed service path and port; workflows can still override them.