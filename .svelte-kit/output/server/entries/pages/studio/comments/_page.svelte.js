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
    head("qpbc56", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Comments - Creator Studio</title>`);
      });
    });
    $$renderer2.push(`<div class="studio svelte-qpbc56">`);
    Header($$renderer2, { user, onMenuClick: () => {
    } });
    $$renderer2.push(`<!----> <div class="studio-layout svelte-qpbc56"><aside class="studio-sidebar svelte-qpbc56"><nav class="svelte-qpbc56"><a href="/studio" class="svelte-qpbc56">`);
    Chart_column($$renderer2, { size: 20 });
    $$renderer2.push(`<!----> <span>${escape_html(t.dashboard)}</span></a> <a href="/studio/videos" class="svelte-qpbc56">`);
    Video($$renderer2, { size: 20 });
    $$renderer2.push(`<!----> <span>${escape_html(t.content)}</span></a> <a href="/studio/comments" class="active svelte-qpbc56">`);
    Message_square($$renderer2, { size: 20 });
    $$renderer2.push(`<!----> <span>${escape_html(t.comments)}</span></a> <a href="/studio/analytics" class="svelte-qpbc56">`);
    Trending_up($$renderer2, { size: 20 });
    $$renderer2.push(`<!----> <span>${escape_html(t.analytics)}</span></a></nav></aside> <main class="studio-main svelte-qpbc56"><h1 class="svelte-qpbc56">${escape_html(t.comments)}</h1> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading svelte-qpbc56">${escape_html(t.loading)}</div>`);
    }
    $$renderer2.push(`<!--]--></main></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
