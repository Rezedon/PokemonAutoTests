import { locators } from "./locators.json";

export class BasePage {
  constructor() {
    this.base = locators;
  }

  get inputField() {
    return cy.get(this.base.input_field, { timeout: 10000 });
  }

  get hellpEmailText() {
    return cy.get(this.base.email_helper_text);
  }

  get errorSubmit() {
    return cy.get(this.base.error_submit);
  }

  get style1heading() {
    return cy.get(this.base.style_1_heading);
  }

  get trainerIdNum() {
    return cy.get(this.base.trainer_id_num);
  }
  /**
   * Метод для ввода текста в поле
   * @param {number} index - индекс поля для вввода
   * @param {string} text  - вводимый тект
   */
  typeInField(index, text) {
    // this.inputField
    //   .eq(index)
    //   .should("exist")
    //   .scrollIntoView()
    //   .clear()
    //   .type(text);
    this.inputField.eq(index).should("exist").scrollIntoView();

    this.inputField.eq(index).should("be.visible").clear({ force: true });

    this.inputField.eq(index).should("be.empty").type(text, { delay: 100 });
  }

  /**
   * Метод для клика на элемент
   * @param {string} getter - get метод необходимого элемента
   * @param {number} index  - порядковый интекс элемпента
   */
  clickButton(getter, index = 0) {
    this[getter].eq(index).scrollIntoView().click();
  }

  /**
   * Метод для проверки текста в элементах
   * @param {string} getter - гет-метод необходимого элемента
   * @param {string} text - текст для сравнения
   * @param {number} index - порядковый индекс элемента
   */
  checkElemText(getter, text, index = 0) {
    this[getter]
      .eq(index)
      .scrollIntoView()
      .should("be.visible")
      .and("contain", text);
  }
  /**
   * Метод для проверки css свойства элемента
   * @param {string} getter - гет-метод необходимого элемента
   * @param {string} css - css свойство элемента
   * @param {string} value - css значение элемента
   * @param {number} index - порядковый индекс элемента
   */
  checkCssForValue(getter, css, value, index = 0) {
    this[getter].eq(index).should("have.css", css, value);
  }
}
