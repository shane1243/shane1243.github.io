# zhiqiangqin — Personal homepage

Website: https://shane1243.github.io/

A standalone, buildless static website. The complete HTML, CSS, JavaScript, fonts, background generator and third-party licenses are in `dist/`.

## Sections

- Home: personal introduction, research interests and contact links.
- Writing: `/writing/`, for perspectives, lessons learned and long-form essays. Includes the Chinese essay 《关于幸福的一点想法》 at `/writing/on-happiness/`.

Chinese/English switching and light/dark preferences are saved in the browser. The animated background respects reduced-motion preferences.
Article titles and text retain their original language when the interface language changes.

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

The illustration in the happiness essay was generated for this site with OpenAI imagegen.
