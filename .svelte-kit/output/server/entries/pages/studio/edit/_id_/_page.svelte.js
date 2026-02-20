import { W as store_get, Z as head, Y as unsubscribe_stores } from "../../../../../chunks/index2.js";
import { p as page } from "../../../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import { e as escape_html } from "../../../../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
import { H as Header } from "../../../../../chunks/Header.js";
import { l as language, t as translations } from "../../../../../chunks/i18n.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let lang, t;
    let user = null;
    lang = store_get($$store_subs ??= {}, "$language", language);
    t = translations[lang];
    store_get($$store_subs ??= {}, "$page", page).params.id;
    head("1xdndu8", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Edit Video - Creator Studio</title>`);
      });
    });
    $$renderer2.push(`<div class="studio svelte-1xdndu8">`);
    Header($$renderer2, { user, onMenuClick: () => {
    } });
    $$renderer2.push(`<!----> <div class="studio-layout svelte-1xdndu8"><main class="studio-main full-width svelte-1xdndu8"><div class="edit-container svelte-1xdndu8"><h1 class="svelte-1xdndu8">${escape_html(t.editVideo)}</h1> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading svelte-1xdndu8">${escape_html(t.loading)}</div>`);
    }
    $$renderer2.push(`<!--]--></div></main></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
