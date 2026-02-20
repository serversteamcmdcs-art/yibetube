import { W as store_get, Z as head, X as attr_class, Y as unsubscribe_stores } from "../../../chunks/index2.js";
import { H as Header } from "../../../chunks/Header.js";
import { S as Sidebar } from "../../../chunks/Sidebar.js";
import { l as language, t as translations } from "../../../chunks/i18n.js";
import "../../../chunks/VideoGrid.svelte_svelte_type_style_lang.js";
import { e as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let lang, t;
    let user = null;
    let sidebarOpen = true;
    lang = store_get($$store_subs ??= {}, "$language", language);
    t = translations[lang];
    head("3r3o56", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>My Videos - VibeTube</title>`);
      });
    });
    $$renderer2.push(`<div class="app svelte-3r3o56">`);
    Header($$renderer2, { user, onMenuClick: () => sidebarOpen = !sidebarOpen });
    $$renderer2.push(`<!----> `);
    Sidebar($$renderer2, { isOpen: sidebarOpen, user });
    $$renderer2.push(`<!----> <main${attr_class("svelte-3r3o56", void 0, { "sidebar-open": sidebarOpen })}><div class="container"><h1 class="svelte-3r3o56">${escape_html(t.yourVideos)}</h1> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading svelte-3r3o56">${escape_html(t.loading)}</div>`);
    }
    $$renderer2.push(`<!--]--></div></main></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
