var AppView              = require('./views/root/AppView')
var LayoutView           = require('./views/layouts/LayoutView')
var HeaderView           = require('./views/layouts/HeaderView')
var GeneratorView        = require('./views/layouts/GeneratorView')
var SimulatorView        = require('./views/layouts/SimulatorView')
var KeyboardView         = require('./views/keyboard/KeyboardView')
var PatternsKeyboardView = require('./views/keyboard/PatternsKeyboardView')
var ControlBarView       = require('./views/keyboard/ControlBarView')
var DashboardView        = require('./views/dashboard/DashboardView')
var FieldView            = require('./views/dashboard/FieldView')
var FieldsetView         = require('./views/dashboard/FieldsetView')
var CreateButtonView     = require('./views/dashboard/CreateButtonView')
var SiteswapOptions      = require('./models/SiteswapOptions')

// Routing
var Router    = require('./routes/Router')
var callbacks = require('./routes/callbacks')

var appRouter = new Router()

appRouter.on('route:header'   , callbacks.header   )
appRouter.on('route:generator', callbacks.generator)
appRouter.on('route:simulator', callbacks.simulator)

// Views 
var keyboard = {
    balls: new KeyboardView({
        el: '#keyboard-balls',
        start: 1
    }),
    period: new KeyboardView({
        el: '#keyboard-periods',
    }),
    height: new KeyboardView({
        el: '#keyboard-heights',
        start: 1
    }),
    patterns: new PatternsKeyboardView({
        el: '#keyboard-patterns',
    })
}

var controlBar = new ControlBarView({
    el: '#keyboard',
    keyboardViews: keyboard,
    patternsKeyboardView: keyboard.patterns
})

var nameFieldsets = ['balls', 'period', 'height']

var fields = {
    balls: {
        minView: new FieldView({
            el: '#balls-min'
        }),
        maxView: new FieldView({
            el: '#balls-max'
        })
    },
    period: {
        minView: new FieldView({
            el: '#periods-min'
        }),
        maxView: new FieldView({
            el: '#periods-max'
        }),
    },
    height: {
        minView: new FieldView({
            el: '#heights-min'
        }),
        maxView: new FieldView({
            el: '#heights-max'
        }),
    }
}

var fieldsets = {
    balls: new FieldsetView({
        el: '#fieldset-balls',
        minView: fields.balls.minView,
        maxView: fields.balls.maxView,
        keyboardView: keyboard.balls,
    }),
    period: new FieldsetView({
        el: '#fieldset-period',
        minView: fields.period.minView,
        maxView: fields.period.maxView,
        keyboardView: keyboard.period,
    }),
    height: new FieldsetView({
        el: '#fieldset-height',
        minView: fields.height.minView,
        maxView: fields.height.maxView,
        keyboardView: keyboard.height,
    })
}

var dashboard = new DashboardView({
    el: '#generator',
    fieldsetViews: fieldsets,
    createButtonView: new CreateButtonView({
        el: '#create',
        keyboardView: keyboard.patterns
    }),
    controlBarView: controlBar
})

var layouts = {
    header: new HeaderView({
        el: '#header',
        appRouter: appRouter,
        controlBarView: controlBar
    }),
    generator: new GeneratorView({
        el: '#generator',
        appRouter: appRouter,
        dashboardView: dashboard,
        controlBarView: controlBar
    }),
    simulator: new SimulatorView({
        el: '#simulator',
        appRouter: appRouter,
        controlBarView: controlBar,
        patternsKeyboardView: keyboard.patterns
    })
}

var appView = new AppView({
    layouts: layouts,
    dashboard: dashboard,
    appRouter: appRouter
})

// routing start
Backbone.history.start();

// Model
if (!appView.model) {
    console.log('no existe modelo: ¡a crear uno por defecto!')
    appView.trigger('create-model', new SiteswapOptions({
        balls : {min: 3, max: 3},
        period: {min: 1, max: 3},
        height: {max: 5}
    }))
}


