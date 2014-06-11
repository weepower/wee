# 2.0.0

2014-06-09

- MAJOR: Overhaul of the JavaScript structure and functionality
- MAJOR: Major cleanup of the LESS library and addition of over two dozen new mixins
- MAJOR: The custom variables.less file is now empty and intended only to host core overrides and custom variables
- MAJOR: The Grunt build files are now included as part of Wee by default
- FIXED: Renamed "fonts" folder to "font" for consistency with variables.less
- FIXED: Resolved external path issues in index.local.html
- FIXED: Fixed issue with .background(dark) and .background(light) mixins
- FIXED: Added missing comma in the .clear mixin
- FIXED: Resolved transition with backface visibility hack
- ADDED: Added skew(x; @x) and skew(y: @y) mixins
- ADDED: Added new fallback data attribute option for SVG images
- ADDED: Added new .background-image mixin option for @filename, @repeat
- ADDED: Added a new variable @responsivePath in legacy.less and screen.less for advanced usage
- ADDED: Added new defaultDuration and defaultOpacity variables to variables.less
- ADDED: Added new .border-color() mixin options
- ADDED: Created new .min-size and .max-size mixins
- ADDED: Created new .caret mixin
- ADDED: Added back OpenGraph description for proper social shareability
- ADDED: Added new prefix, suffix, and bookends mixins for pseudo content placement
- ADDED: Added new position, absolute, and fixed overrides for position values
- ADDED: Added new ratio mixins, useful for responsive media embeds
- ADDED: Added new .floated-list mixin and overrides for .inline-list
- ADDED: Created new variables-static.less file in the core for helper variables
- UPDATED: Many mixins can now accept false for values to supress output of a particular dimension
- UPDATED: Added row-modify mixin and optional margin to column-modify for modifying spacing
- UPDATED: Removed jQuery from the default fileset
- UPDATED: The .mobile-nav mixin can now take a height override value
- UPDATED: Removed less.js from the lib directory
- UPDATED: Went ahead and removed the crossdomain.xml file
- UPDATED: Adjusted .gitignore to ignore additional files
- UPDATED: Updated .jshintrc doc for more strict default jshinting
- UPDATED: Configured .htaccess rewrites for specific domain rather than catchall
- UPDATED: Made improvements to legacy handling
- UPDATED: Simplified sample index to be complemented by separately downloadable examples
- UPDATED: Removed responsive nav code from base.js
- UPDATED: Added .heading class and renamed .subheader to .subheading
- UPDATED: Removed holder.js reference and files from the lib directory
- UPDATED: Responsive test mode now shows the JavaScript size value in parentheses
- UPDATED: Responsive test mode now offers the ability to click on breakspoints and resize the viewport
- UPDATED: Updated the default responsive test mode style values to blend better with the browser window

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