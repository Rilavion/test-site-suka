export const siteConfig = {
  shortName: "МСПиТ",
  ministryName: "Министерство социальной политики и труда",
  districtName: "Патриаршего федерального округа",
  hotline: "+7 (800) 200-26-24",
  email: "line@mspt-pfo.gov.local",
  address: "г. Патриарск, Соборная площадь, 4",
  hours: "Пн–Пт, 09:00–18:00 · обращения принимаются круглосуточно",
  version: "Демонстрационная версия · 2026",
  project: "RMRP",
  server: "Сервер №3 · Патрики",
  portalDescription: "Официальный RP-портал Патриаршего федерального округа",
};

export const navItems = [
  {
    id: "01",
    title: "Главная",
    description: "Портал ПФО · сервер №3 Патрики",
    path: "/",
    key: "home",
  },
  {
    id: "02",
    title: "О Министерстве",
    description: "Задачи, структура и руководство",
    path: "/ministry",
    key: "ministry",
  },
  {
    id: "03",
    title: "Подать обращение",
    description: "Расскажите о важном",
    path: "/submit",
    key: "submit",
  },
  {
    id: "04",
    title: "Проверить обращение",
    description: "Ход и результат рассмотрения",
    path: "/track",
    key: "track",
  },
  {
    id: "05",
    title: "Контакты",
    description: "Связаться с горячей линией",
    path: "/contacts",
    key: "contacts",
  },
];

export const ministryDirections = [
  {
    number: "01",
    title: "Социальная поддержка",
    body: "Координация мер помощи гражданам, семьям и людям, оказавшимся в сложной жизненной ситуации.",
  },
  {
    number: "02",
    title: "Труд и занятость",
    body: "Защита трудовых прав, содействие занятости и развитие безопасной рабочей среды.",
  },
  {
    number: "03",
    title: "Доступная среда",
    body: "Создание условий для самостоятельной и полноценной жизни каждого жителя округа.",
  },
  {
    number: "04",
    title: "Общественный диалог",
    body: "Открытая обратная связь между гражданами, институтами общества и органами власти.",
  },
];

// DEMO ONLY: replace with a real identity provider before production.
export const demoCredentials = {
  email: "admin@mspt.local",
  password: "admin",
  name: "Елена Соколова",
  role: "Главный специалист",
};
