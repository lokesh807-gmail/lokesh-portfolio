# Lokesh Kumar Talluri — Portfolio

A responsive, single-page portfolio built with HTML, CSS, and vanilla JavaScript. It has no build step, framework, or package dependencies and can be hosted on GitHub Pages.

## Run locally

On Windows, open PowerShell in the portfolio folder and run:

```powershell
cd D:\Portfilo
py -m http.server 8000
```

If the `py` launcher is unavailable, use `python -m http.server 8000` instead. Open [http://localhost:8000](http://localhost:8000) in your browser. Press **Ctrl+C** in PowerShell to stop the server. No dependencies or build step are needed.

## Configure recruiter inquiries

The contact form submits asynchronously to the configured [Formspree](https://formspree.io/) endpoint at `https://formspree.io/f/maeqvnjz`. Formspree handles delivery; the site does not send email directly.

In the Formspree dashboard, confirm that this form sends email notifications to `lokeshkumartalluri1212@gmail.com`, complete any recipient verification Formspree requires, and enable spam filtering/submission limits if available. The visitor email is submitted as the `email` field for replying; the visitor is not used as the sender. The endpoint ID in the form action is a public routing identifier, not a secret API key. Do not add account tokens or email credentials to this static site. Deploy the site over HTTPS; GitHub Pages provides HTTPS for published sites.

The form validates required name, company, and email fields in the browser, trims submitted text, limits field lengths, prevents double submissions, and includes a honeypot spam field. Formspree also validates and processes the submission; no contact data is written to this site's files or displayed publicly. Submission time is recorded by the provider when available.

The configured endpoint is ready to accept submissions once Formspree has verified the notification recipient. A successful browser response confirms Formspree accepted the submission, but does not guarantee email delivery. The optional LinkedIn button appears only after the service returns a successful response. LinkedIn remains a separate way to connect; the website does not send LinkedIn messages.

### Test the form

- For local UI checks, leave required fields empty or enter an invalid email and submit; the browser should block submission.
- Submit a real test inquiry from the locally served site. Confirm it arrives in the verified Gmail inbox (including spam/junk), check that the recruiter's email is available for replying, and reply to the test message. A browser-side success only confirms Formspree accepted the submission; it does not verify inbox delivery.
- Simulate a service failure using browser developer tools set to Offline or a mocked non-success response. The form should show an error, allow retry, and must not show the success state.
- Do not share Formspree account credentials or private tokens in the repository.

## Customize

- Edit the content, links, SEO metadata, and structured data in `index.html`.
- The hero uses `assets/images/Profile-transparent.png`, a transparent-background cutout made from the supplied corporate portrait. The original photo remains at `assets/images/Profile-corporate.png`; only the cutout transparency was edited. Replace the displayed image in `index.html` if you want to use another portrait.
- Adjust colors, layout, and responsive styles in `css/styles.css`. The glass theme uses `--bg`, `--glass`, and `--glass-strong` for its surfaces and `--green` (`#35f2a1`) for the main accent. Backdrop blur has a readable opaque fallback.
- Update the accessible mobile navigation, active-section highlighting, scroll reveals, portrait entrance, ambient particle canvas, pointer effects, scroll progress, back-to-top control, contact-form submission states, and automatically updated footer year in `js/main.js`. Pointer-driven effects are limited to fine-pointer desktop devices, and motion effects respect the visitor’s reduced-motion preference.
- Tune hover and entrance timing with `--motion-fast` and `--motion-enter` at the top of `css/styles.css`. To reduce particle activity, lower the `58` particle cap in `js/main.js`; to disable the added ambience and pointer effects entirely, remove the ambient canvas/grid/cursor elements from `index.html` and the corresponding enhancement block from `js/main.js`. Visitors can also disable motion in their operating-system accessibility settings.
- Replace `assets/og-preview.svg` with a personal social-sharing image if desired. The current preview contains only the supplied portfolio details.
- The resume button opens an email request; no resume file was provided. To offer a downloadable resume, add your own PDF under `assets/` and update the resume links in `index.html`.
- Projects are explicitly marked **Planned** and link to an email conversation rather than implying completed work or results. Update the status and add real project/demo repository links only after the projects are available.

## Deploy with GitHub Pages

1. Push this folder to a GitHub repository.
2. Open the repository’s **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the branch containing the site (commonly `main`) and the `/ (root)` folder, then save.
5. Wait for GitHub Pages to publish the site; the published URL will appear in the Pages settings.

All asset links are relative, so the site also works when hosted from a repository subpath.
