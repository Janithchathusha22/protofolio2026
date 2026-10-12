# Janith Chathusha — loading intro only

A five-second cinematic overlay for your existing website. It does not contain or redesign a home page. At the end, a brighter silver-white bloom fades away and your existing page is revealed. No route change is required.

## Personal text

- Name: **Janith Chathusha** — no JC logo.
- **Driven by curiosity.**
- **Learning. Building. Becoming.**
- **Turning ideas into possibilities.**

These express a learning and software-building journey without inventing biographical details. Edit the strings passed to `mountJanithIntro` to change them. The original reference image has its own baked-in decorative lettering; this package preserves that supplied artwork. Replacing those pixels requires editing the image separately.

## Preview immediately

Extract the ZIP, then open `demo.html` in a modern desktop or mobile browser. This file embeds the image and script, so it works offline. Its simple completion message is only a test surface, not your portfolio design. The Replay button runs the sequence again.

## Next.js / React integration

1. Copy `janith-intro.mjs` and `JanithIntro.jsx` into the same components folder, for example `src/components/intro/`.
2. Copy `assets/valley.jpg` into `public/intro/valley.jpg`.
3. Place the component alongside the home page you already have. Leave all existing homepage markup and styles intact.

```jsx
import JanithIntro from '@/components/intro/JanithIntro';

export default function Home() {
  return (
    <>
      <JanithIntro />
      {/* Keep your EXISTING home page here, unchanged. */}
    </>
  );
}
```

Use your project's actual import path if it does not use the `@/` alias. The provided `.jsx` component runs only on the client and returns no home-page markup. In Next.js, your page itself can remain a server component. Development Strict Mode cleanup cancels the first mount without marking the intro as watched.

For repeated development previews:

```jsx
<JanithIntro oncePerSession={false} />
```

Restore the default for normal visitors. If the image is served under a deployment subpath, pass the correct URL through `imageUrl`.

## Plain HTML / JavaScript

Copy the `janith-intro.mjs` and `assets` folder together into your website's `intro` folder. Add this before your existing closing `</body>` tag:

```html
<script type="module">
  import { mountJanithIntro } from './intro/janith-intro.mjs';

  const intro = mountJanithIntro({
    imageUrl: './intro/assets/valley.jpg',
    oncePerSession: true,
  });

  // Optional: await intro.finished, intro.skip(), or intro.destroy().
</script>
```

Serve your real project over HTTP, using its normal development server. ES module imports may be blocked on `file://`; only the self-contained demo is intended for double-click opening.

## Behaviour and options

The countdown begins after the image loads. At 5 seconds, the next available animation frame closes and removes the overlay. As with any browser animation, a busy/backgrounded browser can delay a frame; this is not a hard real-time timer. If the tab becomes visible after the deadline, the intro closes immediately.

- First 0.7 s: valley and celestial light appear.
- 0.7–3.5 s: the star descends and merges with the distant person's chest.
- 3.5–4.4 s: stronger gradual chest bloom and water ripple.
- 4.4–5.0 s: light fades to reveal your existing page.

The native modal dialog blocks interaction with the page only while the intro is visible. It supports Skip and Escape, restores scroll and focus, honors reduced motion, and removes its animation loop and listeners on completion. The styles live in a shadow root to avoid changing your homepage styles. No third-party packages, fonts, network APIs, or generated homepage are included.

`oncePerSession` uses sessionStorage for the current tab. If browser storage is disabled, playback still works but cannot remember that it already ran. Reduced-motion visitors see their page immediately. Missing or broken images reveal the page automatically; an unresolved image request times out after 8 seconds.

`onComplete(reason)` is optional. Reasons include `completed`, `skipped`, `already-seen`, `reduced-motion`, `asset-error`, `asset-timeout`, `canvas-unavailable`, and `dialog-unavailable`. `destroy()` resolves the `finished` promise with `cancelled` without invoking `onComplete` or marking playback as seen. Use destroy during component unmount. Mount one component per page.

To run a framework-specific navigation after the intro, call your router in `onComplete`. The default simply reveals the home page already loaded underneath, which avoids a second page load. Do not redirect to the same page from that callback.

## Artwork and visual limits

The supplied 736 × 1104 JPEG is included unchanged. Chest alignment is anchored to image coordinates `(368, 654)` and uses the same transform as the image at every screen size. A different composition needs a new chest coordinate. This is a 2.5D image animation: mountains, mist, and the original printed text are flat artwork, with animated light, reflections, zoom, and bloom layered above.

## Validation

JavaScript syntax and deterministic runtime checks cover the 5-second timeline, overlay removal, cleanup, Skip, replay by remounting, reduced motion, session memory, image failures, timeout, and React-style mount/cancel/remount. Live browser visual verification was unavailable in the build environment. Open the included demo, then check the integration on your actual project and phone before publishing.
