# Wotb-stats

Приложение для просмотра части статистики по технике в игре `World of Tanks Blitz`: процент попадания, уровни мастерства и некоторые другие достижения. Для получения данных используется [`API`](https://developers.wargaming.net/reference/all/wot/account/list/?r_realm=ru) `Wargaming`.

Проект сделан для себя для оттачивания навыков в стеке: `Flow`, `Preact`, `Webpack`. Отказ от `Redux` и его аналогов намеренный, чтобы исследовать, сколько можно сделать без него и с какими ограничениями и сложностями придется столкнуться.

## Подготовка

Для работы необходим `Node.js`. Если он не установлен в системе, его нужно установить. Скачать дистрибутив можно на официальном сайте [Node.js](https://nodejs.org/en/).

## Установка и запуск

Для запуска приложения потребуется:
- склонировать репозиторий с кодом приложения,
- установить модули, необходимые для сборки и запуска приложения,
- собрать приложение из командной строки.

Клонирование репозитория:

```bash
git clone git@github.com:Vakhlov/wotb-stats.git
```

Установка зависимостей:

```bash
cd wotb-stats
npm i
```

Запуск для разработки:

```bash
npm run dev
```

Запуск для использования:

```bash
npm run start
```

После запуска для использования станет доступна страница [localhost:3030](http://localhost:3030).

## Комментарии в коде

По большому счету, комментарии в коде этого проекта избыточны. Тем не менее, решено было их написать, чтобы люди, не имеющие отношения к программированию, могли понять, что происходит в коде.
