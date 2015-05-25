var AppView                 = require('./views/root/AppView')
var LayoutView              = require('./views/layouts/LayoutView')
var HeaderView              = require('./views/layouts/HeaderView')
var GeneratorView           = require('./views/layouts/GeneratorView')
var SimulatorView           = require('./views/layouts/SimulatorView')
var KeyboardView            = require('./views/keyboard/KeyboardView')
var PatternsKeyboardView    = require('./views/keyboard/PatternsKeyboardView')
var ControlBarView          = require('./views/keyboard/ControlBarView')
var DashboardView           = require('./views/dashboard/DashboardView')
var FieldView               = require('./views/dashboard/FieldView')
var FieldsetView            = require('./views/dashboard/FieldsetView')
var CreateButtonView        = require('./views/dashboard/CreateButtonView')
var DescriptionView         = require('./views/dashboard/DescriptionView')
var DescriptionFragmentView = require('./views/dashboard/DescriptionFragmentView')
var SiteswapOptions         = require('./models/SiteswapOptions')
var siteswapOptionsDefaults = require('./models/siteswapOptionsDefaults')
var BallsOptions            = require('./models/BallsOptions')
var PeriodOptions           = require('./models/PeriodOptions')
var HeightOptions           = require('./models/HeightOptions')

// Models
var balls  = new BallsOptions(siteswapOptionsDefaults.balls)
var period = new PeriodOptions(siteswapOptionsDefaults.period)
var height = new HeightOptions(siteswapOptionsDefaults.height)

var siteswapOptions = new SiteswapOptions({
    balls: balls,
    period: period,
    height: height
})

// Views 
var keyboard = {
    balls: new KeyboardView({
        el: '#keyboard-balls',
        start: 1,
        model: balls
    }),
    period: new KeyboardView({
        el: '#keyboard-periods',
        model: period
    }),
    height: new KeyboardView({
        el: '#keyboard-heights',
        start: 1,
        model: height
    }),
    patterns: new PatternsKeyboardView({
        el: '#keyboard-patterns',
        model: siteswapOptions
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
        model: balls
    }),
    period: new FieldsetView({
        el: '#fieldset-period',
        minView: fields.period.minView,
        maxView: fields.period.maxView,
        keyboardView: keyboard.period,
        model: period
    }),
    height: new FieldsetView({
        el: '#fieldset-height',
        minView: fields.height.minView,
        maxView: fields.height.maxView,
        keyboardView: keyboard.height,
        model: height
    })
}

var description = new DescriptionView({
    error: '#error',
    success: '#success',
    model: siteswapOptions,
    balls: new DescriptionFragmentView({
        el: '#description-balls',
        name: 'balls',
        model: balls
    }),
    period: new DescriptionFragmentView({
        el: '#description-period',
        name: 'period',
        model: period
    }),
    height: new DescriptionFragmentView({
        el: '#description-height',
        name: 'height',
        model: height
    }),
})

var dashboard = new DashboardView({
    el: '#generator',
    fieldsetViews: fieldsets,
    descriptionView: description,
    createButtonView: new CreateButtonView({
        el: '#create',
        keyboardView: keyboard.patterns,
        model: siteswapOptions
    }),
    controlBarView: controlBar,
})

// Routing
var Router    = require('./routes/Router')
var callbacks = require('./routes/callbacks')

var appRouter = new Router({
    model: siteswapOptions,
})

appRouter.on('route:header'   , callbacks.header   )
appRouter.on('route:generator', callbacks.generator)
appRouter.on('route:simulator', callbacks.simulator)

// layouts
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

// appView
var appView = new AppView({
    layouts: layouts,
    dashboard: dashboard,
    appRouter: appRouter
})

// routing start
Backbone.history.start();