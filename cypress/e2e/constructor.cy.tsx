describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запросы и подставляем моковые данные
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients-response.json' }).as('getIngredients');
    cy.intercept('GET', '/api/auth/user', (req) => {
      const token = window.localStorage.getItem('access-token');
      if (!token) {
        req.reply({ statusCode: 401, body: { message: 'Unauthorized' } });
      } else {
        req.reply({ fixture: 'user-responce.json' });
      }
    }).as('getUser');
    cy.intercept('POST', '/api/orders', { fixture: 'order-responce.json' }).as('createOrder');

    // Подставляем токен авторизации
    window.localStorage.setItem('access-token', 'mock-access-token');
    cy.setCookie('refresh-token', 'mock-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    //Очищаем токены после каждого теста
    window.localStorage.removeItem('access-token');
    cy.clearCookie('refresh-token');
  });

  it('Должен отобразить контейнер ингредиентов ингредиентов', () => {
    cy.get('[data-cy="burger_ingredients_menu"]').should('be.visible');
    cy.get('[data-cy="burger_ingredients_section"]').should('be.visible');
  });

  it('Должен подсчитать количество ингредиентов в каждой категории', () => {
    // Категории и ожидаемые количества
    const categories = [
      { name: 'булки', type: 'bun', expectedMin: 1 },
      { name: 'начинки', type: 'main', expectedMin: 1 },
      { name: 'соусы', type: 'sauce', expectedMin: 1 }
    ];

    categories.forEach(({ name, type, expectedMin }) => {
      const selector = `[data-cy="burger_ingredients_list-${name}"]`;

      cy.get(selector)
        .should('exist') // список есть в DOM
        .find(`[data-cy^="${type}-"]`) // ищем <li> внутри по типу
        .its('length') // получаем количество
        .should('be.gte', expectedMin) // сверяем с ожидаемым
    });
  });

  it('Должен добавить булку в конструктор', () => {
    // 1. Находим булку в списке ингредиентов
    cy.get('[data-cy^="bun-"]').first().as('bunIngredient');

    // 2. Кликаем "Добавить"
    cy.get('@bunIngredient').find('button').click();

    // 3. Проверяем рендер верхней булки
    cy.get('[data-cy="constructor-bun-top"]')
      .should('be.visible')
      .and('contain', 'Краторная булка N-200i (верх)');

    // 4. Проверяем рендер нижней булки
    cy.get('[data-cy="constructor-bun-bottom"]')
      .should('be.visible')
      .and('contain', 'Краторная булка N-200i (низ)');

    // 5. Проверяем общую цену заказа
    cy.get('[data-cy="constructor-price"]')
      .should('have.text', '2510');

    // 6. Проверяем, что кнопка "Оформить заказ" отключена
    cy.get('[data-cy="order-button"]')
      .should('be.disabled')
      .and('have.attr', 'disabled');
  });

  it('Должен добавить основной ингридиент и соус в конструктор', () => {
    // 1. Находим основной ингридиент в списке ингредиентов
    // Кликаем "Добавить"
    cy.get('[data-cy^="main-"]').first().as('mainIngredient');
    cy.get('@mainIngredient').find('button').click();

    // 2. Находим соус в списке ингредиентов
    // Кликаем "Добавить"
    cy.get('[data-cy^="sauce-"]').first().as('sauceIngredient');
    cy.get('@sauceIngredient').find('button').click();

    // 3. Проверяем рендер ингедиентов
    cy.get('[data-cy="constructor-ingredient"]')
      .should('have.length', 2)
      .each((el) => {
        cy.wrap(el).should('be.visible');
      });

    // 4. Проверяем общую цену заказа
    cy.get('[data-cy="constructor-price"]')
      .should('have.text', '1427');

    // 5. Проверяем, что кнопка "Оформить заказ" отключена
    cy.get('[data-cy="order-button"]')
      .should('be.disabled')
      .and('have.attr', 'disabled');
  });

  it('Должен открыть модальное окно при клике на ингредиент', () => {
    // 1. Находим любой ингредиент в списке (например, булку)
    cy.get('[data-cy^="bun-"]').first().as('ingredientItem');

    // 2. Кликаем по элементу
    cy.get('@ingredientItem').click();

    // 3. Проверяем, что URL изменился на /ingredients/:id
    cy.url().should('match', /\/ingredients\/\w+/);

    // 4. Проверяем видимость модального окна
    cy.get('[data-cy="modal"]')
      .should('be.visible')

    // 5. Проверяем видимость блока с информацией об ингредиенте
    cy.get('[data-cy="ingredientDetails"]')
      .should('be.visible')

    // 6. Сверяем наименование ингредиента с тем, по которому кликнули
    cy.get('[data-cy="ingredientName"]')
      .should('be.visible')
      .should('have.text', 'Краторная булка N-200i');
  });

  it('Должен закрыть модальное окно по клику на крестик', () => {
    // 1. Открываем модальное окно (кликаем по ингредиенту)
    cy.get('[data-cy^="bun-"]').first().as('ingredientItem');
    cy.get('@ingredientItem').click();

    // 2. Проверяем появление модального окна
    cy.get('[data-cy="ingredientDetails"]').should('be.visible');
    cy.get('[data-cy="modal-close-button"]').should('be.visible').as('closeButton');

    // 3. Кликаем на крестик (кнопку закрытия)
    cy.get('@closeButton').click();

    // 4. Проверяем, что модальное окно закрылось
    cy.get('[data-cy="ingredientDetails"]').should('not.exist');

    // 5. Проверяем, что URL вернулся к корневому пути
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('Должен закрыть модальное окно по клику на оверлей', () => {
    // 1. Открываем модальное окно (кликаем по ингредиенту)
    cy.get('[data-cy^="bun-"]').first().as('ingredientItem');
    cy.get('@ingredientItem').click();

    // 2. Проверяем появление модального окна и оверлея
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-overlay"]').as('overlay');

    // 3. Кликаем на оверлей
    cy.get('@overlay').click(10, 10, { force: true });

    // 4. Проверяем, что модальное окно закрылось
    cy.get('[data-cy="modal"]').should('not.exist');

    // 5. Проверяем, что URL вернулся к корневому пути
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('Должен перенаправить на /login, если пользователь не авторизован', () => {
    // 1. Очищаем токены авторизации
    window.localStorage.removeItem('access-token');
    cy.clearCookie('refresh-token');

    // 2. Собираем бургер (булка + ингредиент)
    cy.get('[data-cy^="bun-"]').first().as('bunIngredient');
    cy.get('@bunIngredient').find('button').click();

    cy.get('[data-cy^="main-"]').first().as('mainIngredient');
    cy.get('@mainIngredient').find('button').click();

    // 3. Проверяем, что кнопка "Оформить заказ" активна
    cy.get('[data-cy="order-button"]')
      .should('not.be.disabled')
      .and('not.have.attr', 'disabled');

    // 4. Кликаем на кнопку "Оформить заказ"
    cy.get('[data-cy="order-button"]').click();

    // 5. Проверяем перенапрвление на страницу /login для входа
    cy.url().should('eq', Cypress.config().baseUrl + '/login');
  });

  it('Должен создать заказ, проверить модальное окно с номером и очистить конструктор', () => {

    // 1. Добавляем булку
    cy.get('[data-cy^="bun-"]').first().as('bunIngredient');
    cy.get('@bunIngredient').find('button').click();

    // 2. Добавляем основной ингредиент
    cy.get('[data-cy^="main-"]').first().as('mainIngredient');
    cy.get('@mainIngredient').find('button').click();

    // 3. Проверяем, что кнопка "Оформить заказ" стала активной (не disabled)
    cy.get('[data-cy="order-button"]')
      .should('not.be.disabled')
      .and('not.have.attr', 'disabled');

    // 4. Кликаем на кнопку "Оформить заказ"
    cy.get('[data-cy="order-button"]').click();

    // 5. Проверяем открытие модального окна
    cy.get('[data-cy="modal"]')
      .should('be.visible')

    // 6. Ждём завершения запроса на создание заказа
    cy.wait('@createOrder').then((interception) => {
      // Проверяем, что response существует
      if (interception.response) {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.property('order');
      } else {
        throw new Error('Не получен ответ на запрос о создании заказа');
      }
    });

    // 7. Проверяем смену содержимого модального окна на OrderDetailsUI
    cy.get('[data-cy="modal"]')
      .within(() => {
        // Проверяем видимость номера заказа и соответствие значения (берём из мокового ответа)
        cy.get('[data-cy="order-number"]')
          .should('be.visible')
          .should('have.text', '12345');
      });

    // 8. Закрываем модальное окно (кликаем на крестик)
    cy.get('[data-cy="modal-close-button"]').click();

    // 9. Проверяем, что модальное окно закрылось
    cy.get('[data-cy="modal"]').should('not.exist');

    // 10. Проверяем, что конструктор очистился:
    // нет булок
    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
    // нет ингредиентов
    cy.get('[data-cy="constructor-ingredient"]').should('have.length', 0);

    // 11. Проверяем перенаправление на страницу заказов
    cy.url().should('eq', Cypress.config().baseUrl + '/feed');
  });
});
