import { W as store_get, Z as head, X as attr_class, Y as unsubscribe_stores } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import { e as escape_html } from "../../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { H as Header } from "../../../chunks/Header.js";
import { S as Sidebar } from "../../../chunks/Sidebar.js";
import { l as language, t as translations } from "../../../chunks/i18n.js";
import "../../../chunks/VideoGrid.svelte_svelte_type_style_lang.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let lang, t;
    let user = null;
    let sidebarOpen = true;
    let searchQuery = "";
    lang = store_get($$store_subs ??= {}, "$language", language);
    t = translations[lang];
    head("e12qt1", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Search: ${escape_html(searchQuery)} - VibeTube</title>`);
      });
    });
    $$renderer2.push(`<div class="app svelte-e12qt1">`);
    Header($$renderer2, { user, onMenuClick: () => sidebarOpen = !sidebarOpen });
    $$renderer2.push(`<!----> `);
    Sidebar($$renderer2, { isOpen: sidebarOpen, user });
    $$renderer2.push(`<!----> <main${attr_class("svelte-e12qt1", void 0, { "sidebar-open": sidebarOpen })}><div class="container"><h1 class="svelte-e12qt1">${escape_html(t.searchResultsFor)} "${escape_html(searchQuery)}"</h1> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading svelte-e12qt1">${escape_html(t.searching)}</div>`);
    }
    $$renderer2.push(`<!--]--></div></main></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
