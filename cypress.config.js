import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      login: "autotestmail@mail.com",
      password: "Autotest1!",
    },
    viewportHeight: 1920,
    viewportWidth: 1080,
    baseUrl: "http://pokemonbattle-stage.ru",
  },
});
