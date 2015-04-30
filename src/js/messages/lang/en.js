function capitalize(str) {
    return str[0].toUpperCase(str) + str.substring(1)
}

module.exports = {
	order: ['balls', 'periods', 'heights', 'patterns'],
	patterns: 'Patrons',
	balls: [
	    function (min, max) {
	    	return 'of ' + max + ' balls'
	    },
	    function (min, max) {
	    	return 'for maximum ' + max + ' balls'
	    },
	    function (min, max) {
	    	return 'from ' + min + ' to ' + max + ' balls'
	    },
	    function (min, max) {
	    	return 'L\'interval de boles que demanes no es correcte'
	    },
	],
	periods: [
	    function (min, max) {
	    	return 'of ' + max + ' period'
	    },
	    function (min, max) {
	    	return 'with no higher than ' + max + ' periods'
	    },
	    function (min, max) {
	    	return 'with periods between ' + min + ' and ' + max
	    },
	    function (min, max) {
	    	return 'L\'interval de períodes que demanes no es correcte'
	    },
	],
	heights: [
	    function (min, max) {
	    	return 'with no higher than ' + max + ' throws'
	    },
	    function (min, max) {
	    	return 'with any greater or equal than ' + min + ' throw'
	    },
	    function (min, max) {
	    	return 'with any' + min + 'throw and no higher'
	    },
	    function (min, max) {
	    	return 'with any greater or equal than ' + min + ' throw and no higher than ' + max
	    },
	    function (min, max) {
	    	return 'L\'interval de períodes que demanes no es correcte'
	    },
	],
	message: {
        isNotAInt: function (value) {
            return value + 'isn\'t a integer'
        },
        invalidRange: function (range, type) {
            type = {
                balls: 'the number of balls',
                periods: 'period',
                heights: 'the height'
            }[type]
            return 'Minimum ' + type + ' (' + range.min 
                 + ') must not exceed maximum ' + type + ' (' + range.max + ')'
        },
        emptyWithBigPeriod: function () {
            return 'No valid patterns within this range. Try with maximum height greater than minimum number of balls'
        },
        emptyWithLittlePeriod: function () {
            return 'No valid patterns within this range. Try with maximum height greater or equal than minimum number of balls'
        }
    }
}