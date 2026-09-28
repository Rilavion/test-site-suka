# Визуальные материалы

Все изображения и шрифты входят в проект. Во время работы сайт не обращается к внешним сетям.

## Кадр Дома Правительства — `public/assets/media/government-house.jpg`

Источник: `assets-src/patriarch-district.jpg` — скриншот RMRP GTA5RP, предоставленный пользователем. Каталог `assets-src/` лежит вне `public/` и в сборку не попадает: он хранит исходники для повторной обработки.

Обработка (ImageMagick):

```sh
convert assets-src/patriarch-district.jpg \
  -crop 1560x1080+340+0 +repage -resize 1920x \
  -modulate 106,112,100 -brightness-contrast 3x8 \
  -unsharp 0x0.8+0.5+0.02 -quality 86 public/assets/media/government-house.jpg
```

Кадрирование убирает полосу игровых никнеймов в левой части экрана; коррекция возвращает закатный тон, потерянный при затемнении. Соотношение 1920×1329 выбрано специально: на вытянутых экранах кадр обрезается меньше, поэтому здание не выглядит приближённым.

`media/government-house-tiny.jpg` (48 px) — размытая миниатюра, которая показывается фоном, пока грузится основной кадр.

Используется на главной и на странице контактов.

## Колоннада — `public/assets/media/colonnade.jpg`

Создана встроенным инструментом генерации изображений для этого проекта, сжата до 1600 px.

Prompt:

> Use case: stylized-concept. Asset type: architectural editorial hero image for a premium fictional Russian government ministry website. Create a dramatic photoreal architectural close-up of a monumental ivory limestone neoclassical colonnade, 4 huge fluted columns and finely detailed cornice seen from a low angle, cropped sculptural fragment rather than a whole building. Columns on the right 70 percent of frame, left 30 percent fades into nearly black charcoal atmospheric negative space. Black background, soft warm ivory raking light from upper left, deep chiaroscuro shadows, refined realistic stone texture and carved details, subtle bronze reflections, museum-quality architectural photography. Landscape 3:2 composition. No text, no logos, no flags, no people, no watermark, no website UI.

Используется в блоке «О Министерстве» на главной и на экране служебного входа.

## Знак RMRP — `public/assets/rmrp/rmrp-forum-logo.png`

Локальная копия публичного знака форума RMRP (`https://forum.rmrp.ru/data/assets/logo/...`). Применяется как небольшая отметка принадлежности проекта: бейдж на первом экране и строка в подвале.

Четыре ссылки на вложения форума, присланные пользователем, требуют авторизации и не отдают файл по прямому запросу, поэтому сайт от них не зависит.

## Эмблема Министерства — `public/assets/branding/emblem.svg`

Векторный знак, нарисованный вручную для этого проекта: геральдический щит, звезда и неоклассический портик с четырьмя колоннами и ступенями. Не является официальным государственным гербом.

Файл используется как favicon. Те же контуры продублированы в компоненте `Mark` (`src/components/ui/Primitives.jsx`), чтобы знак наследовал цвет темы. **При замене эмблемы обновите оба места.**

## Аватары руководства

Отдельных файлов нет: профили показываются монограммами (`.monogram`) в трёх фирменных градиентах — бордовый, латунный, оливковый. Цвет задаётся полем `tone` в `src/data/leadership.js`. Чтобы поставить настоящие портреты, добавьте в данные поле с путём и выведите `<img>` вместо монограммы.

## Шрифт

Manrope Variable через npm-пакет `@fontsource-variable/manrope`, собирается в `dist/assets`. Текст интерфейса — настоящие HTML-элементы, не часть изображений. Лицензия OFL: `public/assets/branding/Manrope-OFL.txt`.
