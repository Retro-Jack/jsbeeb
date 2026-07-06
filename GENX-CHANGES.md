# GenX-DOS changes to this jsbeeb fork

This is a fork of Matt Godbolt's [jsbeeb](https://github.com/mattgodbolt/jsbeeb)
(GPL-3.0-or-later), maintained for the **GenX-DOS** project
(<https://github.com/Retro-Jack/GenX-DOS>). It exists so that any modification we
need to make to jsbeeb lives here as **readable, rebuildable source** rather than
as an ad-hoc edit to a shipped build.

Forked from upstream at commit `7a2f543` (July 2026).

---

## Change 1 — d-pad gamepad remapping

**File:** `src/gamepads.js`, in `GamePad.remap()`.

**What.** Four new remap keys — `D12`, `D13`, `D14`, `D15` — that map the
gamepad's **d-pad buttons** (the standard Gamepad-API button indices for up /
down / left / right) to any BBC key.

**Why.** jsbeeb already lets you remap the analogue stick, the face buttons and
the shoulders from the launch URL (`GP.LEFT`, `GP.A`, `GP.FIRE`, …). But the four
d-pad buttons are hardwired in the `GamePad` constructor to the standard BBC
steering keys (`Z` / `X` / `:` / `/` — the "snapper" scheme) and the `remap()`
switch has **no case** for button indices 12-15. That's fine for a standard game
like Snapper, but a digital game with different keys — Chuckie Egg uses `,` `.`
`A` `Z` plus Space — could not get correct d-pad movement. These four additive
cases fix that; nothing existing is altered.

**How GenX-DOS uses it.** The game's launcher URL passes the mapping, e.g. for
Chuckie Egg:

```
?disc1=AnF/ChuckieEgg.ssd&autoboot&GP.FIRE=SPACE&GP.D12=A&GP.D13=Z&GP.D14=COMMA&GP.D15=PERIOD
```

`GP.FIRE=SPACE` puts jump on every button first; the four `GP.D…` params then
override the d-pad back to movement. For a purely digital game the analogue
stick is left unmapped — the d-pad _is_ the joystick. Games that genuinely want
the analogue stick (Elite) keep the stick mapping instead.

---

## Change 2 — monitor vertical inset (GenX-DOS-local, **not** upstreamed)

**File:** `src/main.js`, `bottomReservedSize` in the CUB-monitor resize block.

**What.** Widened the reserved vertical space from `68` to `120` pixels.

**Why.** GenX-DOS paints a sitewide wallpaper behind the emulator and wants the
CUB monitor to sit with breathing room above and below rather than filling the
viewport edge-to-edge. This is purely our layout preference, so — unlike the
d-pad remap — it is **not** offered upstream. It lives only on this fork's build
branch (`main`); the upstream-PR branch (`gamepad-dpad-remap`) does not carry it.

---

## Branch layout

- **`gamepad-dpad-remap`** — the d-pad remap (Change 1) alone, clean on top of
  upstream, intended as an upstream pull request.
- **`main`** — our build/vendor branch: upstream + Change 1 + Change 2 (and any
  future GenX-local tweaks). **This is the branch we build and vendor from.**

---

## Rebuilding and re-vendoring into GenX-DOS

```
npm install
npm run build      # vite build → ./dist
```

Then copy the built engine assets from `dist/` into the site's two BBC bundles
(`systems/bbcmicro/` and `systems/bbcmaster/`), **preserving each bundle's
GenX-DOS customisations**: the CSP + mobile-block `index.html`, the per-bundle
curated `discs/` / `roms/` / `tapes/`, the favicon, and `genx-gamedoc-link.js`.
The two bundles carry the identical engine build — keep them in sync (`md5sum`).
