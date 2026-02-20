import { W as store_get, X as attr_class, Y as unsubscribe_stores } from "../../chunks/index2.js";
import { e as escape_html } from "../../chunks/context.js";
import "clsx";
import { H as Header } from "../../chunks/Header.js";
import { S as Sidebar } from "../../chunks/Sidebar.js";
import { t as translations, l as language } from "../../chunks/i18n.js";
import "../../chunks/VideoGrid.svelte_svelte_type_style_lang.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let lang, t;
    let sidebarOpen = true;
    let user = null;
    lang = store_get($$store_subs ??= {}, "$language", language);
    t = translations[lang];
    $$renderer2.push(`<div class="app svelte-1uha8ag">`);
    Header($$renderer2, { user, onMenuClick: () => sidebarOpen = !sidebarOpen });
    $$renderer2.push(`<!----> `);
    Sidebar($$renderer2, { isOpen: sidebarOpen, user });
    $$renderer2.push(`<!----> <main${attr_class("svelte-1uha8ag", void 0, { "sidebar-open": sidebarOpen })}><div class="container svelte-1uha8ag">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading svelte-1uha8ag">${escape_html(t.loading)}</div>`);
    }
    $$renderer2.push(`<!--]--></div></main></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
