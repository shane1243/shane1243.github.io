# zhiqiangqin — Personal homepage

Website: https://shane1243.github.io/

A standalone, buildless static website. The complete HTML, CSS, JavaScript, fonts, background generator and third-party licenses are in `dist/`.

## Sections

- Home / About: personal introduction, Now updates and contact links.
- Research: `/research/`, including the clearly labeled simulated time-series example.
- Notes: `/notes/`, currently with no published notes.

Chinese/English switching and light/dark preferences are saved in the browser. The animated background respects reduced-motion preferences.

## Preview locally

```sh
cd /Users/shane/Documents/personal-homepage
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173/. No package installation or build is required.

## Update and publish

Edit the files in `dist/`, commit and push to `main`. The GitHub Actions Pages workflow publishes only `dist/`; repository documentation and configuration are not included in the website artifact.

```sh
git add dist
git commit -m "Update homepage"
git push origin main
```

## Credits

Typography, motion and background adaptations reference Anthony Fu’s website (MIT). The corresponding license is in `dist/vendor/antfu.LICENSE`. Simplex-noise and the Inter font retain their original license files in `dist/vendor/` and `dist/assets/fonts/`.
