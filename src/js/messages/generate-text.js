module.exports = {
    balls: function (text, balls, $output, lang) {
        text.error = false
        if (balls.min !== undefined && balls.max !== undefined
         && balls.min <= balls.max && balls.min > 0) {
            if (balls.min === balls.max) 
                text.balls = lang.balls[0](balls.min, balls.max)
            else if (balls.min === 1)
                text.balls = lang.balls[1](balls.min, balls.max)
            else if (balls.min < balls.max)
                text.balls = lang.balls[2](balls.min, balls.max)
        } else {
            text.error = lang.balls[3](balls.min, balls.max)
        }
        $output.text(text.balls)
    },
    
    periods: function (text, period, $output, lang) {
        text.error = false
        //console.log(period)
        if (period.min !== undefined && period.max !== undefined 
         && period.min <= period.max && period.min > 0) {
            if (period.min === period.max) 
                text.period = lang.periods[0](period.min, period.max)
            else if (period.min === 1)
                text.period = lang.periods[1](period.min, period.max)
            else if (period.min < period.max)
                text.period = lang.periods[2](period.min, period.max)
        } else {
            text.error = lang.periods[3](period.min, period.max)
        }
        $output.text(text.period)
    },

    heights: function (text, height, $output, lang) {
        text.error = false
        if (height.min === undefined && height.max === undefined) {
            text.height = ''
        } else if ((height.min === undefined || height.min <= 1) && height.max >= 0) {
            text.height = lang.heights[0](height.min, height.max)
        } else if (height.max === undefined && height.min >= 0) {
            text.height = lang.heights[1](height.min, height.max)
        } else if (height.min <= height.max && height.min >= 0) {
            if (height.min === height.max) {
                text.height = lang.heights[2](height.min, height.max)
            } else {
                text.height = lang.heights[3](height.min, height.max)
            }
        } else {
            text.error = lang.heights[4](height.min, height.max)
        }

        $output.text(text.height)
    }
}