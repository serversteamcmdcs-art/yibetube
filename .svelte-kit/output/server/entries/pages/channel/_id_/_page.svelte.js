import { W as store_get, Z as head, X as attr_class, Y as unsubscribe_stores } from "../../../../chunks/index2.js";
import { p as page } from "../../../../chunks/stores.js";
import { H as Header } from "../../../../chunks/Header.js";
import { S as Sidebar } from "../../../../chunks/Sidebar.js";
import { l as language, t as translations } from "../../../../chunks/i18n.js";
import "../../../../chunks/VideoGrid.svelte_svelte_type_style_lang.js";
import { e as escape_html } from "../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let lang, t;
    let user = null;
    let sidebarOpen = true;
    lang = store_get($$store_subs ??= {}, "$language", language);
    t = translations[lang];
    store_get($$store_subs ??= {}, "$page", page).params.id;
    head("1v8wu38", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html("Channel")} - VibeTube</title>`);
      });
    });
    $$renderer2.push(`<div class="app svelte-1v8wu38">`);
    Header($$renderer2, { user, onMenuClick: () => sidebarOpen = !sidebarOpen });
    $$renderer2.push(`<!----> `);
    Sidebar($$renderer2, { isOpen: sidebarOpen, user });
    $$renderer2.push(`<!----> <main${attr_class("svelte-1v8wu38", void 0, { "sidebar-open": sidebarOpen })}>`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading svelte-1v8wu38">${escape_html(t.loading)}</div>`);
    }
    $$renderer2.push(`<!--]--></main></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
