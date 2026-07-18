# Project Nova - Image Assets

## Folder Structure

```
public/images/
├── logo/
│   ├── project-nova-logo.svg        # Main Project Nova logo
│   ├── project-nova-logo.png        # PNG version
│   └── favicon.ico                  # Favicon
├── partners/
│   ├── ceylinco-life.svg
│   ├── baurs.svg
│   ├── emerald.svg
│   ├── readamaze.svg
│   ├── george-stuart-health.svg
│   ├── uber.svg
│   ├── flybeyond-ceylon.svg
│   ├── popeyes.svg
│   ├── glowmax.svg
│   └── sweet-ant.svg
└── committee/
    ├── niyoma-bodinie.jpg           # President
    ├── dinuki-masakorala.jpg        # VP Business Development
    ├── dinuka-wimalagunasekara.jpg  # VP Partnership Development
    ├── pahanma-kumarasiri.jpg       # VP Partnership Development
    ├── manaal-zainab.jpg            # VP Partnership Development
    └── tharsigan-gnanasekar.jpg     # VP Partnership Development
```

## Image Specifications

### Logo
- **project-nova-logo.svg**: Vector format, transparent background
- **project-nova-logo.png**: 512x512px, transparent background
- **favicon.ico**: 32x32px (already exists)

### Partner Logos
- **Format**: SVG preferred (scalable), PNG as fallback
- **Dimensions**: 200x200px minimum
- **Background**: Transparent
- **Naming**: kebab-case, lowercase

### Committee Photos
- **Format**: JPG or WebP
- **Dimensions**: 400x400px (1:1 aspect ratio)
- **Style**: Professional headshots, consistent lighting
- **Naming**: firstname-lastname.jpg

## Usage in Components

### Logo (Header, Footer)
```tsx
import Image from 'next/image';

<Image
  src="/images/logo/project-nova-logo.svg"
  alt="Project Nova"
  width={40}
  height={40}
/>
```

### Partner Logos (Partners.tsx)
```tsx
<Image
  src={`/images/partners/${partner.name.toLowerCase().replace(/\s+/g, '-')}.svg`}
  alt={partner.name}
  width={100}
  height={100}
  className="object-contain"
/>
```

### Committee Photos (Testimonials.tsx)
```tsx
<Image
  src={`/images/committee/${member.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
  alt={member.name}
  width={200}
  height={200}
  className="rounded-full object-cover"
/>
```

## Adding New Images

1. Place images in the appropriate folder
2. Follow naming conventions
3. Optimize images before adding (use tools like TinyPNG, SVGO)
4. Update component code to reference new images