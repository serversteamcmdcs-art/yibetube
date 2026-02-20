import { U as slot, V as bind_props } from "../../chunks/index2.js";
import { w as writable } from "../../chunks/index.js";
import "../../chunks/theme.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const user = writable(null);
    $$renderer2.push(`<!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { user });
  });
}
export {
  _layout as default
};
