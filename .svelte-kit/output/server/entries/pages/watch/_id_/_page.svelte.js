import { W as store_get, X as attr_class, Y as unsubscribe_stores } from "../../../../chunks/index2.js";
import { p as page } from "../../../../chunks/stores.js";
import { H as Header } from "../../../../chunks/Header.js";
import { S as Sidebar } from "../../../../chunks/Sidebar.js";
import { l as language, t as translations } from "../../../../chunks/i18n.js";
import "../../../../chunks/VideoGrid.svelte_svelte_type_style_lang.js";
import { e as escape_html } from "../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let t;
    let user = null;
    let sidebarOpen = false;
    let currentLang = "en";
    language.subscribe((lang) => {
      currentLang = lang;
    });
    t = translations[currentLang];
    store_get($$store_subs ??= {}, "$page", page).params.id;
    $$renderer2.push(`<div class="app svelte-1oiicp0">`);
    Header($$renderer2, { user, onMenuClick: () => sidebarOpen = !sidebarOpen });
    $$renderer2.push(`<!----> `);
    Sidebar($$renderer2, { isOpen: sidebarOpen, user });
    $$renderer2.push(`<!----> <main${attr_class("svelte-1oiicp0", void 0, { "sidebar-open": sidebarOpen })}>`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading svelte-1oiicp0">${escape_html(t.loading)}</div>`);
    }
    $$renderer2.push(`<!--]--></main></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
