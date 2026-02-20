import { W as store_get, Z as head, _ as attr, Y as unsubscribe_stores } from "../../../chunks/index2.js";
import { V as Video, l as language, t as translations } from "../../../chunks/i18n.js";
import { e as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let lang, t;
    let email = "";
    let password = "";
    let loading = false;
    lang = store_get($$store_subs ??= {}, "$language", language);
    t = translations[lang];
    head("1x05zx6", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Sign In - VibeTube</title>`);
      });
    });
    $$renderer2.push(`<div class="auth-page svelte-1x05zx6"><div class="auth-card svelte-1x05zx6"><div class="logo svelte-1x05zx6">`);
    Video($$renderer2, { size: 48 });
    $$renderer2.push(`<!----> <h1 class="svelte-1x05zx6">VibeTube</h1></div> <h2 class="svelte-1x05zx6">${escape_html(t.signIn)}</h2> <form>`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="form-group svelte-1x05zx6"><label for="email" class="svelte-1x05zx6">${escape_html(t.email)}</label> <input id="email" type="email"${attr("value", email)} required${attr("placeholder", lang === "ru" ? "Введите ваш email" : "Enter your email")}${attr("disabled", loading, true)} class="svelte-1x05zx6"/></div> <div class="form-group svelte-1x05zx6"><label for="password" class="svelte-1x05zx6">${escape_html(t.password)}</label> <input id="password" type="password"${attr("value", password)} required${attr("placeholder", lang === "ru" ? "Введите ваш пароль" : "Enter your password")}${attr("disabled", loading, true)} class="svelte-1x05zx6"/></div> <button type="submit" class="btn-primary svelte-1x05zx6"${attr("disabled", loading, true)}>${escape_html(t.signIn)}</button></form> <p class="switch svelte-1x05zx6">${escape_html(t.dontHaveAccount)} <a href="/register" class="svelte-1x05zx6">${escape_html(t.signUp)}</a></p></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
