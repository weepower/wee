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