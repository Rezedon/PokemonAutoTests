import { AuthPage } from "../../../helpers/auth.page";

describe("Тесты авторизации", () => {
  const pageAuth = new AuthPage();

  beforeEach(() => {
    cy.visit("/");
  });

  it("Авторизация с крректными логином и паролем", () => {
    cy.intercept("POST", "/v2/technical_routes/auth_control").as("getPokemons");

    pageAuth.typeInField(0, Cypress.env().login);
    pageAuth.typeInField(1, Cypress.env().password);
    pageAuth.clickButton("buttonEnter");
    cy.wait("@getPokemons").its("response.statusCode").should("eq", 200);
  });

  it("Токен сохраняется после успешной авторизации", () => {
    cy.intercept("POST", "/v2/technical_routes/auth_control").as("authRequest");

    pageAuth.typeInField(0, Cypress.env().login);
    pageAuth.typeInField(1, Cypress.env().password);
    pageAuth.clickButton("buttonEnter");

    cy.wait("@authRequest").its("response.statusCode").should("eq", 200);

    cy.getCookie("session_id").should("exist");

    cy.reload();
    cy.url().should("contain", "status=1");
    pageAuth.checkElemText("trainerIdNum", "2989");
  });

  it("Вход с корректным email и паролем в верхнем регистре", () => {
    cy.intercept("POST", "/v2/technical_routes/auth_control").as("getPokemons");

    pageAuth.typeInField(0, Cypress.env().login);
    pageAuth.typeInField(1, Cypress.env().password.toUpperCase());
    pageAuth.clickButton("buttonEnter");
    pageAuth.checkElemText("errorSubmit", "Неверные логин или пароль");

    cy.wait("@getPokemons").its("response.statusCode").should("eq", 401);
  });

  it("Авторизация с пустыми логином и паролем", () => {
    pageAuth.typeInField(0, "{backspace}");
    pageAuth.typeInField(1, "{backspace}");
    pageAuth.clickButton("buttonEnter");
    pageAuth.checkCssForValue(
      "hellpEmailText",
      "color",
      pageAuth.base.error_color,
      0
    );
    pageAuth.checkElemText("hellpEmailText", "Введите почту");
  });

  it("Авторизация с некорректным email", () => {
    pageAuth.typeInField(0, "Autotest");
    pageAuth.typeInField(1, Cypress.env().password);
    pageAuth.clickButton("buttonEnter");
    pageAuth.checkCssForValue(
      "hellpEmailText",
      "color",
      pageAuth.base.error_color
    );
    pageAuth.checkElemText("hellpEmailText", "Введите корректную почту");
  });

  it("Авторизация с некорректным паролем", () => {
    pageAuth.typeInField(0, Cypress.env().login);
    pageAuth.typeInField(1, "somePassword");
    pageAuth.clickButton("buttonEnter");
    pageAuth.checkElemText("errorSubmit", "Неверные логин или пароль");
  });

  it("Ошибка при несуществующем email", () => {
    pageAuth.typeInField(0, "SomeEmail@mail.ru");
    pageAuth.typeInField(1, Cypress.env().password);
    pageAuth.clickButton("buttonEnter");
    pageAuth.checkElemText("errorSubmit", "Неверные логин или пароль");
  });

  it("Ошибка при слишком длинном пароле", () => {
    const longPassword = "a".repeat(65);
    cy.log(longPassword);
    pageAuth.typeInField(0, Cypress.env().login);
    pageAuth.typeInField(1, longPassword);
    pageAuth.clickButton("buttonEnter");
    pageAuth.checkElemText("errorSubmit", "Неверные логин или пароль");
  });

  it("Попытка XSS-инъекции в поля email и пароль", () => {
    const xssPayload = "<script>alert('XSS')</script>";

    pageAuth.typeInField(0, xssPayload);
    pageAuth.typeInField(1, xssPayload);
    pageAuth.clickButton("buttonEnter");

    cy.on("window:alert", (alertText) => {
      expect(alertText).not.to.eq("XSS");
    });
    pageAuth.checkElemText("hellpEmailText", "Введите корректную почту");
  });

  it("6 неудачных попыток входа", () => {
    for (let i = 0; i < 5; i++) {
      pageAuth.typeInField(0, Cypress.env().login);
      pageAuth.typeInField(1, "somePassword");
      pageAuth.clickButton("buttonEnter");
      pageAuth.checkElemText("errorSubmit", "Неверные логин или пароль");
    }
    pageAuth.typeInField(0, Cypress.env().login);
    pageAuth.typeInField(1, "somePassword");
    pageAuth.clickButton("buttonEnter");
    pageAuth.checkElemText("errorSubmit", "Неверные логин или пароль");
  });
});
