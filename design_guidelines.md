# Design Guidelines: همراه بازار (Hamrah Bazar)

## Design Approach

**Reference-Based Approach**: Drawing inspiration from successful marketplace platforms:
- **Primary Reference**: OLX/Dubizzle marketplace aesthetics - clean, trust-focused, content-dense
- **Secondary References**: Airbnb (card design), Divar (Persian marketplace UX patterns)
- **Key Principles**: Trust, clarity, easy scanning, mobile-first for emerging markets

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 200 85% 45% (Deep teal - trustworthy, professional)
- Primary Hover: 200 85% 35%
- Accent: 25 95% 53% (Warm orange for CTAs - energy, action)
- Background: 0 0% 98% (Off-white)
- Surface: 0 0% 100% (Pure white)
- Text Primary: 220 15% 20%
- Text Secondary: 220 10% 45%
- Border: 220 15% 85%

**Dark Mode:**
- Primary: 200 70% 50%
- Primary Hover: 200 70% 60%
- Accent: 25 90% 58%
- Background: 220 15% 12%
- Surface: 220 15% 16%
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 70%
- Border: 220 15% 25%

### B. Typography

**Font Families:**
- Farsi/Pashto: 'Vazirmatn', 'Tahoma', sans-serif
- English: 'Inter', 'system-ui', sans-serif

**Scale:**
- Hero: text-4xl (36px) md:text-5xl (48px)
- H1: text-3xl (30px) md:text-4xl (36px)
- H2: text-2xl (24px) md:text-3xl (30px)
- H3: text-xl (20px)
- Body: text-base (16px)
- Small: text-sm (14px)
- Tiny: text-xs (12px)

### C. Layout System

**Spacing Units**: Consistent use of 4, 6, 8, 12, 16, 24 (p-1, p-1.5, p-2, p-3, p-4, p-6)

**Containers:**
- Max width: max-w-7xl (1280px)
- Padding: px-4 md:px-6 lg:px-8
- Section spacing: py-8 md:py-12

**Grid System:**
- Categories: grid-cols-4 md:grid-cols-7 lg:grid-cols-14 (horizontal scroll on mobile)
- Listings: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- City cards: grid-cols-2 md:grid-cols-3 lg:grid-cols-5

### D. Component Library

**Fixed Header:**
- Height: h-16 (64px)
- Position: fixed top-0 w-full z-50
- Background: backdrop-blur-md with semi-transparent surface color
- Shadow: subtle shadow-md
- Contents: Logo (right/left based on RTL), Search bar (center), Auth buttons + Language switcher + Theme toggle
- Back button: appears on secondary pages, replaces logo position

**Navigation:**
- Categories: Circular icons with labels (80x80px on mobile, 100x100px on desktop)
- Icon style: Large emoji or Font Awesome solid icons
- Hover: scale(1.05) with smooth transition
- Active state: border-2 border-primary

**Search Bar:**
- Prominent in header and hero
- Includes: text input + category dropdown + city dropdown
- Border: 2px solid with rounded-xl
- Focus state: border-primary with ring

**Listing Cards:**
- Aspect ratio: 4:3 image
- Border: 1px border-border
- Hover: shadow-lg transform scale(1.02)
- Contents: Image, Title (font-semibold), Price (text-accent font-bold), Location + Time (text-secondary text-sm)
- Corner badge: Category icon (top-left)

**Category/City Circles:**
- Shape: Circular containers
- Size: w-20 h-20 md:w-24 md:h-24
- Icon size: text-3xl md:text-4xl
- Label: text-xs md:text-sm below icon
- Background: gradient from surface to slight primary tint
- Border: 2px border-border

**CTA Buttons:**
- Primary: bg-accent text-white rounded-lg px-6 py-3 font-semibold
- Secondary: bg-primary text-white rounded-lg px-6 py-3 font-semibold
- Outline: border-2 border-primary text-primary bg-transparent rounded-lg px-6 py-3 font-semibold

**Forms:**
- Input fields: border-2 border-border rounded-lg p-3 focus:border-primary
- Labels: text-sm font-medium mb-2
- Multi-step: Progress indicator at top showing step numbers
- Image upload: Drag-drop area with preview thumbnails

**Dashboard:**
- Sidebar navigation (desktop) or bottom tabs (mobile)
- Stats cards: Grid of 3-4 cards showing user metrics
- My Listings: Table/cards view toggle

### E. Animations

**Minimal, purposeful animations:**
- Page transitions: Subtle fade (200ms)
- Card hover: scale transform (300ms ease)
- Modal/Dialog: Slide up from bottom on mobile, fade center on desktop
- Loading: Skeleton screens matching content layout

## Specific Screens

**Home Page:**
- Fixed header (always visible)
- Search hero: Large search bar with category/city dropdowns, h-48 md:h-64
- Category circles: Horizontal scroll section with all 14 categories, at least 4 visible initially
- Featured cities: Grid of 10 cities with 4+ sample listings each
- Recent listings: Grid showing latest 20-30 ads
- Footer: Links, social, contact info

**Listing Detail:**
- Back button in header
- Image gallery: Main large image + thumbnail strip below
- Seller info card: Avatar, name, phone (click to reveal), member since
- Action buttons: Call, WhatsApp, Report
- Description: Full text with proper spacing
- Related listings: 4-6 similar items

**Post Ad Flow:**
- Multi-step form (3-4 steps)
- Step 1: Category + City selection
- Step 2: Title, Description, Price, Images (up to 8)
- Step 3: Contact info verification
- Step 4: Review + Publish
- Progress indicator at top

**Auth Pages:**
- Centered card on gradient background
- Phone input with country code (+93 default)
- 2FA: 6-digit code input with auto-focus
- No email required

## RTL/LTR Handling

- Use `dir` attribute on html element
- Tailwind RTL classes: use `rtl:` and `ltr:` prefixes
- Icons: Mirror directional icons (arrows, chevrons) in RTL
- Numbers: Keep Western numerals in all languages

## Images

**Hero Section**: Not applicable for marketplace home - focus on quick search access

**Listing Images:**
- User-generated content
- Required: At least 1 image per listing
- Format: 4:3 aspect ratio, max 2MB
- Placeholder: Generic category icon with soft gradient background

**Category Icons:**
- Use Font Awesome or similar icon library
- Large, clear, universally recognizable
- Examples: 🚗 (vehicles), 🏠 (real estate), 📱 (electronics)

**Trust Elements:**
- Verified badge icon for verified sellers
- Star ratings (future feature)
- Member since badge