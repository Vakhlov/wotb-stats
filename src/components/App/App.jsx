// @flow
/** @jsx h */
import {accountIdIsPermanent, countPermanentAccounts, logError} from 'helpers/common';
import type {
	Account,
	AchievementDescriptions,
	Option,
	VehicleAchievements,
	VehicleInfo,
	VehicleStats
} from 'types';
import {achievementFields, removedVehicles, searchResultsLimit, tempIdPattern, tempNamePattern} from 'constants/app';
import cn from 'classnames';
import {Component, createRef, h} from 'preact';
import {
	fetchAchievements,
	fetchAchievementDescriptions,
	fetchVehicleInfo,
	fetchVehicleStatsByAccountId,
	search
} from 'helpers/fetch-data';
import type {Props, State} from './types';
import Record from 'components/Record';
import styles from './App.less';
import Tab from 'components/Tabs/Tab';
import Tabs from 'components/Tabs';

export class App extends Component<Props, State> {
	search = createRef();

	// переменная, в которой хранится таймаут поиска
	searchTimeout: any = null;

	constructor (props: Props) {
		super(props);

		const accounts = JSON.parse(localStorage.getItem('accounts') || '[]') || [];
		const selectedAccountId = accounts.length ? accounts[0].id : null;

		this.state = {
			accounts,
			achievements: [],
			achievementDescriptions: {},
			loading: true,
			currentAccount: localStorage.getItem('selectedAccountId') || selectedAccountId,
			searchResults: [],
			sortField: 'hitsPercentage',
			vehicleInfo: {},
			vehicleStats: []
		};
	}

	componentDidMount () {
		// загрузка информации
		this.loadData();
	}

	/**
	 * Загружает общую информацию о технике и достижениях, а также достижения и статистику по всей когда-либо
	 * приобретенной технике.
	 */
	loadData () {
		const {achievementDescriptions, currentAccount, vehicleInfo} = this.state;

		// загрузка достижений и статистики по технике учетной записи
		if (currentAccount && accountIdIsPermanent(currentAccount)) {
			// достижения
			fetchAchievements(currentAccount)
				.then(this.setAchievements)
				.catch(logError);

			// статистика по технике
			fetchVehicleStatsByAccountId(currentAccount)
				.then(this.setVehicleStats)
				.catch(logError);
		}

		// загрузка описаний достижений
		if (Object.keys(achievementDescriptions).length === 0) {
			fetchAchievementDescriptions()
				.then(this.setAchievementDescriptions)
				.catch(logError);
		}

		// загрузка информации о технике
		if (Object.keys(vehicleInfo).length === 0) {
			fetchVehicleInfo()
				.then(this.setVehicleInfo)
				.catch(logError);
		}
	}

	// Сеттеры отдельных свойств состояния. Оформлены как отдельные функции только ради повышения
	// удобочитаемости загрузчика (`loadData`).
	setAchievements = (achievements: Array<VehicleAchievements>): void => {
		const {vehicleStats} = this.state;

		// Хрупкая логика здесь и в `setVehicleStats`: загрузка завершена когда есть и статистика, и достижения.
		this.setState({
			achievements,
			loading: vehicleStats.length === 0 && achievements.length > 0
		});
	};

	setAchievementDescriptions = (achievementDescriptions: AchievementDescriptions): void => {
		this.setState({achievementDescriptions});
	};

	setSearchResults = (searchResults: Array<Option>): void => {
		this.setState({searchResults});
	};

	setVehicleInfo = (vehicleInfo: VehicleInfo): void => {
		this.setState({vehicleInfo});
	};

	setVehicleStats = (vehicleStats: Array<VehicleStats>): void => {
		const {achievements} = this.state;

		// Хрупкая логика здесь и в `setAchievements`: загрузка завершена когда есть и статистика, и достижения.
		this.setState({
			vehicleStats,
			loading: achievements.length === 0 && vehicleStats.length > 0
		});
	};

	// Вспомогательные функции
	/**
	 * Запускает поиск.
	 * @param {string} value - поисковый запрос.
	 */
	delayedSearch = (value: string) => () => {
		const {accounts} = this.state;

		search(value, searchResultsLimit + countPermanentAccounts(accounts))
			.then(this.setSearchResults)
			.catch(logError);
	};

	/**
	 * Возвращает `true`, если данные получены. Иначе - `false`.
	 */
	dataLoaded (): boolean {
		const {achievementDescriptions, vehicleInfo} = this.state;
		return Object.keys(achievementDescriptions).length > 0 && Object.keys(vehicleInfo).length > 0;
	}

	/**
	 * Получает идентификаторы достижений по идентификатору техники.
	 * @returns {Array<string>} - возвращает массив идентификаторов достижений.
	 *
	 * При использовании общего состояния приложения можно было бы подключить нужный компонент к нему, а не передавать
	 * информацию через свойства. Сделано так для простоты.
	 */
	getAchievements (vehicleId: number): Array<string> {
		const {achievements} = this.state;
		const vehicleAchievements = achievements.find(item => item.vehicleId === vehicleId);

		return vehicleAchievements ? Object.keys(vehicleAchievements.achievements) : [];
	}

	/**
	 * Возвращает название техники по ее идентификатору. Если название не найдено (техника удалена), используется
	 * объект с информацией об удаленной технике (информация об удаленной технике получена опытным путем и не
	 * загружается постредством `API`). Если название не найдено и в объекте с информацией об удаленной технике,
	 * возвращается идентификатор.
	 */
	getVehicleName (vehicleId: number): string {
		const {vehicleInfo} = this.state;
		const id = String(vehicleId);

		if (vehicleInfo[id]) {
			return vehicleInfo[id].name;
		} else if (removedVehicles[id]) {
			return removedVehicles[id];
		}

		return vehicleId.toString();
	}

	/**
	 * Возвращает адрес миниатюры техники по ее идентификатору или пустую строку, если миниатюры нет.
	 */
	getVehiclePreview (vehicleId: number): string {
		const {vehicleInfo} = this.state;
		return vehicleInfo[vehicleId] ? vehicleInfo[vehicleId].preview : '';
	}

	/**
	 * Устанавливает фокус в поле поиска спустя треть секунды после его вывода.
	 * Использование атрибута `autoFocus` у поля ввода не всегда возможно (в консоль браузера выводится
	 * сообщение `Autofocus processing was blocked because a document already has a focused element`).
	 */
	setFocusToSearchInput () {
		setTimeout(() => {
			this.search.current && this.search.current.focus();
		}, 300);
	}

	/**
	 * Сортирует массив объектов со статистикой по технике по выбранному ключу. Пока ключ не выбирается динамически
	 * и всегда соответствует статистике попаданий (`hitsPercentage`).
	 */
	sort (data: Array<VehicleStats>): Array<VehicleStats> {
		const {sortField} = this.state;
		return data.sort((a, b) => {
			if (a[sortField] === b[sortField]) {
				return 0;
			}

			return a[sortField] < b[sortField] ? -1 : 1;
		});
	}

	// Обработчики событий
	/**
	 * Обработчик создания новой вкладки для учетной записи.
	 */
	handleAccountAdd = () => {
		try {
			const {accounts} = this.state;

			// временные идентификаторы
			const tempIds = accounts.map(account => account.id).filter(id => accountIdIsPermanent(id) === false);

			// числа в конце временных идентификаторов
			const numbers = tempIds.map(id => parseInt(id.replace(tempIdPattern, ''), 10)).map(Number);

			// следующее число выбирается как максимальное плюс единица
			const nextNumber = numbers.length ? Math.max(...numbers) + 1 : 1;

			// новый временный идентификатор учетной записи
			const newId = `${tempIdPattern}${nextNumber}`;

			// новый объект с идентификаторами и именами
			const newAccounts = [
				...accounts,
				{
					id: newId,
					name: `${tempNamePattern} ${nextNumber}`
				}
			];

			// сохранение в хранилище
			localStorage.setItem('accounts', JSON.stringify(newAccounts));

			// обновление состояни и переключение на созданную вкладку
			this.setState(
				{accounts: newAccounts},
				() => this.handleAccountChange(newAccounts.length - 1)
			);
		} catch (e) {
			console.log(`Ошибка при операции с хранилищем: ${e.message}`);
		}
	};

	/**
	 * Обработчик события смены активной учетной записи. Запускает загрузку данных выбранной учетной записи.
	 * @param {number} index - индекс выбранной вкладки.
	 */
	handleAccountChange = (index: number) => {
		const {accounts} = this.state;

		if (accounts.length) {
			// получаем идентификатор выбранной учетной записи
			const accountId = accounts[index].id;

			if (accountId) {
				// сохраняем выбранное значение в локальное хранилище, чтобы при обновлении
				// страницы не нужно было выбирать его снова
				localStorage.setItem('selectedAccountId', accountId);

				// сохраняем значение в состояние компонента и запускаем загрузку данных
				this.setState(
					{
						achievements: [],
						currentAccount: accountId,
						loading: true,
						vehicleStats: []
					},
					() => this.loadData()
				);
			} else {
				// удаляем информацию из локального хранилища, т.к. нужного идентификатора все равно уже нет
				localStorage.removeItem('selectedAccountId');
			}
		} else {
			// удаляем информацию из локального хранилища, т.к. все учетные записи удалены
			localStorage.removeItem('selectedAccountId');
		}
	};

	/**
	 * Обработчик выбора результата поиска. При выборе редактируется текущая вкладка.
	 * @param {Option} accountInfo - выбранный результат поиска.
	 */
	handleAccountEdit = (accountInfo: Option) => () => {
		const {currentAccount} = this.state;
		const {title, value} = accountInfo;

		// поиск индекса учетной записи для изменения
		const {accounts} = this.state;

		let accountToEdit;

		if (accounts.length) {
			accountToEdit = accounts.findIndex(account => account.id === currentAccount);
		} else {
			accountToEdit = 0;
		}

		if (accountToEdit >= 0) {
			// замена временного объекта для вывода вкладки действительным объектом
			const newAccounts = [
				...accounts.slice(0, accountToEdit),
				{id: value, name: title},
				...accounts.slice(accountToEdit + 1)
			];

			// сохранение информации в состояние приложения, обновление данных в хранилище и загрузка
			// данных для созданной вкладки
			this.setState(
				{
					accounts: newAccounts,
					currentAccount: value,
					loading: true,
					searchResults: []
				},
				() => {
					// обновление информации об учетных записях и выбранной учетной записи в локальном хранилище
					localStorage.setItem('accounts', JSON.stringify(newAccounts));
					localStorage.setItem('selectedAccountId', value);

					// загрузка данных для выбранной учетной записи
					this.loadData();
				}
			);
		}
	};

	/**
	 * Обработчик закрытия вкладки. Формирует новый объект с информацией об учетных записях и переключает
	 * выбранную вкладку, если это необходимо.
	 * @param {number} index - индекс закрываемой вкладки.
	 * @param {number} newActiveTabIndex - новый индекс выбранной вкладки.
	 */
	handleAccountRemove = (index: number, newActiveTabIndex: number) => {
		const {accounts} = this.state;

		// новый объект с идентификаторами и именами
		const newAccounts = [
			...accounts.slice(0, index),
			...accounts.slice(index + 1)
		];

		// обновляем состояние приложения и переключаемся на нужную вкладку
		this.setState(
			{accounts: newAccounts},
			() => {
				// переключение на вкладку
				this.handleAccountChange(newActiveTabIndex);

				// обновление информации об учетных записях в локальном хранилище
				localStorage.setItem('accounts', JSON.stringify(newAccounts));
			}
		);
	};

	/**
	 * Обработчик изменения значения в поле поиска. Использует таймаут, чтобы не делать лишние запросы на сервер
	 * пока пользователь вводит поисковый запрос.
	 */
	handleSearchChange = () => {
		// очистка таймаута запуска поиска
		clearTimeout(this.searchTimeout);

		const value = this.search.current.value;

		if (value.length > 2) {
			// поиск начинается только при достаточной длине запроса
			this.searchTimeout = setTimeout(this.delayedSearch(value), 300);
		} else {
			// при недостаточной длине запроса результаты поиска обнуляются
			this.setSearchResults([]);
		}
	};

	/**
	 * Обработчик события программного обновления страницы.
	 */
	handleUpdate = () => {
		this.setState(
			{
				loading: true
			},
			() => {
				this.loadData();
			}
		);
	};

	// Методы вывода информации на страницу
	/**
	 * Выводит форму поиска и добавления учетной записи.
	 */
	renderAddAccountForm () {
		const {searchResults} = this.state;

		// вывод результатов поиска
		const results = searchResults.map((item: Option) => {
			return (
				<button
					className={styles.searchResultsItem}
					key={item.value}
					onClick={this.handleAccountEdit(item)}
					type="button"
				>
					{item.title}
				</button>
			);
		});

		this.setFocusToSearchInput();

		// вывод формы с результатами поиска
		return (
			<form className={styles.addAccountForm} onSubmit={event => event.preventDefault()}>
				<div className={styles.addAccountFormField}>
					<label htmlFor="accountId">Имя пользователя</label>
					<input
						autoComplete="off"
						id="accountId"
						name="accountId"
						onKeyUp={this.handleSearchChange}
						ref={this.search}
						type="text"
					/>
					<div className={styles.searchResults}>
						{results}
					</div>
				</div>
			</form>
		);
	}

	/**
	 * Выводит на страницу основную часть таблицы.
	 */
	renderContent () {
		const {achievementDescriptions, vehicleStats} = this.state;
		const stats = this.sort(vehicleStats);
		return stats.map<typeof Record>(this.renderRecord(achievementDescriptions));
	}

	/**
	 * Выводит на страницу заголовок таблицы.
	 */
	renderHead () {
		const {achievementDescriptions, currentAccount} = this.state;

		if (accountIdIsPermanent(currentAccount)) {
			const cells = achievementFields.map((item: string, index: number) => {
				return <span className="l-cell" key={index}>{achievementDescriptions[item].name}</span>;
			});

			const percentageCN = cn([styles.percentage, 't-right']);

			return (
				<div className={styles.head}>
					<div className={styles.titleAndPercentage}>
						<span className={styles.title}>Техника</span>
						<span className={percentageCN}>Процент попадания</span>
					</div>
					<div className={styles.achievements}>{cells}</div>
				</div>
			);
		}
	}

	renderNoDataMessage () {
		const {loading} = this.state;

		if (loading === false) {
			return (
				<div className={styles.noDataMessage}>
					Не удалось получить данные для этой учетной записи. Возможно, она была удалена.
				</div>
			);
		}

		return null;
	}

	/**
	 * Выводит отдельную запись о технике.
	 */
	renderRecord = (achievementDescriptions: AchievementDescriptions) => (item: VehicleStats) => {
		const {hitsPercentageString, id} = item;
		const achievements = this.getAchievements(id);
		const name = this.getVehicleName(id);
		const preview = this.getVehiclePreview(id);

		return (
			<Record
				achievementDescriptions={achievementDescriptions}
				achievements={achievements}
				hitsPercentage={hitsPercentageString}
				key={id}
				name={name}
				preview={preview}
			/>
		);
	};

	renderStartForm () {
		const {accounts} = this.state;

		if (accounts.length === 0) {
			return this.renderAddAccountForm();
		}
	}

	/**
	 * Выводит содержимое вкладки.
	 */
	renderTabContent (accountId: string) {
		const {currentAccount, loading, vehicleStats} = this.state;

		// если вкладка не связана с учетной записью, выводится форма поиска и добавления учетной записи
		if (accountIdIsPermanent(accountId) === false) {
			return this.renderAddAccountForm();
		}

		// если вкладка связана с учетной записью, выводятся данные этой учетной записи
		if (accountId === currentAccount) {
			return vehicleStats.length && loading === false ? this.renderTable() : this.renderNoDataMessage();
		}

		return null;
	}

	/**
	 * Выводит на страницу таблицу со статистикой.
	 */
	renderTable () {
		return (
			<div className={styles.sheet}>
				{this.renderHead()}
				{this.renderContent()}
			</div>
		);
	}

	/**
	 * Выводит вкладки с их содержимым.
	 */
	renderTabs () {
		const {accounts, currentAccount} = this.state;

		if (accounts.length) {
			// индекс выбранной вкладки
			const accountIndex = accounts.findIndex(account => account.id === currentAccount);
			const selected = accountIndex >= 0 ? accountIndex : 0;

			// вкладки и их содержимое
			const tabs = accounts.map((account: Account) => {
				const {id, name} = account;
				const content = this.renderTabContent(id);
				return <Tab key={id} caption={name}>{content}</Tab>;
			});

			return (
				<Tabs
					editable={true}
					onAdd={this.handleAccountAdd}
					onClose={this.handleAccountRemove}
					onSwitch={this.handleAccountChange}
					selected={selected}
				>
					{tabs}
				</Tabs>
			);
		}

		return null;
	}

	/**
	 * Выводит на страницу кнопку обновления.
	 */
	renderUpdateButton () {
		return <span className={styles.control}><button onClick={this.handleUpdate}>Обновить</button></span>;
	}

	render () {
		if (this.dataLoaded()) {
			return (
				<div className={styles.root}>
					{this.renderUpdateButton()}
					{this.renderTabs()}
					{this.renderStartForm()}
				</div>
			);
		}

		// Если здесь возвращать `null`, модульный тест `App.test.jsx` будет падать с сообщением
		// `ShallowWrapper::update() can only be called when wrapping one node`. Вызывать `ShallowWrapper::update`
		// необходимо, т.к. при подключении компонента `App` в `DOM` делаются `REST`-запросы, по замершению которых
		// меняется состояние компонента и он перерисовывается. `div` без содержимого не имеет размеров, но может
		// иметь отступы, если не сделан сброс в `css`. Есил отступы мешают, их можно сбросить либо глобально, либо
		// указав для этого `div`-а `css`-класс, скрывающий его визуально.
		return <div />;
	}
}

export default App;
