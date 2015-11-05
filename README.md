[![Wee](https://www.weepower.com/repo/logo.svg)](https://www.weepower.com)

Wee is a lightweight front-end framework for logically building complex, responsive web projects.

## Features

Mobile-first CSS framework with configurable reset and mixin library ~ *3KB gzipped*

* **Central configuration** for style normalization
* **Feature toggling** to minimize build size
* **Structured breakpoints** to organize responsive logic
* **Legacy rules** for IE8 compatibility
* **Print styling** to generate print-optimized pages

JavaScript toolset to build scalable, organized client logic ~ *14KB gzipped*

* **Foundation** of utilities, helpers, and controller structure
* **Chainable DOM** traversal and manipulation with familiar API
* **Animation** methods to tween CSS attributes and properties
* **Touch support** for directional swipe events
* **Routing library** to flexibly associate endpoints to actions
* **Event handling** to bind actions to elements
* **Data loading** for Ajax and JSON interaction
* **HTML5 history** helper to create highly dynamic experiences
* **Template rendering** to parse complex data structures
* **Data binding** to sync data models to the DOM
* **Resource loading** for JavaScript, CSS, and images
* **Breakpoint watching** for efficient media query callbacks
* **Polyfill support** for HTML5, ES5, SVG, and input placeholders

JSON-configured build process to compile, optimize, and minify your project

* **Built-in server** for local static development
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
.nav {
	&__button {
		.fill();
		.font(@headingFont; 1.2);
		.spaced(1);
		.uppercase();
		&:hover {
			.background(light; 5%; @primary);
		}
		&.\--bordered {
			.border(@primary);
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
	background-color: #349bb9;
	background-color: rgba(255, 255, 255, .05);
}
.nav__button.--bordered {
	border: 1px solid #349bb9;
}
```

##### Core [→](https://www.weepower.com/script/core)

There are a couple dozen useful features and utilities in the core script. For instance, you can handle environment detection, loop through selections, serialize objects, and observe data models.

```javascript
$.env({
	prod: 'www.domain.com',
	test: 'testing.domain.com'
});

$.env(); // "local"
```

```javascript
$.observe('user.status', function(data, type, diff) {
	// Trigger logic
}, {
	diff: true,
	once: true,
	val: 'active'
);

$.set('user.status', 'active');
```

##### DOM [→](https://www.weepower.com/script/chain)

Familiar chainable API and pre-cached [references](https://www.weepower.com/script/#selection) make DOM interaction quick and easy.

```html
<button data-ref="element">Button</button>
```

```javascript
$('ref:element').addClass('--is-active')
	.attr('aria-selected', 'true');
```

##### Controllers [→](https://www.weepower.com/script/core)

Controllers along with the automated build process create well-organized projects. There are public and private objects with constructors, destructors, and other helpful components.

```javascript
Wee.fn.make('controllerName', {
	_construct: function() {
		this.publicVariable = 'Public Variable';
		this.init();
	},
	
	/**
	 * Call a private method with an argument
	 */
	init: function() {
		this.$private.privateMethod('varName');
	}
}, {
	/**
	 * Return the provided argument
	 *
	 * @param {string} key
	 * @returns {string}
	 */
	privateMethod: function(key) {
		return key;
	}
});
```

##### Routing [→](https://www.weepower.com/script/routes)

Create independence between markup and script using the powerful routing options. There are some helpful built-in filters and custom filters can also also be registered.

```javascript
Wee.routes.map({
	'$any:once': 'common', // Fire the init method of the common controller
	'$root': 'home',
	'$root:unload': 'home:unload',
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

The template parser supports fallbacks, loops, helpers, partials, and more. It also powers the [static site generator](https://www.weepower.com/generator) and data-binding apps.

```javascript
Wee.view.render('My name is {{ firstName }}{{ #lastName|notEmpty }} {{ lastName }}{{ /lastName }}', {
	firstName: 'John',
	lastName: 'Smith'
});
```

Becomes...

```javascript
"My name is John Smith"
```

##### Apps [→](https://www.weepower.com/script/view)

Wee includes a powerful application framework for one-way data-binding. Simply call into one of the many data manipulation methods to update your model and watch the DOM update automatically.

```javascript
Wee.app.make('testApp', {
	view: 'ref:application',
	model: {
		key: 'value'
	}
});

testApp.$set('key', 'new value');
```

##### Breakpoints [→](https://www.weepower.com/script/screen)

Seamlessly combine and trigger breakpoint logic based on configured project media queries. Events can be setup to watch, initially fire, trigger only once, and more.

```javascript
Wee.screen.map([
	{
		size: 1,
		callback: [
			'common:mobile', // Fire the mobile method of the common controller
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
		once: true,
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

Create organized interaction on your page with the simple event API. Custom events can also be registered as they are with the core Wee touch events.

```javascript
Wee.events.on('ref:element', 'click swipeRight', function(e, el) {
	// Event logic
	e.preventDefault();
}, {
	delegate: '.js-selector',
	once: true
});
```

##### Requests [→](https://www.weepower.com/script/data)

Submit any type of request with a number of callback options. Supports advanced features like custom headers and JSONP handling.

```javascript
Wee.data.request({
	url: '/login',
	method: 'post',
	json: true,
	data: {
		username: 'user@weepower.com',
		password: 'pass123'
	},
	success: function(data) {
		// Success logic
	},
	error: function(data) {
		// Failure logic
	}
});
```

##### Asset Loading [→](https://www.weepower.com/script/assets)

Load what you need on demand to optimize page speed and preserve bandwidth. Assets can be grouped and checked against later for advanced usage.

```javascript
Wee.assets.load({
	root: 'https://cdn.weepower.com/assets/alert/',
	files: [
		'close.svg',
		'style.min.css',
		'script.min.js'
	],
	success: function() {
		// Success logic
	},
	error: function() {
		// Failure logic
	}
});
```

##### Animation [→](https://www.weepower.com/script/animation)

Tween attributes and properties with granular control and callback functionality. Custom easing function can be registered for granular control of the motion.

```javascript
Wee.animate.tween('ref:element', {
	height: 100,
	width: 200
}, {
	duration: 200,
	ease: 'custom',
	complete: function() {
		// Completion logic
	}
});
```

##### History [→](https://www.weepower.com/script/history)

Create dynamic experiences through partial Ajax loading and the HTML5 History API. With one method static navigation can transform into a seamless, efficient user flow.

```javascript
Wee.history.init({
	scrollTop: '.heading',
	partials: 'title, main, .heading',
	bind: {
		click: 'a'
	},
	request: {
		success: function(xhr) {
			// Success logic
		},
		error: function(xhr) {
			// Failure logic
		}
	},
	complete: function(obj) {
		// Complete logic
	}
});
```

## Installation

Get started using one of these methods:

* [Download the latest release](https://github.com/weepower/wee/archive/master.zip) or
* Clone the repository from `git clone git://github.com/weepower/wee.git`

Then run `npm install` from the root of your project followed by `node wee run:static`.

*Node.js 4.2.1+ and the Grunt CLI are recommended for the [build process](https://www.weepower.com/build/#setup).*

## Compatibility

Wee officially supports the following minimum browser versions:

IE  | Edge | Chrome | Firefox | Safari | iOS Safari | Android
--- | ---- | ------ | ------- | ------ | ---------- | -------
8   | 20   | 30     | 29      | 6.1    | 6.1        | 4.1

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