function capitalize(str) {
    return str[0].toUpperCase(str) + str.substring(1)
}

module.exports = {
	order: ['patterns', 'balls', 'periods', 'heights'],
	patterns: 'Patrons',
	balls: [
	    function (min, max) {
	    	return 'de ' + max + ' boles'
	    },
	    function (min, max) {
	    	return 'de màxim ' + max + ' boles'
	    },
	    function (min, max) {
	    	return 'de ' + min + ' a ' + max + ' boles'
	    },
	    function (min, max) {
	    	return 'L\'interval de boles que demanes no es correcte'
	    },
	],
	periods: [
	    function (min, max) {
	    	return 'de període ' + max
	    },
	    function (min, max) {
	    	return 'amb períodes no més grans de ' + max
	    },
	    function (min, max) {
	    	return 'amb períodes entre ' + min + ' i ' + max
	    },
	    function (min, max) {
	    	return 'L\'interval de períodes que demanes no es correcte'
	    },
	],
	heights: [
	    function (min, max) {
	    	return 'amb llançaments no més alts de ' + max
	    },
	    function (min, max) {
	    	return 'amb llançaments que continguin alguna alçada major o igual a ' + min
	    },
	    function (min, max) {
	    	return 'amb algun llançament de ' + min + ' i no més alt'
	    },
	    function (min, max) {
	    	return 'amb llançaments majors o iguals a ' + min + ' i mai superiors a ' + max
	    },
	    function (min, max) {
	    	return 'L\'interval de períodes que demanes no es correcte'
	    },
	],
	message: {
        isNotAInt: function (value) {
            return value + 'no és un nombre enter'
        },
        invalidRange: function (range, type) {
            type = {
                balls: 'el nombre de boles',
                period: 'el període',
                height: 'l\'alçada'
            }[type]
            return capitalize(type) + ' menor (' + range.min 
                 + ') no pot sobrepassar ' + type + ' major (' + range.max + ')'
        },
        emptyWithBigPeriod: function () {
            return 'No existeixen patrons vàlids dintre del rang indicat. Prova que l\'alçada màxima sigui major al nombre mínim de boles'
        },
        emptyWithLittlePeriod: function () {
            return 'No existeixen patrons vàlids dintre del rang indicat. Prova que l\'alçada màxima sigui major o igual al nombre mínim de boles'
        }
    }
}