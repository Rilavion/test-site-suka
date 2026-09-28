# Локальные визуальные ресурсы

## Игровой фон Патриков

Файл: `public/assets/backgrounds/patriarch-district.jpg`.

Исходник предоставлен пользователем: кадр RMRP GTA5RP с Домом правительства Патриаршего федерального округа. На главной и в шапке формы он используется как локальный фон с затемнением, кадрированием, медленным параллаксом и плавным масштабированием. Сайт не загружает изображение из внешней сети.

## Знак RMRP

Файл: `public/assets/rmrp/rmrp-forum-logo.png`.

Локальная копия публичного знака форума RMRP из `https://forum.rmrp.ru/data/assets/logo/photo_2022-03-07_17-41-13.png`. Он используется только как небольшой знак принадлежности проекта на главной; основной айдентикой портала остаётся эмблема МСПиТ. Четыре ссылки на вложения форума, присланные пользователем, требуют авторизации, поэтому сайт от них не зависит.

## Архитектурное изображение

Файл: `public/assets/ministry/colonnade.png`.
Создано встроенным инструментом imagegen для этого проекта. В приложение включена локальная копия; никаких внешних изображений или API при работе сайта нет.

Финальный prompt:

> Use case: stylized-concept. Asset type: architectural editorial hero image for a premium fictional Russian government ministry website. Create a dramatic photoreal architectural close-up of a monumental ivory limestone neoclassical colonnade, 4 huge fluted columns and finely detailed cornice seen from a low angle, cropped sculptural fragment rather than a whole building. Columns on the right 70 percent of frame, left 30 percent fades into nearly black charcoal atmospheric negative space. Black background, soft warm ivory raking light from upper left, deep chiaroscuro shadows, refined realistic stone texture and carved details, subtle bronze reflections, museum-quality architectural photography. Landscape 3:2 composition. No text, no logos, no flags, no people, no watermark, no website UI. This will sit behind real HTML typography, so keep the left half dark and restrained.

## Знак и аватары

`public/assets/branding/emblem.svg` — геометрический щит с монограммой М, созданный как локальная SVG-графика. Не официальный государственный герб.

`public/assets/leadership/profile-1.svg` … `profile-3.svg` — нейтральные геометрические аватары, а не фотографии реальных людей. Заменяются любыми локальными портретами через `src/data/leadership.js`.

Шрифт Manrope включён npm-пакетом Fontsource. Лицензия OFL находится в установленном пакете; файл лицензии также поставляется в `public/assets/branding/Manrope-OFL.txt`.
