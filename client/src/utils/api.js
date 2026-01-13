//this helps for production ready without having to rewrite url links
export const apiFetch = (path, options = {}) =>
  fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...options,
    credentials: "include",
  });
