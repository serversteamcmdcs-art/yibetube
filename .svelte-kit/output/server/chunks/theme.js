import { w as writable } from "./index.js";
function getInitialTheme() {
  return "dark";
}
function createThemeStore() {
  const { subscribe, set } = writable(getInitialTheme());
  return {
    subscribe,
    set: (value) => {
      set(value);
    },
    toggle: () => {
      const next = "light";
      set(next);
    }
  };
}
const theme = createThemeStore();
export {
  theme as t
};
