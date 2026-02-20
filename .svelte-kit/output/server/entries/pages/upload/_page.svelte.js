import { $ as sanitize_props, a0 as spread_props, U as slot, W as store_get, Z as head, X as attr_class, _ as attr, Y as unsubscribe_stores } from "../../../chunks/index2.js";
import { H as Header } from "../../../chunks/Header.js";
import { S as Sidebar } from "../../../chunks/Sidebar.js";
import { I as Icon, V as Video, l as language, t as translations } from "../../../chunks/i18n.js";
import { e as escape_html } from "../../../chunks/context.js";
function Upload($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M12 3v12" }],
    ["path", { "d": "m17 8-5-5-5 5" }],
    ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "upload" },
    $$sanitized_props,
    {
      /**
       * @component @name Upload
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgM3YxMiIgLz4KICA8cGF0aCBkPSJtMTcgOC01LTUtNSA1IiAvPgogIDxwYXRoIGQ9Ik0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/upload
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let lang, t;
    let user = null;
    let sidebarOpen = true;
    let title = "";
    let description = "";
    let uploading = false;
    let dragOver = false;
    lang = store_get($$store_subs ??= {}, "$language", language);
    t = translations[lang];
    head("tziouu", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Upload Video - VibeTube</title>`);
      });
    });
    $$renderer2.push(`<div class="app svelte-tziouu">`);
    Header($$renderer2, { user, onMenuClick: () => sidebarOpen = !sidebarOpen });
    $$renderer2.push(`<!----> `);
    Sidebar($$renderer2, { isOpen: sidebarOpen, user });
    $$renderer2.push(`<!----> <main${attr_class("svelte-tziouu", void 0, { "sidebar-open": sidebarOpen })}><div class="upload-container svelte-tziouu"><div class="upload-card svelte-tziouu"><div class="header svelte-tziouu">`);
    Video($$renderer2, { size: 32 });
    $$renderer2.push(`<!----> <h1 class="svelte-tziouu">${escape_html(t.uploadVideo)}</h1></div> <form>`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div${attr_class("drop-zone svelte-tziouu", void 0, { "drag-over": dragOver })} role="button" tabindex="0">`);
    Upload($$renderer2, { size: 48 });
    $$renderer2.push(`<!----> <p class="svelte-tziouu">${escape_html(t.dragDrop)}</p> <span class="svelte-tziouu">${escape_html(lang === "ru" ? "или" : "or")}</span> <label class="file-label svelte-tziouu"><input type="file" accept="video/*"${attr("disabled", uploading, true)} class="svelte-tziouu"/> ${escape_html(t.selectFile)}</label> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="form-group svelte-tziouu"><label for="title" class="svelte-tziouu">${escape_html(t.title)} *</label> <input id="title" type="text"${attr("value", title)}${attr("placeholder", lang === "ru" ? "Введите название видео" : "Enter video title")} required${attr("disabled", uploading, true)} class="svelte-tziouu"/></div> <div class="form-group svelte-tziouu"><label for="description" class="svelte-tziouu">${escape_html(t.description)}</label> <textarea id="description"${attr("placeholder", lang === "ru" ? "Расскажите зрителям о вашем видео" : "Tell viewers about your video")} rows="5"${attr("disabled", uploading, true)} class="svelte-tziouu">`);
    const $$body = escape_html(description);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div class="form-group svelte-tziouu"><label for="thumbnail" class="svelte-tziouu">${escape_html(t.thumbnail)} (${escape_html(lang === "ru" ? "необязательно" : "optional")})</label> <input id="thumbnail" type="file" accept="image/*"${attr("disabled", uploading, true)} class="svelte-tziouu"/> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <button type="submit" class="btn-primary svelte-tziouu"${attr("disabled", uploading, true)}>${escape_html(t.uploadVideo)}</button></form></div></div></main></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
