// Add custom JavaScript here

//Wee.app.make('appName', {
//	_construct: function() {
//
//	},
//	model: 'modelName',
//	model: {
//
//	},
//	view: 'ref:sample',
//	view: 'template string',
//	controller: 'controllerName',
//	controller: {
//
//	}
//});
//
//// Example #1
//
//<input w-bind="modelName:firstName">
//<input w-bind="modelName:lastName">
//
//<div w-model="modelName">
//	<h2>Hello {{firstName}} {{lastName}}</h2>
//</div>
//
//// Example #2
//
//Wee.$set('listModel', {
//	people: [
//		{
//			firstName: 'Michael',
//			lastName: 'Leigeber'
//		},
//		{
//			firstName: 'Nathan',
//			lastName: 'Hood'
//		}
//	]
//});
//
//Wee.fn.make('listController', {
//	events: {
//		'li': {
//			click: function(e, data) {
//				Wee.view.render('You clicked on {{firstName}}!', data);
//			}
//		}
//	},
//	method: function() {
//
//	}
//});
//
//Wee.app.make('listApp', {
//	_construct: function() {
//
//	},
//	model: 'listModel',
//	view: 'ref:listApp',
//	controller: 'listController'
//});
//
//<ul class="ref:listApp">
//	<li w-repeat="listApp:people" w-if="eval">
//		{{firstName}} {{lastName}}
//	</li>
//</ul>
//
//// Directives
//
//wee-if
//wee-bind
//wee-repeat
//wee-on
//wee-model
//
//Interface with all Wee DOM set methods
//
//wee-addClass
//wee-removeClass
//wee-hide
//wee-show
//wee-css
//wee-data
//wee-width
//wee-attr
//wee-empty
//wee-height
//wee-html
//wee-text
//wee-prop
//wee-removeAttr
//wee-scrollLeft
//wee-scrollTop
//wee-val