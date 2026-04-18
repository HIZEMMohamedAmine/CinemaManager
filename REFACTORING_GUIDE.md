# CINEMAX Unified Interface Refactoring Guide

## Overview
This document describes the refactoring of the CineMax cinema project to create a unified, synchronized interface across all pages. The system ensures consistent navigation, styling, and spacing throughout the application.

---

## 1. Master Navbar Component (`frontend/components/navbar.html`)

### Purpose
A reusable navbar component that can be included in all pages using absolute paths. This ensures consistent navigation and UI across the entire application.

### Key Features
- **Absolute Paths**: All links use absolute paths starting with `/`
  - Example: `/user-interface/frontend/movies/movies.html`
  - This ensures the navbar works identically in root folders and subfolders
  
- **Data Navigation Attributes**: Each nav link has a `data-nav` attribute
  - `data-nav="home"` for home page
  - `data-nav="movies"` for movies page
  - `data-nav="showtimes"` for showtimes page
  
- **Unified Search Bar**: Fixed height (44px) with glassmorphism backdrop-blur
  - Consistent styling across all pages
  - Responsive: hidden on mobile, visible on desktop (lg breakpoint)
  
- **Profile Dropdown**: Accessible user menu with logout functionality
  - Smooth hover animations
  - Accessible from tablet size and up

### File Location
```
frontend/components/navbar.html
```

### Usage in HTML
```html
<nav class="navbar-main">
  <!-- Full navbar markup with absolute paths -->
</nav>
```

---

## 2. Navigation Sync Utility (`frontend/components/nav-sync.js`)

### Purpose
Automatically highlights the current page in the navigation without manual HTML editing. The script:
1. Reads `window.location.pathname`
2. Matches it against known routes
3. Adds the `active` class to the correct nav link
4. Adds the teal underline animation

### Key Features
- **Automatic Active State**: Detects current page and highlights appropriately
  - Home: highlights on `/index/`
  - Movies: highlights on `/movies/` OR `/movie-details/` OR `/booking/`
  - Showtimes: highlights on `/showtimes/`

- **Dynamic Routing**: Handles various page types
  - `/movies/movies.html` → highlight Movies
  - `/movie-details/movie-details.html` → highlight Movies (child page)
  - `/booking/booking.html` → highlight Movies (booking is part of movies flow)

- **Console Logging**: Debug information shows which page is detected
  ```
  [NavSync] Current path: /user-interface/frontend/movies/movies.html | Active: movies
  ```

### File Location
```
frontend/components/nav-sync.js
```

### Implementation
```javascript
class NavSync {
  // Automatically syncs on page load and history change
  // No manual configuration needed
}

// Initialize: just include in script tag
<script src="/user-interface/frontend/components/nav-sync.js"></script>
```

---

## 3. Global Layout & Spacing System (`frontend/css/global.css`)

### Content Container Class
```css
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg); /* 2rem padding on sides */
  width: 100%;
}
```
**Purpose**: Ensures all content has:
- Maximum width of 1200px (prevents stretching on ultra-wide screens)
- Automatic centering with margin auto
- Consistent horizontal padding
- No horizontal jumps when switching pages

### Section Padding Classes
```css
.section-padding     /* 5rem (80px) padding top/bottom */
.section-padding-lg  /* 8rem (128px) padding - for hero sections */
.section-padding-sm  /* 3rem (48px) padding - for smaller sections */
```
**Purpose**: Provides standard vertical spacing between sections

### Grid Container Classes
```css
.grid-auto-4  /* Auto-fill grid, 250px min width (4 columns on desktop) */
.grid-auto-3  /* Auto-fill grid, 300px min width (3 columns on desktop) */
.grid-2       /* Fixed 2 columns */
.grid-3       /* Fixed 3 columns */
.grid-4       /* Fixed 4 columns */
```

### Navbar Offset Class
```css
.navbar-offset {
  margin-top: 70px; /* Accounts for fixed navbar height */
}
```
**Applied to**: First content section (hero) to prevent overlap with fixed navbar

### Page Layout Classes
```css
.page-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-content {
  flex: 1; /* Takes remaining space, pushes footer to bottom */
}
```

---

## 4. Unified Search Bar Styling

### Specifications
- **Height**: 44px (fixed across all pages)
- **Background**: `rgba(13, 18, 40, 0.4)` with `backdrop-filter: blur(12px)`
- **Border**: 1px solid `rgba(0, 217, 255, 0.12)`
- **Border Radius**: 14px
- **Responsive Behavior**:
  - Hidden on devices < 1024px width
  - Visible and fully functional on desktop

### Interactive States
**Default State**:
```css
.search-wrapper {
  background: rgba(13, 18, 40, 0.4);
  border: 1px solid rgba(0, 217, 255, 0.12);
}
```

**Focus State** (when user clicks):
```css
.search-wrapper:focus-within {
  border-color: rgba(0, 217, 255, 0.4);
  background: rgba(13, 18, 40, 0.6);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.15);
}
```

**Input Expansion**: Search input expands from 160px to 192px on focus

---

## 5. CSS Architecture

### Color System (CSS Variables)
```css
--charcoal: #0a0e27        /* Primary dark background */
--dark-gray: #1a1f3a       /* Secondary dark background */
--accent-blue: #00d9ff     /* Primary interactive color */
--accent-purple: #a855f7   /* Secondary interactive color */
```

### Spacing System
```css
--spacing-xs: 0.5rem
--spacing-sm: 1rem
--spacing-md: 1.5rem
--spacing-lg: 2rem
--spacing-xl: 3rem
--spacing-xxl: 4rem
```

### Transitions (Smooth animations)
```css
--transition-smooth: 0.35s cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 6. Absolute Path Implementation

### Why Absolute Paths?
- **Consistency**: Links work the same in root and nested folders
- **Reliability**: No relative path confusion (../, ../..)
- **Maintainability**: Easy to update all links from one file

### Path Structure
```
/user-interface/frontend/index/index.html
/user-interface/frontend/movies/movies.html
/user-interface/frontend/showtimes/showtimes.html
/user-interface/frontend/movie-details/movie-details.html
/user-interface/frontend/booking/booking.html
/user-interface/frontend/components/navbar/navbar.css
/user-interface/frontend/components/nav-sync.js
```

### Example Usage
```html
<!-- Logo link (works from any folder) -->
<a href="/user-interface/frontend/index/index.html">CINEMAX</a>

<!-- CSS files -->
<link rel="stylesheet" href="/user-interface/frontend/css/global.css">

<!-- JavaScript -->
<script src="/user-interface/frontend/components/nav-sync.js"></script>
```

---

## 7. Page Layout Structure

All pages follow this standardized structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta tags & title -->
  <title>CineMax — Page Title</title>
  
  <!-- Stylesheets with absolute paths -->
  <link rel="stylesheet" href="/user-interface/frontend/css/global.css">
  <link rel="stylesheet" href="/user-interface/frontend/components/navbar/navbar.css">
  <!-- Page-specific CSS -->
</head>
<body class="page-layout">
  <!-- 1. Navbar (fixed at top) -->
  <nav class="navbar-main">
    <!-- Navbar content with absolute paths -->
  </nav>
  
  <!-- 2. Page Content (flexes to fill space) -->
  <div class="page-content navbar-offset">
    
    <!-- 3. Hero/Intro Section -->
    <section class="hero-section navbar-offset content-container">
      <!-- Hero content with content-container class -->
    </section>
    
    <!-- 4. Main Sections -->
    <section class="section-main section-padding">
      <div class="content-container">
        <!-- Grid layout with consistent spacing -->
      </div>
    </section>
    
  </div><!-- Close page-content -->
  
  <!-- 5. Navigation Sync Script -->
  <script src="/user-interface/frontend/components/nav-sync.js"></script>
  
  <!-- 6. Page-Specific Scripts -->
  <script src="/user-interface/frontend/[page]/[page].js"></script>
</body>
</html>
```

---

## 8. Implementation Checklist

### For Existing Pages
- [ ] Update all CSS links to use absolute paths
- [ ] Update all navigation links to use absolute paths
- [ ] Replace local navbar with master navbar component
- [ ] Add `page-layout` class to body
- [ ] Add `page-content` wrapper div
- [ ] Add `navbar-offset` to first content section
- [ ] Wrap sections with `content-container` class
- [ ] Add `section-padding` class to major sections
- [ ] Include nav-sync.js script before closing body
- [ ] Test navigation highlighting on all pages

### For New Pages
- [ ] Copy structure from template above
- [ ] Use absolute paths for all resources
- [ ] Include navbar component with data-nav attributes
- [ ] Apply consistent spacing classes
- [ ] Test active nav state

---

## 9. Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 768px
- **Desktop**: 1024px
- **Large Desktop**: 1280px

### Navbar Responsiveness
- Search bar: Hidden < 1024px
- Profile dropdown: Hidden < 768px
- Hamburger menu: Visible < 768px

### Content Container Responsiveness
- Padding adjusts based on viewport
- Grid columns adjust via auto-fill
- Max-width maintained at 1200px

---

## 10. Testing Guide

### Navigation Sync Testing
1. Open home page → should highlight "Home"
2. Click "Movies" → should navigate and highlight "Movies"
3. Go to movie details → should still highlight "Movies"
4. Go to booking → should still highlight "Movies"
5. Go back to home → should highlight "Home"

### Spacing Consistency Testing
1. Check all pages have same navbar height (70px)
2. Verify content doesn't jump horizontally
3. Confirm section spacing is consistent (80px gaps)
4. Test on mobile, tablet, and desktop
5. Verify search bar height is 44px across pages

### Search Bar Testing
1. Focus on search input (should expand and glow)
2. Type something (text should appear)
3. Press Enter → should navigate to movies with search param
4. Verify styling is identical on all pages
5. Test on desktop (visible) and mobile (hidden)

---

## 11. Future Enhancements

- [ ] Add mobile hamburger menu toggle functionality
- [ ] Implement search results page
- [ ] Add breadcrumb navigation
- [ ] Create responsive sidebar for filters
- [ ] Add scroll spy for long pages
- [ ] Implement dark/light theme toggle
- [ ] Add accessibility improvements (ARIA labels)
- [ ] Create reusable component library

---

## 12. File Structure Reference

```
frontend/
├── components/
│   ├── navbar/
│   │   ├── navbar.html      (Component markup)
│   │   └── navbar.css       (Navbar styles)
│   ├── navbar.html          (Master navbar - reusable)
│   ├── nav-sync.js          (Auto-sync script)
│   └── footer/
├── css/
│   ├── global.css           (Layout + spacing classes)
│   └── [page].css
├── index/
│   ├── index.html           (Uses master navbar)
│   ├── index.css
│   └── index.js
├── movies/
│   ├── movies.html          (Uses master navbar)
│   ├── movies.css
│   └── movies.js
├── showtimes/
│   ├── showtimes.html       (Uses master navbar)
│   ├── showtimes.css
│   └── showtimes.js
└── [other-pages]/
```

---

## 13. Quick Start for New Pages

To create a new page with unified interface:

1. **Copy this template**:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>CineMax — New Page</title>
     <link rel="stylesheet" href="/user-interface/frontend/css/global.css">
     <link rel="stylesheet" href="/user-interface/frontend/components/navbar/navbar.css">
     <link rel="stylesheet" href="/user-interface/frontend/[page]/[page].css">
   </head>
   <body class="page-layout">
     <nav class="navbar-main">
       <!-- Copy navbar.html content here -->
     </nav>
     
     <div class="page-content navbar-offset">
       <!-- Page content here -->
     </div>
     
     <script src="/user-interface/frontend/components/nav-sync.js"></script>
     <script src="/user-interface/frontend/[page]/[page].js"></script>
   </body>
   </html>
   ```

2. **Update the data-nav attribute** in navbar for correct highlighting
3. **Use content-container** wrapper for all content
4. **Apply section-padding** to major sections
5. **Use grid classes** for cards and galleries

---

## Support

For questions or issues:
1. Check console for [NavSync] messages
2. Verify absolute paths start with `/user-interface/`
3. Ensure CSS links use absolute paths
4. Test on different device sizes
