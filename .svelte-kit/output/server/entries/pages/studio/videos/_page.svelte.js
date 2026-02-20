import { W as store_get, Z as head, Y as unsubscribe_stores } from "../../../../chunks/index2.js";
import { H as Header } from "../../../../chunks/Header.js";
import { V as Video, l as language, t as translations } from "../../../../chunks/i18n.js";
import { C as Chart_column, M as Message_square } from "../../../../chunks/message-square.js";
import { T as Trending_up } from "../../../../chunks/trending-up.js";
import { e as escape_html } from "../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let lang, t;
    let user = null;
    lang = store_get($$store_subs ??= {}, "$language", language);
    t = translations[lang];
    head("1nmuyco", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Content - Creator Studio</title>`);
      });
    });
    $$renderer2.push(`<div class="studio svelte-1nmuyco">`);
    Header($$renderer2, { user, onMenuClick: () => {
    } });
    $$renderer2.push(`<!----> <div class="studio-layout svelte-1nmuyco"><aside class="studio-sidebar svelte-1nmuyco"><nav class="svelte-1nmuyco"><a href="/studio" class="svelte-1nmuyco">`);
    Chart_column($$renderer2, { size: 20 });
    $$renderer2.push(`<!----> <span>${escape_html(t.dashboard)}</span></a> <a href="/studio/videos" class="active svelte-1nmuyco">`);
    Video($$renderer2, { size: 20 });
    $$renderer2.push(`<!----> <span>${escape_html(t.content)}</span></a> <a href="/studio/comments" class="svelte-1nmuyco">`);
    Message_square($$renderer2, { size: 20 });
    $$renderer2.push(`<!----> <span>${escape_html(t.comments)}</span></a> <a href="/studio/analytics" class="svelte-1nmuyco">`);
    Trending_up($$renderer2, { size: 20 });
    $$renderer2.push(`<!----> <span>${escape_html(t.analytics)}</span></a></nav></aside> <main class="studio-main svelte-1nmuyco"><div class="studio-header svelte-1nmuyco"><h1 class="svelte-1nmuyco">${escape_html(t.content)}</h1> <a href="/upload" class="btn-primary">${escape_html(t.uploadVideo)}</a></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading svelte-1nmuyco">${escape_html(t.loading)}</div>`);
    }
    $$renderer2.push(`<!--]--></main></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
