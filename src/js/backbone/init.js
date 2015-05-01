var AppView       = require('./views/root/AppView')
var LayoutView    = require('./views/layouts/LayoutView')
var DashboardView = require('./views/dashboard/DashboardView')
var FieldView     = require('./views/dashboard/FieldView')
var FieldsetView  = require('./views/dashboard/FieldsetView')

var fieldsets = {
	balls: new FieldsetView({
		el: '#fieldset-balls',
		minView: new FieldView({
			el: "#balls-min"
		}),
		maxView: new FieldView({
			el: "#balls-max"
		})
	}),
	period: new FieldsetView({
		el: '#fieldset-period',
		minView: new FieldView({
			el: "#periods-min"
		}),
		maxView: new FieldView({
			el: "#periods-max"
		})
	}),
	height: new FieldsetView({
		el: '#fieldset-height',
		minView: new FieldView({
			el: "#heights-min"
		}),
		maxView: new FieldView({
			el: "#heights-max"
		})
	})
}

var dashboard = new DashboardView({
	el: '#generator',
	fielsetViews: fieldsets
})

var layouts = {
	header: new LayoutView({
		el: '#header'
	}),
	generator: new LayoutView({
		el: '#generator',
		dashboardView: dashboard
	}),
	simulator: new LayoutView({
		el: '#simulator'
	})
}

var appView = new AppView({
	layouts: layouts
})