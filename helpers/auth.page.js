import { BasePage } from "./base.page";
import { locators } from "./locators.json";

export class AuthPage extends BasePage {
  constructor() {
    super();
    this.auth = locators.authorization;
  }

  get buttonEnter() {
    return cy.get(this.auth.btn_enter);
  }
}
