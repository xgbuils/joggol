var Router = Backbone.Router.extend({
	routes: {
		'!header(/)': 'header',
        '!generator(/)*queryString': 'generator',
		'!simulator(/)*queryString': 'simulator',
		
	},
})

module.exports = Router