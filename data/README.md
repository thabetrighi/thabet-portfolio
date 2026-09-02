# Data directory

Structured content managed by the site and the `/admin` panel.

```
data/
├── config/
│   ├── site.json      # Name, email, logo, URL
│   └── social.json    # Social profile links
└── profile/
    ├── en.json        # Experience, skills, about, resume (English)
    ├── ar.json        # Arabic profile data
    └── fr.json        # French profile data
```

Articles and projects remain in `content/articles/` and `content/projects/` as Markdown.

The admin panel commits changes to GitHub; CI rebuilds and deploys the site.
