# 1.0.0

2013-10-02

- UPDATED: Stable version 1 release

# 0.4.1

2013-08-16

- UPDATED: Tweaked htaccess for better charset handling and other issues
- UPDATED: Grid now is based on negative letter spacing vs negative margin for better consistency
- ADDED: Added new rootFontSize variable

# 0.4.0

2013-07-30

- FIXED: Removed media queries from the custom.less example file
- UPDATED: Replaced a few rules in custom.less and responsive files with mixins
- UPDATED: Combined two ie.less rules
- UPDATED: Upgraded jQuery to 1.10.2
- UPDATED: Upgraded LESS to 1.4.2
- UPDATED: Removed unnecessary mobilePortrait.less file
- UPDATED: Updated default IE8 breakpoint to "4" (1024px)
- UPDATED: Set hide and show classes to be !important
- ADDED: Added IE10 Metro compatability to responsive.less
- ADDED: Added more comments and updated comment style in reponsive, variable and screen less files
- ADDED: Added @gridColumns variable for defining default number of grid columns
- ADDED: Added transition delay and transition duration mixins
- ADDED: Added generic background mixin
- ADDED: Added background attachment and position mixins
- ADDED: Added transform-origin mixin
- ADDED: Added translate overload mixin to take third parameter for z-index 3d translates
- ADDED: Added absolute, fixed and relative mxins for positioning
- ADDED: Added align-middle mixin to set vertical-align: middle
- ADDED: Added column-offset mixin for positioning columns

# 0.3.0

2013-07-16

- FIXED: Resolved issues with margin and padding overloaded mixins in certain scenarios
- FIXED: Removed oveflow hidden on labels which was causing some problems
- UPDATED: Split out variables.less into its own file for improved upgradability
- UPDATED: Split out custom.less for project customization
- UDPATED: Split out responsive.less so non-responsive sites and more easily exlude it
- UPDATED: Updated screen.less to serve as an aggregator of other less files
- UPDATED: Made slight adjustments in logic to beter utilize LESS 1.4
- UDPATED: Removed canonical meta tag and tracking code comment in index.html
- UPDATED: Replaced some inline tags in wee.less with internal mixin references
- UPDATED: Removed list font size
- ADDED: Added min-height and height of 100% to body and html
- ADDED: Added align-bottom and align-top classes

# 0.2.0

2013-07-02

- FIXED: Updated navCheck JavaScript function to be a self-invoking anonymous function
- FIXED: Replaced all commas in mixin parameter lists with semicolons
- UPDATED: Updated htaccess to reference assets subdomain instead of cdn
- UPDATED: Updated mobile browser size check in JavaScript to search for exact match ===
- UPDATED: Wraped html element font elements for responsive detection in double quotes for processors that strip them
- UPDATED: Updated jQuery to 1.10.1
- UPDATED: Minor cosmetic changes to the base index html
- UPDATED: Split out variables.less for easier maintenance and user friendliness
- UPDATED: Set rounded mixin default to 3px
- UPDATED: Row mixin can now be used as a class
- UPDATED: Updated references of .margin(bottom; @blockMarginBottom) to .spaced
- ADDED: Added minified version of base script, holder, and html5shiv
- ADDED: Added basic figure example to base index html
- ADDED: Added radio class to Wee and reference in base index html
- ADDED: Added italic mixin
- ADDED: Added a number of default HTML5 objects to Wee with base styline
- ADDED: Added new table-bordered and table-striped classes
- ADDED: Added new variables for styling of disabled form elements

>>>>>>> Stashed changes
# 0.1.7

2013-05-29

- UPDATED: Rearranged some of the variable order to make more sense
- UPDATED: Extended the examples in the index.html with better lists and new address and description list elements
- ADDED: Added empty canonical URL meta tag as example
- ADDED: Added new variables for more flexible description list control
- ADDED: Added a quote border width variable
- ADDED: Added address control base styling with variables to match
- ADDED: Added a disabled button cursor variable

# 0.1.6

2013-05-22

- FIXED: Adjusted math to more accurately size spaced columns
- UPDATED: Replaced a few example LESS rules with mixins
- ADDED: Added rel="home" to home link

# 0.1.5

2013-05-20

- FIXED: Resolved issue with overflow on grid columns
- UPDATED: Removed IE hacks from main wee.less and added them to ie.less
- UPDATED: Updated formFontFamily and formFontSize to inputFontFamily and inputFontSize
- ADDED: Added @placeholderColor variable for input placeholders
- ADDED: Added @InputColor variable for input text color

# 0.1.4

2013-05-19

- FIXED: Resolved issue where margin was being applied to closed columns
- UPDATED: Removed closed keyword from closed col mixin
- UPDATED: Renamed col mixin to column and column to grid
- UPDATED: Renamed grey variable names to gray

# 0.1.3

2013-05-18

- FIXED: Resolved issue with x/y being reversed in .margin (@y; @x) mixin
- UPDATED: Updated nav links to be inline-block vs inline
- ADDED: Added .margin (horizontal, @x) and .margin (vertical, @x) with padding equivalents

# 0.1.2

2013-05-17

- FIXED: Updated header tags to use predefined variable

# 0.1.1

2013-05-17

- FIXED: Resolved issue with min-width mixin not referencing the correct parameter
- UPDATED: Updated various #fff references to @white
- ADDED: Added inputBackground variable to control input background 

# 0.1.0

2013-05-16

- ADDED: Initial beta commit