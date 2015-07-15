[![Wee](https://www.weepower.com/share.png?v1)](https://www.weepower.com)

Wee is a lightweight front-end framework for logically building complex, responsive web projects.

[![Code Climate](https://codeclimate.com/github/weepower/wee/badges/gpa.svg)](https://codeclimate.com/github/weepower/wee)

## Features

Mobile-first CSS framework with reset, base, and Less mixin library < *4KB gzipped*

* **Central configuration** for style normalization
* **Feature toggling** to minimize overhead
* **Structured breakpoints** to keep responsive logic organized
* **Legacy rules** for IE8 compatibility
* **Print styling** to generate print-optimized pages

JavaScript toolset to build scalable, organized client-side codebase < *11KB gzipped*

* **Foundation** of utilities, helpers, and module structure
* **Chainable DOM** traversal and manipulation with familiar API
* **Routing library** to flexibly associate endpoints to actions
* **Event handling** to bind actions to elements
* **Data loading** for Ajax and JSON interaction
* **HTML5 history** helper to create highly dynamic experiences
* **Template rendering** to parse complex data structures
* **Data binding** to sync data sources to the DOM
* **Resource loading** for JavaScript, CSS, and images
* **Breakpoint watching** for efficient media query callbacks
* **Polyfill support** for HTML5, ES5, SVG, and input placeholders

JSON-configured Grunt process to compile, optimize, and minify your project

* **Built-in server** for static development
* **Live reloading** of assets and markup
* **Ghost mode** to mirror actions across multiple browsers
* **Static site generator** perfect for living style guides
* **Sourcemap output** to line match unminified JavaScript
* **Legacy build** to concatenate breakpoints and convert rem units
* **Validation** of JavaScript against JSCS and JSHint rules

Structured foundation of markup, icons, and supporting files

## Examples

Here are a few basic examples. There's much more so check out the [documentation](https://www.weepower.com/start).

##### Mixins [→](https://www.weepower.com/style/mixins)

Improved organization and readability using [Less](http://lesscss.org) along with Wee's powerful mixin library. 

```html
<nav class="nav">
	<button class="nav__button --bordered">Button</button>
</nav>
```

```less
@brandColor: #167da3;

.nav {
	&__button {
		.fill();
		.font(@headingFont; 1.2);
		.spaced(1);
		.uppercase();
		&:hover {
			.background(light; 5%; @brandColor);
		}
		&./--bordered {
			.border(@brandColor);
		}
	}
}
```

Becomes...

```css
.nav__button {
	width: 100%;
	font-family: Lato, sans-serif;
	font-size: 1.2rem;
	margin-bottom: 1rem;
	text-transform: uppercase;
}
.nav__button:hover {
	background-color: #167da3;
	background-color: rgba(255, 255, 255, .05);
}
.nav__button./--bordered {
	border: 1px solid #167da3;
}
```

##### DOM [→](https://www.weepower.com/style/chain)

Familiar chainable API and pre-cached [references](https://www.weepower.com/script/#selection) make DOM interaction easy.

```html
<button data-ref="element">Button</button>
```

```javascript
$('ref:element').addClass('--is-active').attr('aria-selected', 'true');
```

##### Controllers [→](https://www.weepower.com/style/core)

Controllers along with the automated build process create well-organized projects.

```javascript
Wee.fn.make('controllerName', {
	_construct: function() {
		this.publicVariable = 'Public Variable';
		this.init();
	},
	init: function() {
		this.$private.privateMethod('varName');
	}
}, {
	privateMethod: function(key) {
		return key;
	}
});
```

##### Routing [→](https://www.weepower.com/script/routes)

Create independence between markup and script using the powerful routing options. 

```javascript
Wee.routes.map({
	'$any': 'common', // Call the init method of the common controller
	'$root': 'home',
	'category': {
		'$root': 'controllerName:publicMethod',
		'$slug': {
			'$root': function() {
				console.log('Category index');
			},
			'$num': function(id) {
				console.log('Product ID is ' + id);
			}
		}
	}
});
```

##### Templating [→](https://www.weepower.com/script/view)

The template parser supports fallbacks, loops, functions, filters, helpers, partials, and more. It also powers the [static site generator](https://www.weepower.com/generator).

```javascript
var template = 'My name is {{firstName}}{{#lastName|notEmpty}} {{lastName}}{{/lastName}}',
	data = {
		firstName: 'John',
		lastName: 'Smith'
	};

Wee.view.render(template, data);
```

Becomes...

```javascript
"My name is John Smith"
```

##### Breakpoints [→](https://www.weepower.com/script/screen)

Seamlessly combine and trigger breakpoint logic based on configured project media queries.

```javascript
Wee.screen.map([
	{
		size: 1,
		callback: [
			'common:mobile', // Call the mobile method of the common controller
			'common:smallScreen'
		]
	},
	{
		min: 3,
		max: 4,
		watch: false,
		callback: 'common:mediumScreen'
	},
	{
		min: 5,
		args: [
			'varName'
		],
		callback: function(obj, val) {
			console.log(val); // varName
			console.log(obj);
		}
	}
]);
```

##### Events [→](https://www.weepower.com/script/events)

Create organized interaction on your page with the simple event API.

```javascript
Wee.events.on('ref:element', 'mouseenter', function(e, el) {
	// Click logic
	e.preventDefault();
}, {
	once: true
});
```

##### Requests [→](https://www.weepower.com/script/data)

You can submit any type of request with a number of callback options. 

```javascript
Wee.data.request({
	url: '/login',
	method: 'post',
	data: {
		username: 'user@weepower.com',
		password: 'pass123'
	},
	success: function(data) {
		// Success logic
	},
	failure: function(data) {
	   // Failure logic
	}
});
```

##### Asset Loading [→](https://www.weepower.com/style/assets)

Load what you need on demand to optimize page speed and preserve bandwidth.

```javascript
Wee.assets.load({
	root: 'https://cdn.weepower.com/assets/alert/',
	files: [
		'script.js',
		'style.css',
		'close.png'
	],
	success: function() {
		// Success logic
	},
	failure: function() {
		// Failure logic
	}
});
```

## Installation

Get started using one of these methods:

* [Download the latest release](https://github.com/weepower/wee/archive/master.zip) or
* Clone the repository from `git clone git://github.com/weepower/wee.git`

*Node.js 0.11.14+ and the Grunt CLI are required for the [build process](https://www.weepower.com/build/#setup).*

## Compatibility

Wee officially supports the following minimum browser versions:

Internet Explorer  | Chrome | Firefox | Safari | iOS Safari | Android
------------------ | ------ | ------- | ------ | ---------- | -------
8                  | 30     | 24      | 6.1    | 5.1        | 4.1

## Bugs

Have a bug or a feature request? [Open a new issue](https://github.com/weepower/wee/issues).  
To view the working to-do list check out our public [Trello board](https://trello.com/b/7KbnQra9/wee).

Automated testing generously provided by [BrowserStack](https://www.browserstack.com).

## Versioning

Wee adheres to [Semantic Versioning](http://semver.org/) in the form of MAJOR.MINOR.PATCH.  
Regardless of version we recommend thoroughly reviewing the [release notes](https://github.com/weepower/wee/releases) before updating.

## Community

Keep track of development and news by following [@weecss](https://twitter.com/weecss) on Twitter.

## License

Copyright 2015 [Caddis Interactive, LLC](https://www.caddis.co). Licensed under the [Apache License, Version 2.0](https://github.com/weepower/wee/blob/master/LICENSE).