var Router = Backbone.Router.extend({
	routes: {
		'!header(/)': 'header',
        '!generator(/)*queryString': 'generator',
		'!simulator(/)*queryString': 'simulator',
		
	},
	execute: function (callback, args) {
        /*if (args.length === 1 && args[0] === null) {
            args.pop()
        }
		var obj = querystring.decode(args.pop())
		console.log('qs', obj)
		args.push(obj)
		console.log(args)*/

        if (callback) callback.apply(this, 'foo')
    }
})

module.exports = Router