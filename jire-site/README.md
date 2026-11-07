# jire_ai website

One page with three jobs: proof of work, a "Hire me" request form, and the Brand Builders class waitlist.

- `page.html`: the page source (also used for the claude.ai preview).
- `build.sh`: wraps it into `site/index.html` for hosting.
- `site/`: the finished website (index.html + media/). `jire-ai-site.zip` is the same folder zipped.

## Put it online (free, about 5 minutes)

1. Go to https://app.netlify.com/drop and create a free account.
2. Unzip `jire-ai-site.zip` and drag the folder onto that page. You get a link like `something.netlify.app`.
3. In Netlify: Site configuration → Change site name → `jire-ai` (if free) for `jire-ai.netlify.app`.
4. Forms: Netlify finds the two forms automatically. Submissions appear under **Forms** in your site's dashboard.
   Turn on email alerts: Site configuration → Notifications → Emails and webhooks → Form submission notifications.

## Still to add
- Profile picture: save as `site/media/profile.jpg` and replace the "J" avatar.
- Social links in the footer.
- A real testimonial when you have one.
