# 2.0.5

2014-10-01

- FIXED: Resolve issue with the array format of $setVars
- FIXED: Resolve issue with passing a negative value to $eq from a chained function
- FIXED: Resolve issue with passing specific URL to $envSecure
- FIXED: Resolve issue with scope variable calling private replace function
- FIXED: Fix $('.element').parse() to render all matched elements if there is more than one
- UPDATED: Move Wee.$eq() to wee.js from wee.dom.js to deduplicate logic
- UPDATED: Replace commas with semicolons in screen.less sample code
- UPDATED: Reset all Wee polyfills with their own semantic versioning
- UPDATED: Add trailing semicolons to unload and onerror asset variables
- UPDATED: Add filter parameter to next() and previous() methods
- UPDATED: Add remove argument to $before() function to match $after()
- UPDATED: Simplify logic for $text()
- UPDATED: Add ability to pass filter selector and options to $next() and $prev()
- UPDATED: Update $toggleClass to use native forEach instead of $each

# 2.0.4

2014-09-29

- FIXED: Resolve issue with argument splicing on mouseenter/leave events
- UPDATED: Remove undocumented element template parsing
- UPDATED: Move anchor styling in sample CSS to correct position within footer class
- UPDATED: Update qUnit to 1.15.0 and resolve test file paths

# 2.0.3

2014-09-27

- FIXED: Resolve issue where delegate didn't validate past the direct parent element
- FIXED: Resolve issue with Wee.$('.class.class') selectors
- UPDATED: Modify $exec to assume the init function if no function is supplied in "wee:fn" format
- UPDATED: Add JetBrains IDE storage folder pattern to .gitignore

# 2.0.2

2014-09-25

- FIXED: Removed stray module script file reference from index.html
- FIXED: Resolve Gruntfile issue where custom module scripts are not compiled or watched
- UPDATED: Implement BEM-style class structure

# 2.0.1

2014-09-24

- FIXED: Resolve issue with module watch task configuration
- FIXED: Update core font-family mixin to accommodate fonts encapsulated in quotes
- FIXED: Allow style build directory to import raw CSS files
- UPDATED: Remove stray stylesheet reference in sample index.html
- UPDATED: Update browser-sync dependency to 1.5.2
- UPDATED: Update mixins with various tweaks and efficiencies

# 2.0.0

2014-09-19

- MAJOR: Complete rework of the Wee directory structure
- MAJOR: Overhaul of the JavaScript structure and functionality
- MAJOR: Major cleanup of the LESS library and addition of over two dozen new mixins
- MAJOR: Grunt is now included as part of Wee by default and required for building

# 1.1.4

2014-01-21

- FIXED: Resolved issue with columns wrapping occasionally in some versions of Chrome and Firefox
- ADDED: Added new options to variables.less for border width or disabled borders on inputs
- ADDED: Added final touches to the module loading files
- UPDATED: Full compliance with strictMath option

# 1.1.3

2014-01-13

- FIXED: Resolved problem with .right() mixin
- UPDATED: Updated LESS lib to 1.6.1
- UPDATED: Updated holder.js to 2.3
- UPDATED: Tweaked gitignore to exclude sourcemap .map files
- UPDATED: Removed unneeded comment in empty LESS files with fix in LESS 1.6.1

# 1.1.2

2014-01-09

- FIXED: .background(none); will now compile correctly
- ADDED: Added comment to empty responsive files to resolve LESS 1.6 compile issue
- ADDED: Added new baseColor, resize, and display mixins
- UPDATED: Slight cosmetic updates to the base index
- UPDATED: Updated LESS version in lib to 1.6.0

# 1.1.1

2013-12-22

- FIXED: Resolved issue with IE8- fallback font size setting
- FIXED: Fixed REM polyfill to support cross site CSS requests if the source server allows
- FIXED: Removed (reference) for responsive.less stylesheet to allow proper IE fallback
- ADDED: Added border-box rules to before and after elements
- ADDED: Added new block code variables to style <pre><code>code</code></pre> with the ability to disable styling output
- ADDED: Added the static mixin to static positioning

# 1.1.0

2013-12-18

- ADDED: Added dns-prefetch example to index files
- ADDED: Added new core css structure to eliminate upgrade conflicts
- ADDED: Added foundation for new module functionality
- ADDED: Added baseline print styling (optionally compiled) and new custom print LESS file
- ADDED: Added over a dozen new mixins and several new configuration variables
- UPDATED: The main included css file is now "style.css" and not "screen.css" to account for newly included print options
- UPDATED: Renamed ie files to legacy
- UPDATED: Removed px fallback units on all rem-based rules in lieu of a JavaScript polyfill to reduce bloat in modern browsers
- UPDATED: Updated legacy to utilize new LESS reference for reduced CSS output
- UPDATED: Updated core logic to utilize new LESS 1.5+ features
- UPDATED: html5shiv as well we rem and svg polyfills are now included in the new legacy JavaScript file and without jQuery dependency for early execution
- UPDATED: Removed svg fallback from base.js
- UPDATED: Updated many mixins with optional parameters to encompass multiple rules
- UPDATED: Cleaned up and consolidated example styling
- UPDATED: Embedded table images now are vertically aligned at the top of cells by default

# 1.0.7

2013-10-26

- ADDED: Added spaceless variable to optionally eliminate grid inline-block space hacks with ability to override when generating grids
- ADDED: Added sample grid to download

# 1.0.6

2013-10-21

- FIXED: Resolved issue with retina background image mixins
- ADDED: Added .editorconfig for recommended editor settings
- ADDED: Added additional parameters in variables.less to control the responsive test mode bar (color, background, border color, and position)

# 1.0.5

2013-10-14

- FIXED: Resolved issue with retina background image mixin
- ADDED: Added additional retina background mixin options
- ADDED: Added .fill(both) mixin to set both height and width to 100%
- UPDATED: Separated an index.local.html file from index.html to better represent relative paths and protocols by default
- UPDATED: Updated holder.js to 2.2

# 1.0.4

2013-10-07

- FIXED: Resolved order of operations issue with legacy.less IE-specific overrides

# 1.0.3

2013-10-06

- Iterated version number

# 1.0.2

2013-10-06

- ADDED: Added Bower compatibility
- UPDATED: Added additional files to .gitignore
- UPDATED: Optimized images with new Wee Grunt script

# 1.0.1

2013-10-04

- ADDED: Added WEE.svgFallback() to the base.js to allow for image.svg -> image.png swap when SVG isn't supported
- ADDED: Added .block-quote class for applying blockquote styling to a standard quote or other element
- UPDATED: Segmented styling for q and blockquote to allow for inline quotes by default
- UPDATED: Added z-index to responsive demo mode bar

# 1.0.0

2013-10-02

- UPDATED: Stable version 1 release