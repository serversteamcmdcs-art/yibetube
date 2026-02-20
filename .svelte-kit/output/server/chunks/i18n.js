import { $ as sanitize_props, a2 as rest_props, a3 as attributes, a4 as clsx, a5 as ensure_array_like, a6 as element, U as slot, V as bind_props, a0 as spread_props } from "./index2.js";
import { w as fallback } from "./context.js";
import { w as writable } from "./index.js";
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function Icon($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "name",
    "color",
    "size",
    "strokeWidth",
    "absoluteStrokeWidth",
    "iconNode"
  ]);
  $$renderer.component(($$renderer2) => {
    let name = fallback($$props["name"], void 0);
    let color = fallback($$props["color"], "currentColor");
    let size = fallback($$props["size"], 24);
    let strokeWidth = fallback($$props["strokeWidth"], 2);
    let absoluteStrokeWidth = fallback($$props["absoluteStrokeWidth"], false);
    let iconNode = fallback($$props["iconNode"], () => [], true);
    const mergeClasses = (...classes) => classes.filter((className, index, array) => {
      return Boolean(className) && array.indexOf(className) === index;
    }).join(" ");
    $$renderer2.push(`<svg${attributes(
      {
        ...defaultAttributes,
        ...$$restProps,
        width: size,
        height: size,
        stroke: color,
        "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        class: clsx(mergeClasses("lucide-icon", "lucide", name ? `lucide-${name}` : "", $$sanitized_props.class))
      },
      void 0,
      void 0,
      void 0,
      3
    )}><!--[-->`);
    const each_array = ensure_array_like(iconNode);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [tag, attrs] = each_array[$$index];
      element($$renderer2, tag, () => {
        $$renderer2.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
      });
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></svg>`);
    bind_props($$props, {
      name,
      color,
      size,
      strokeWidth,
      absoluteStrokeWidth,
      iconNode
    });
  });
}
function Video($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"
      }
    ],
    [
      "rect",
      { "x": "2", "y": "6", "width": "14", "height": "12", "rx": "2" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "video" },
    $$sanitized_props,
    {
      /**
       * @component @name Video
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTMgNS4yMjMgMy40ODJhLjUuNSAwIDAgMCAuNzc3LS40MTZWNy44N2EuNS41IDAgMCAwLS43NTItLjQzMkwxNiAxMC41IiAvPgogIDxyZWN0IHg9IjIiIHk9IjYiIHdpZHRoPSIxNCIgaGVpZ2h0PSIxMiIgcng9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/video
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
const translations = {
  en: {
    // Header
    home: "Home",
    trending: "Trending",
    subscriptions: "Subscriptions",
    history: "History",
    liked: "Liked Videos",
    myVideos: "My Videos",
    watchLater: "Watch Later",
    upload: "Upload",
    login: "Sign In",
    logout: "Sign Out",
    settings: "Settings",
    studio: "Creator Studio",
    myChannel: "My Channel",
    // Video
    views: "views",
    subscribers: "subscribers",
    subscribe: "Subscribe",
    subscribed: "Subscribed",
    like: "Like",
    dislike: "Dislike",
    share: "Share",
    analytics: "Analytics",
    editVideo: "Edit Video",
    // Comments
    comments: "Comments",
    addComment: "Add a comment...",
    comment: "Comment",
    reply: "Reply",
    addReply: "Add a reply...",
    cancel: "Cancel",
    pinnedBy: "Pinned by author",
    heartComment: "Heart Comment",
    removeHeart: "Remove Heart",
    pinComment: "Pin Comment",
    unpin: "Unpin",
    // Upload
    uploadVideo: "Upload Video",
    dragDrop: "Drag and drop video file here",
    selectFile: "Select File",
    title: "Title",
    description: "Description",
    thumbnail: "Thumbnail",
    uploading: "Uploading...",
    // Settings
    profileSettings: "Profile Settings",
    channelAppearance: "Channel Appearance",
    username: "Username",
    email: "Email",
    avatarImage: "Avatar Image",
    bannerImage: "Banner Image",
    saveChanges: "Save Changes",
    currentAvatar: "Current avatar",
    currentBanner: "Current banner",
    newAvatar: "New avatar (not saved yet)",
    newBanner: "New banner (not saved yet)",
    // Studio
    dashboard: "Dashboard",
    content: "Content",
    totalViews: "Total Views",
    videos: "Videos",
    likes: "Likes",
    latestVideos: "Latest Videos",
    noVideos: "No videos yet",
    uploadFirst: "Upload your first video",
    edit: "Edit",
    delete: "Delete",
    deleteConfirm: "Delete this video?",
    // Auth
    signIn: "Sign In",
    signUp: "Sign Up",
    register: "Register",
    password: "Password",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    // Common
    loading: "Loading...",
    save: "Save",
    search: "Search",
    noResults: "No results found",
    error: "Error",
    success: "Success",
    channelNotFound: "Channel not found",
    videoNotFound: "Video not found",
    // Time
    justNow: "just now",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
    weeksAgo: "weeks ago",
    monthsAgo: "months ago",
    yearsAgo: "years ago",
    // Sidebar
    library: "Library",
    // Theme
    darkTheme: "Dark Theme",
    lightTheme: "Light Theme",
    // Studio Analytics
    overview: "Overview",
    performance: "Performance",
    // Video Stats
    video: "Video",
    views24h: "24h Views",
    totalLikes: "Total Likes",
    avgViewDuration: "Avg. View Duration",
    // Misc
    ago: "ago",
    minute: "minute",
    minutes: "minutes",
    hour: "hour",
    hours: "hours",
    day: "day",
    days: "days",
    week: "week",
    weeks: "weeks",
    month: "month",
    months: "months",
    year: "year",
    years: "years",
    // Pages
    searchResultsFor: "Search results for",
    searching: "Searching...",
    noVideosFound: "No videos found",
    noTrendingVideos: "No trending videos yet",
    noWatchHistory: "No watch history yet. Start watching videos!",
    noWatchLater: "No videos saved for later",
    noLikedVideos: "No liked videos yet. Start liking videos you enjoy!",
    yourVideos: "Your Videos",
    youHaventUploaded: "You haven't uploaded any videos yet.",
    noCommentsYet: "No comments yet",
    on: "On",
    subscribers_other: "subscribers",
    videos_other: "videos"
  },
  ru: {
    // Header
    home: "Главная",
    trending: "В тренде",
    subscriptions: "Подписки",
    history: "История",
    liked: "Понравившиеся",
    myVideos: "Мои видео",
    watchLater: "Смотреть позже",
    upload: "Загрузить",
    login: "Войти",
    logout: "Выйти",
    settings: "Настройки",
    studio: "Творческая студия",
    myChannel: "Мой канал",
    // Video
    views: "просмотров",
    subscribers: "подписчиков",
    subscribe: "Подписаться",
    subscribed: "Вы подписаны",
    like: "Нравится",
    dislike: "Не нравится",
    share: "Поделиться",
    analytics: "Аналитика",
    editVideo: "Редактировать",
    // Comments
    comments: "Комментарии",
    addComment: "Введите комментарий...",
    comment: "Комментировать",
    reply: "Ответить",
    addReply: "Введите ответ...",
    cancel: "Отмена",
    pinnedBy: "Закреплено автором",
    heartComment: "Отметить сердечком",
    removeHeart: "Убрать сердечко",
    pinComment: "Закрепить",
    unpin: "Открепить",
    // Upload
    uploadVideo: "Загрузка видео",
    dragDrop: "Перетащите видеофайл сюда",
    selectFile: "Выбрать файл",
    title: "Название",
    description: "Описание",
    thumbnail: "Превью",
    uploading: "Загрузка...",
    // Settings
    profileSettings: "Настройки профиля",
    channelAppearance: "Оформление канала",
    username: "Имя пользователя",
    email: "Email",
    avatarImage: "Аватар",
    bannerImage: "Баннер",
    saveChanges: "Сохранить изменения",
    currentAvatar: "Текущий аватар",
    currentBanner: "Текущий баннер",
    newAvatar: "Новый аватар (не сохранён)",
    newBanner: "Новый баннер (не сохранён)",
    // Studio
    dashboard: "Панель управления",
    content: "Контент",
    totalViews: "Всего просмотров",
    videos: "Видео",
    likes: "Лайки",
    latestVideos: "Последние видео",
    noVideos: "Нет видео",
    uploadFirst: "Загрузите первое видео",
    edit: "Изменить",
    delete: "Удалить",
    deleteConfirm: "Удалить это видео?",
    // Auth
    signIn: "Войти",
    signUp: "Регистрация",
    register: "Зарегистрироваться",
    password: "Пароль",
    dontHaveAccount: "Нет аккаунта?",
    alreadyHaveAccount: "Уже есть аккаунт?",
    // Common
    loading: "Загрузка...",
    save: "Сохранить",
    search: "Поиск",
    noResults: "Ничего не найдено",
    error: "Ошибка",
    success: "Успешно",
    channelNotFound: "Канал не найден",
    videoNotFound: "Видео не найдено",
    // Time
    justNow: "только что",
    minutesAgo: "минут назад",
    hoursAgo: "часов назад",
    daysAgo: "дней назад",
    weeksAgo: "недель назад",
    monthsAgo: "месяцев назад",
    yearsAgo: "лет назад",
    // Sidebar
    library: "Библиотека",
    // Theme
    darkTheme: "Темная тема",
    lightTheme: "Светлая тема",
    // Studio Analytics
    overview: "Обзор",
    performance: "Производительность",
    // Video Stats
    video: "Видео",
    views24h: "Просмотры за 24ч",
    totalLikes: "Всего лайков",
    avgViewDuration: "Ср. длительность",
    // Misc
    ago: "назад",
    minute: "минута",
    minutes: "минуты",
    hour: "час",
    hours: "часа",
    day: "день",
    days: "дня",
    week: "неделя",
    weeks: "недели",
    month: "месяц",
    months: "месяца",
    year: "год",
    years: "года",
    // Pages
    searchResultsFor: "Результаты поиска для",
    searching: "Поиск...",
    noVideosFound: "Видео не найдено",
    noTrendingVideos: "Пока нет популярных видео",
    noWatchHistory: "История просмотра пуста. Начните смотреть видео!",
    noWatchLater: "Нет видео, сохраненных для просмотра позже",
    noLikedVideos: "Пока нет понравившихся видео. Начните ставить лайки!",
    yourVideos: "Ваши видео",
    youHaventUploaded: "Вы еще не загрузили ни одного видео.",
    noCommentsYet: "Пока нет комментариев",
    on: "К",
    subscribers_other: "подписчиков",
    videos_other: "видео"
  }
};
function detectBrowserLanguage() {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("ru")) return "ru";
  return "en";
}
function createLanguageStore() {
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem("language") : null;
  const initial = stored || detectBrowserLanguage();
  const { subscribe, set } = writable(initial);
  return {
    subscribe,
    set: (lang) => {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("language", lang);
      }
      set(lang);
    }
  };
}
const language = createLanguageStore();
export {
  Icon as I,
  Video as V,
  language as l,
  translations as t
};
