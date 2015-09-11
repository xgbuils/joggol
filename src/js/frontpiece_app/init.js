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
var AppModel                = require('./models/AppModel')
var BallsOptions            = require('./models/BallsOptions')
var PeriodOptions           = require('./models/PeriodOptions')
var HeightOptions           = require('./models/HeightOptions')

// Models
var appModel = new AppModel({
    layout: 'header'
})

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
        name: 'balls',
        model: balls,
        appModel: appModel,
        end: 25
    }),
    period: new KeyboardView({
        el: '#keyboard-periods',
        name: 'period',
        model: period,
        appModel: appModel,
        end: 10
    }),
    height: new KeyboardView({
        el: '#keyboard-heights',
        name: 'height',
        model: height,
        appModel: appModel,
        end: 25
    }),
    patterns: new PatternsKeyboardView({
        el: '#keyboard-patterns',
        name: 'patterns',
        model: siteswapOptions,
        appModel: appModel
    })
}

var controlBar = new ControlBarView({
    el: '#keyboard',
    appModel: appModel,
    keyboardViews: keyboard,
    patternsKeyboardView: keyboard.patterns
})

var nameFieldsets = ['balls', 'period', 'height']

var fields = {
    balls: {
        minView: new FieldView({
            el: '#balls-min',
            fieldset: 'balls',
            field: 'min',
            appModel: appModel,
            rangeModel: balls,
        }),
        maxView: new FieldView({
            el: '#balls-max',
            fieldset: 'balls',
            field: 'max',
            appModel: appModel,
            rangeModel: balls,
        })
    },
    period: {
        minView: new FieldView({
            el: '#periods-min',
            fieldset: 'period',
            field: 'min',
            appModel: appModel,
            rangeModel: period,
        }),
        maxView: new FieldView({
            el: '#periods-max',
            fieldset: 'period',
            field: 'max',
            appModel: appModel,
            rangeModel: period,
        }),
    },
    height: {
        minView: new FieldView({
            el: '#heights-min',
            fieldset: 'height',
            field: 'min',
            appModel: appModel,
            rangeModel: height,
        }),
        maxView: new FieldView({
            el: '#heights-max',
            fieldset: 'height',
            field: 'max',
            appModel: appModel,
            rangeModel: height,
        }),
    }
}

var fieldsets = {
    balls: new FieldsetView({
        name: 'balls',
        el: '#fieldset-balls',
        model: balls,
        appModel: appModel
    }),
    period: new FieldsetView({
        name: 'period',
        el: '#fieldset-period',
        model: period,
        appModel: appModel
    }),
    height: new FieldsetView({
        name: 'height',
        el: '#fieldset-height',
        model: height,
        appModel: appModel
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

var createButtonView = new CreateButtonView({
    el: '#create',
    model: siteswapOptions,
    appModel: appModel
})

var dashboard = new DashboardView({
    el: '#generator',
    appModel: appModel,
})

// Routing
var appRouter      = require('./routes/Router')
appRouter.model    = siteswapOptions
appRouter.appModel = appModel

// layouts
var layouts = {
    header: new HeaderView({
        el: '#header',
        appRouter: appRouter,
        controlBarView: controlBar,
        appModel: appModel
    }),
    generator: new GeneratorView({
        el: '#generator',
        appRouter: appRouter,
        dashboardView: dashboard,
        controlBarView: controlBar,
        appModel: appModel
    }),
    simulator: new SimulatorView({
        el: '#simulator',
        appRouter: appRouter,
        controlBarView: controlBar,
        patternsKeyboardView: keyboard.patterns,
        model: siteswapOptions,
        appModel: appModel,
    })
}

// appView
var appView = new AppView({
    layouts: layouts,
    dashboard: dashboard,
    appRouter: appRouter,
    model: appModel
})

// routing start
appRouter.start()
var fragment = appRouter.getFragment()
console.log(fragment)
if (fragment) {
    appRouter.navigate(fragment, {trigger: true})
}