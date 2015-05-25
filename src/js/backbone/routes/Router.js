var Router = Backbone.Router.extend({
	initialize: function (options) {
        this.model = options.model
        this.layouts = options.layouts
	},
	routes: {
		'!header(/)': 'header',
        '!generator(/)*queryString': 'generator',
		'!simulator(/)*queryString': 'simulator',
	},
})

module.exports = Router