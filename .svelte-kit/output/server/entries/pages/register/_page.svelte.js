import { W as store_get, Z as head, _ as attr, Y as unsubscribe_stores } from "../../../chunks/index2.js";
import { V as Video, l as language, t as translations } from "../../../chunks/i18n.js";
import { e as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let lang, t;
    let username = "";
    let email = "";
    let password = "";
    let loading = false;
    lang = store_get($$store_subs ??= {}, "$language", language);
    t = translations[lang];
    head("52fghe", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Sign Up - VibeTube</title>`);
      });
    });
    $$renderer2.push(`<div class="auth-page svelte-52fghe"><div class="auth-card svelte-52fghe"><div class="logo svelte-52fghe">`);
    Video($$renderer2, { size: 48 });
    $$renderer2.push(`<!----> <h1 class="svelte-52fghe">VibeTube</h1></div> <h2 class="svelte-52fghe">${escape_html(lang === "ru" ? "Создать аккаунт" : "Create Account")}</h2> <form>`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="form-group svelte-52fghe"><label for="username" class="svelte-52fghe">${escape_html(t.username)}</label> <input id="username" type="text"${attr("value", username)} required${attr("placeholder", lang === "ru" ? "Выберите имя пользователя" : "Choose a username")}${attr("disabled", loading, true)} class="svelte-52fghe"/></div> <div class="form-group svelte-52fghe"><label for="email" class="svelte-52fghe">${escape_html(t.email)}</label> <input id="email" type="email"${attr("value", email)} required${attr("placeholder", lang === "ru" ? "Введите ваш email" : "Enter your email")}${attr("disabled", loading, true)} class="svelte-52fghe"/></div> <div class="form-group svelte-52fghe"><label for="password" class="svelte-52fghe">${escape_html(t.password)}</label> <input id="password" type="password"${attr("value", password)} required minlength="6"${attr("placeholder", lang === "ru" ? "Выберите пароль (минимум 6 символов)" : "Choose a password (min 6 characters)")}${attr("disabled", loading, true)} class="svelte-52fghe"/></div> <button type="submit" class="btn-primary svelte-52fghe"${attr("disabled", loading, true)}>${escape_html(t.signUp)}</button></form> <p class="switch svelte-52fghe">${escape_html(t.alreadyHaveAccount)} <a href="/login" class="svelte-52fghe">${escape_html(t.signIn)}</a></p></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
