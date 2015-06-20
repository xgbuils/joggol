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
var DashboardModel          = require('./models/DashboardModel')
var Model = require('frontpiece.model')
var RecursiveModel = require('frontpiece.recursive-model')

// Models
var appModel = new AppModel({
    layout: 'header'
})

var dashboardModel = new DashboardModel()

var balls  = new BallsOptions(siteswapOptionsDefaults.balls)
var period = new PeriodOptions(siteswapOptionsDefaults.period)
var height = new HeightOptions(siteswapOptionsDefaults.height)

var siteswapOptions = new SiteswapOptions({
    balls: balls,
    period: period,
    height: height
})

keyboardBalls  = new Model({
    active: false
})
keyboardPeriod = new Model({
    active: false
})
keyboardHeight = new Model({
    active: false
})
keyboardPatterns = new Model({
    active: false
})

// Views 
var keyboard = {
    balls: new KeyboardView({
        el: '#keyboard-balls',
        name: 'balls',
        model: balls,
        keyboardModel: keyboardBalls,
        appModel: appModel
    }),
    period: new KeyboardView({
        el: '#keyboard-periods',
        name: 'period',
        model: period,
        keyboardModel: keyboardPeriod,
        appModel: appModel
    }),
    height: new KeyboardView({
        el: '#keyboard-heights',
        name: 'height',
        model: height,
        keyboardModel: keyboardHeight,
        appModel: appModel
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
            name: 'min',
            model: dashboardModel.getModel('balls.min'),
            rangeModel: balls,
            keyboardModel: keyboardBalls
        }),
        maxView: new FieldView({
            el: '#balls-max',
            name: 'max',
            model: dashboardModel.getModel('balls.max'),
            rangeModel: balls,
            keyboardModel: keyboardBalls
        })
    },
    period: {
        minView: new FieldView({
            el: '#periods-min',
            name: 'min',
            model: dashboardModel.getModel('period.min'),
            rangeModel: period,
            keyboardModel: keyboardPeriod
        }),
        maxView: new FieldView({
            el: '#periods-max',
            name: 'max',
            model: dashboardModel.getModel('period.max'),
            rangeModel: period,
            keyboardModel: keyboardPeriod
        }),
    },
    height: {
        minView: new FieldView({
            el: '#heights-min',
            name: 'min',
            model: dashboardModel.getModel('height.min'),
            rangeModel: height,
            keyboardModel: keyboardHeight
        }),
        maxView: new FieldView({
            el: '#heights-max',
            name: 'max',
            model: dashboardModel.getModel('height.max'),
            rangeModel: height,
            keyboardModel: keyboardHeight
        }),
    }
}

var fieldsets = {
    balls: new FieldsetView({
        name: 'balls',
        el: '#fieldset-balls',
        name: 'balls',
        model: balls,
        dashboardModel: dashboardModel,
        keyboardModel: keyboardBalls,
        appModel: appModel
    }),
    period: new FieldsetView({
        name: 'period',
        el: '#fieldset-period',
        name: 'period',
        model: period,
        dashboardModel: dashboardModel,
        keyboardModel: keyboardPeriod,
        appModel: appModel
    }),
    height: new FieldsetView({
        name: 'height',
        el: '#fieldset-height',
        name: 'height',
        model: height,
        dashboardModel: dashboardModel,
        keyboardModel: keyboardHeight,
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
    model: siteswapOptions
})

var dashboard = new DashboardView({
    el: '#generator',
    appModel: appModel,
    model: dashboardModel
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
        keyboardModel: keyboardPatterns
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
appRouter.start();