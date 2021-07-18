// @flow
/**
 * Эти данные используются в тестах. Включают только те поля, которые запрашиваются приложением. Также могут
 * включать дополнительные поля, если это нужно для целей тестирования.
 */

/**
 * Пример информации о достижениях после преобразования: изменено название ключа идентификатора и из названия
 * убран идентификатор достижения. Используется для тестирования функции обратного вызова для `Array.map`.
 */
const achievementDescriptions = {
	mainGun: {id: 'mainGun', image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/mainGun.png', name: '«Основной калибр»'},
	markOfMastery: {id: 'markOfMastery', image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/markOfMastery.png', name: 'Знак классности ↵«Мастер»'},
	markOfMasteryI: {id: 'markOfMasteryI', image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/markOfMasteryI.png', name: 'Знак классности ↵«1 степень»'},
	markOfMasteryII: {id: 'markOfMasteryII', image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/markOfMasteryII.png', name: 'Знак классности ↵«2 степень»'},
	markOfMasteryIII: {id: 'markOfMasteryIII', image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/markOfMasteryIII.png', name: 'Знак классности ↵«3 степень»'},
	sniper: {id: 'sniper', image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/sniper.png', name: '«Снайпер»'},
	titleSniper: {id: 'titleSniper', image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/titleSniper.png', name: '«Стрелок»'},
	warrior: {id: 'warrior', image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/warrior.png', name: '«Воин»'}
};

/**
 * Пример ответа на запрос информации о самих достижениях. Для целей тестирования достаточно информаии о части
 * достижений. В приложении используются поля: идентификатор, изображение и название достижения.
 */
const achievementDescriptionsResponse = {
	data: {
		mainGun: {
			achievement_id: 'mainGun',
			image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/mainGun.png',
			name: '«Основной калибр» (mainGun)'
		},
		markOfMastery: {
			achievement_id: 'markOfMastery',
			image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/markOfMastery.png',
			name: 'Знак классности \n«Мастер» (markOfMastery)'
		},
		markOfMasteryI: {
			achievement_id: 'markOfMasteryI',
			image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/markOfMasteryI.png',
			name: 'Знак классности \n«1 степень» (markOfMasteryI)'
		},
		markOfMasteryII: {
			achievement_id: 'markOfMasteryII',
			image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/markOfMasteryII.png',
			name: 'Знак классности \n«2 степень» (markOfMasteryII)'
		},
		markOfMasteryIII: {
			achievement_id: 'markOfMasteryIII',
			image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/markOfMasteryIII.png',
			name: 'Знак классности \n«3 степень» (markOfMasteryIII)'
		},
		sniper: {
			achievement_id: 'sniper',
			image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/sniper.png',
			name: '«Снайпер» (sniper)'
		},
		tankExpert: {
			achievement_id: 'tankExpert',
			image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/tankExpert.png',
			name: '«Эксперт» (tankExpert)'
		},
		titleSniper: {
			achievement_id: 'titleSniper',
			image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/titleSniper.png',
			name: '«Стрелок» (titleSniper)'
		},
		warrior: {
			achievement_id: 'warrior',
			image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/warrior.png',
			name: '«Воин» (warrior)'
		}
	},
	meta: {
		count: 9
	},
	status: 'ok'
};

/**
 * Идентификаторы достижений на технике. Для целей тестирования весь набор не нужен.
 */
const achievements = ['markOfMasteryI', 'markOfMasteryII', 'markOfMasteryIII'];

/**
 * Пример ответа на запрос информации о достижения в случае когда этой информации нет.
 */
const noAchievementsResponse = {
	data: {
		1: null
	},
	meta: {
		count: 1
	},
	status: 'ok'
};

/**
 * Пример ответа на запрос информации о статистике в случае когда этой информации нет.
 */
const noVehicleStatsResponse = {
	data: {
		1: null
	},
	meta: {
		count: 1
	},
	status: 'ok'
};

/**
 * Пример ответа на поисковый запрос.
 */
const searchResponse = {
	status: 'ok',
	meta: {
		count: 1
	},
	data: [
		{
			nickname: 'meaning',
			account_id: 42
		}
	]
};

/**
 * Пример ответа на запрос информации о достижениях на технике.
 */
const vehicleAchievementsResponse = {
	data: {
		// '1' в данном случае - идентификатор учетной записи
		// $FlowFixMe
		1: [
			{
				achievements: {
					armorPiercer: 1,
					huntsman: 1,
					markOfMastery: 4,
					medalAbrams: 4,
					medalCarius: 4,
					medalKay: 3,
					medalKnispel: 4,
					medalOskin: 1,
					medalPoppel: 4,
					scout: 2,
					supporter: 4,
					titleSniper: 1,
					warrior: 2
				},
				tank_id: 1
			},
			{
				achievements: {
					armorPiercer: 1,
					markOfMastery: 2,
					medalAbrams: 4,
					medalCarius: 4,
					medalKay: 4,
					medalKnispel: 4,
					medalPoppel: 4,
					supporter: 3,
					titleSniper: 1
				},
				tank_id: 2561
			}
		]
	},
	meta: {
		count: 1
	},
	status: 'ok'
};

/**
 * Пример ответа на запрос информации об игровой технике. Все, что нужно для целей
 * приложения - миниаютра, название и идентификатор.
 */
const vehicleInfoResponse = {
	data: {
		// '1' в данном случае - идентификатор техники
		// $FlowFixMe
		1: {
			images: {
				preview: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/uploaded/vehicles/hd_thumbnail/T-34.png'
			},
			name: 'Т-34',
			tank_id: 1
		}
	},
	meta: {
		count: 1
	},
	status: 'ok'
};

/**
 * Пример ответа на запрос статистики по технике.
 */
const vehicleStatsResponse = {
	data: {
		// '1' в данном случае - идентификатор учетной записи
		// $FlowFixMe
		1: [
			{
				all: {
					// попадания
					hits: 515,
					// выстрелы
					shots: 596
				},
				tank_id: 1
			}
		]
	},
	meta: {
		count: 1
	},
	status: 'ok'
};

export {
	achievementDescriptions,
	achievementDescriptionsResponse,
	achievements,
	noAchievementsResponse,
	noVehicleStatsResponse,
	searchResponse,
	vehicleAchievementsResponse,
	vehicleInfoResponse,
	vehicleStatsResponse
};
