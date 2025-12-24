import { describe, it, expect, beforeEach, vi } from "vitest";
import { createTreeService } from "./treeService";
import { type DataNode } from "./types";
import { mockData, mockContent, mockNavigate } from "./treeService.mocks";

const createMockService = (path: string) => createTreeService(mockData, path);

describe("createDataService", () => {
  describe("Корневой уровень", () => {
    it('должен возвращать тип "root" для корневого пути', () => {
      const service = createMockService("/");
      expect(service.getType()).toBe("root");
    });

    it("должен возвращать все элементы корневого уровня", () => {
      const service = createMockService("/");
      const items = service.getItems();

      expect(items).toHaveLength(2);
      expect(items[0].name).toBe("Документы");
      expect(items[1].name).toBe("Корневой файл");
    });

    it("не должен возвращать контент для корневого уровня", () => {
      const service = createMockService("/");
      expect(service.getContent()).toBeUndefined();
    });
  });

  describe("Папки", () => {
    it('должен возвращать тип "folder" для существующей папки', () => {
      const service = createMockService("/Документы");
      expect(service.getType()).toBe("folder");
    });

    it("должен возвращать содержимое папки", () => {
      const service = createMockService("/Документы");
      const items = service.getItems();

      expect(items).toHaveLength(2);
      expect(items[0].name).toBe("Работа");
      expect(items[1].name).toBe("Личная заметка");
    });

    it('должен возвращать тип "folder" для вложенной папки', () => {
      const service = createMockService("/Документы/Работа");
      expect(service.getType()).toBe("folder");
    });

    it("должен возвращать содержимое вложенной папки", () => {
      const service = createMockService("/Документы/Работа");
      const items = service.getItems();

      expect(items).toHaveLength(1);
      expect(items[0].name).toBe("Отчет за январь");
      expect(items[0].type).toBe("leaf");
    });
  });

  describe("Листовые элементы (leaf)", () => {
    it('должен возвращать тип "leaf" для файла', () => {
      const service = createMockService("/Документы/Личная заметка");
      expect(service.getType()).toBe("leaf");
    });

    it("не должен возвращать элементы для leaf", () => {
      const service = createMockService("/Документы/Личная заметка");
      const items = service.getItems();

      expect(items).toEqual([]);
    });

    it("должен возвращать HTML контент как есть", () => {
      const service = createMockService("/Документы/Личная заметка");
      const content = service.getContent();

      expect(content).toBe("<h1>Личная заметка</h1><p>Текст</p>");
    });

    it("должен конвертировать markdown в HTML", () => {
      const service = createMockService("/Документы/Работа/Отчет за январь");
      const content = service.getContent();

      // Проверяем, что markdown был сконвертирован
      expect(content).toContain("<h1>Отчет</h1>");
      expect(content).toContain("<h2>Основные показатели</h2>");
    });

    it("должен возвращать контент для корневого leaf", () => {
      const service = createMockService("/Корневой файл");
      const content = service.getContent();

      expect(content).toContain("<h1>Корневой файл</h1>");
    });
  });

  describe("Несуществующие пути", () => {
    it('должен возвращать тип "none" для несуществующего пути', () => {
      const service = createMockService("/НесуществующаяПапка");
      expect(service.getType()).toBe("none");
    });

    it("должен возвращать пустой массив для несуществующего пути", () => {
      const service = createMockService("/НесуществующаяПапка");
      expect(service.getItems()).toEqual([]);
    });

    it("не должен возвращать контент для несуществующего пути", () => {
      const service = createMockService("/НесуществующаяПапка");
      expect(service.getContent()).toBeUndefined();
    });

    it('должен возвращать "none" для частично неверного пути', () => {
      const service = createMockService("/Документы/НесуществующаяПапка");
      expect(service.getType()).toBe("none");
    });

    it('должен возвращать "none" для несуществующего вложенного пути', () => {
      const service = createMockService("/Документы/Работа/НесуществующийФайл");
      expect(service.getType()).toBe("none");
    });
  });

  describe("Пограничные случаи", () => {
    it("должен обрабатывать путь с начальным и конечным слэшами", () => {
      const service = createMockService("/Документы/");
      expect(service.getType()).toBe("folder");
    });

    it("должен обрабатывать путь с несколькими слэшами", () => {
      const service = createMockService("//Документы//Работа//");
      expect(service.getType()).toBe("folder");
    });

    it("должен обрабатывать пустой путь как корень", () => {
      const service = createMockService("");
      expect(service.getType()).toBe("root");
    });

    it("должен обрабатывать путь с пробелами", () => {
      const service = createMockService("/Документы/Работа/Отчет за январь");
      expect(service.getType()).toBe("leaf");
    });
  });

  describe("getContent для разных contentType", () => {
    it("должен корректно конвертировать markdown с форматированием", () => {
      const service = createTreeService(mockContent, "/Markdown файл");
      const content = service.getContent();

      expect(content).toContain("<strong>Жирный текст</strong>");
      expect(content).toContain('<a href="https://example.com">ссылка</a>');
    });

    it("должен возвращать HTML без изменений", () => {
      const service = createTreeService(mockContent, "/HTML файл");
      const content = service.getContent();

      expect(content).toBe('<div class="test"><p>HTML content</p></div>');
    });
  });

  describe("navigateTo", () => {
    let service = null;
    describe("Из корневого уровня", () => {
      beforeEach(() => {
        service = createTreeService(mockNavigate, "/");
      });

      it("должен возвращать путь к существующей папке из корня", () => {
        const newPath = service.navigateTo("Документы");
        expect(newPath).toBe("/Документы");
      });

      it('должен возвращать путь к папке "Заметки" из корня', () => {
        const newPath = service.navigateTo("Заметки");
        expect(newPath).toBe("/Заметки");
      });

      it("должен возвращать null при попытке перейти к несуществующему элементу из корня", () => {
        const newPath = service.navigateTo("НесуществующаяПапка");
        expect(newPath).toBeNull();
      });

      it("должен корректно обрабатывать пробелы в именах", () => {
        const newPath = service.navigateTo("Документы");
        expect(newPath).toBe("/Документы");
      });
    });

    describe("Из папки первого уровня", () => {
      beforeEach(() => {
        service = createTreeService(mockNavigate, "/Документы");
      });

      it("должен возвращать путь к вложенной папке", () => {
        const newPath = service.navigateTo("Работа");
        expect(newPath).toBe("/Документы/Работа");
      });

      it("должен возвращать путь к листовому элементу", () => {
        const newPath = service.navigateTo("Личная заметка");
        expect(newPath).toBe("/Документы/Личная заметка");
      });

      it("должен возвращать null при попытке перейти к несуществующему элементу", () => {
        const newPath = service.navigateTo("НесуществующийФайл");
        expect(newPath).toBeNull();
      });

      it("не должен позволять навигацию из leaf элемента", () => {
        service = createTreeService(mockNavigate, "/Документы/Личная заметка");
        const newPath = service.navigateTo("ЛюбойФайл");
        expect(newPath).toBeNull();
      });
    });

    describe("Из вложенной папки", () => {
      beforeEach(() => {
        service = createTreeService(mockNavigate, "/Документы/Работа");
      });

      it("должен возвращать путь к глубоко вложенному элементу", () => {
        const newPath = service.navigateTo("Проекты");
        expect(newPath).toBe("/Документы/Работа/Проекты");
      });

      it("должен возвращать путь к листу из вложенной папки", () => {
        const newPath = service.navigateTo("Отчет за январь");
        expect(newPath).toBe("/Документы/Работа/Отчет за январь");
      });

      it("должен возвращать путь к элементу на 3 уровне вложенности", () => {
        service = createTreeService(mockNavigate, "/Документы/Работа/Проекты");
        const newPath = service.navigateTo("Проект А");
        expect(newPath).toBe("/Документы/Работа/Проекты/Проект А");
      });
    });

    describe("Пограничные случаи для navigateTo", () => {
      it('должен возвращать null при попытке навигации из "none" состояния', () => {
        const service = createTreeService(mockNavigate, "/НесуществующаяПапка");
        const newPath = service.navigateTo("ЛюбойЭлемент");
        expect(newPath).toBeNull();
      });

      it("должен корректно обрабатывать пустое имя", () => {
        const service = createTreeService(mockNavigate, "/");
        const newPath = service.navigateTo("");
        expect(newPath).toBeNull();
      });

      it("должен корректно обрабатывать имя с лишними пробелами", () => {
        const service = createTreeService(mockNavigate, "/Документы");
        const newPath = service.navigateTo("  Работа  ");
        expect(newPath).toBe("/Документы/Работа");
      });

      it("должен учитывать регистр при поиске элемента", () => {
        const service = createTreeService(mockNavigate, "/");
        const newPath = service.navigateTo("документы"); // строчные буквы
        expect(newPath).toBeNull(); // или '/Документы' в зависимости от реализации (регистрозависимости)
      });
    });
  });

  describe("navigateToParent", () => {
    describe("Из корневого уровня", () => {
      it("должен возвращать null при попытке подняться выше корня", () => {
        const service = createTreeService(mockNavigate, "/");
        const parentPath = service.navigateToParent();
        expect(parentPath).toBeNull();
      });

      it("должен возвращать null для пустого пути", () => {
        const service = createTreeService(mockNavigate, "");
        const parentPath = service.navigateToParent();
        expect(parentPath).toBeNull();
      });
    });

    describe("Из папки первого уровня", () => {
      it("должен возвращать путь к корню из папки первого уровня", () => {
        const service = createTreeService(mockNavigate, "/Документы");
        const parentPath = service.navigateToParent();
        expect(parentPath).toBe("/");
      });

      it('должен возвращать путь к корню из папки "Заметки"', () => {
        const service = createTreeService(mockNavigate, "/Заметки");
        const parentPath = service.navigateToParent();
        expect(parentPath).toBe("/");
      });
    });

    describe("Из вложенной папки", () => {
      it("должен возвращать путь к родительской папке из вложенной", () => {
        const service = createTreeService(mockNavigate, "/Документы/Работа");
        const parentPath = service.navigateToParent();
        expect(parentPath).toBe("/Документы");
      });

      it("должен возвращать путь на 2 уровня вверх", () => {
        const service = createTreeService(
          mockNavigate,
          "/Документы/Работа/Проекты",
        );
        const parentPath = service.navigateToParent();
        expect(parentPath).toBe("/Документы/Работа");
      });

      it("должен возвращать путь к папке из листового элемента", () => {
        const service = createTreeService(
          mockNavigate,
          "/Документы/Работа/Отчет за январь",
        );
        const parentPath = service.navigateToParent();
        expect(parentPath).toBe("/Документы/Работа");
      });

      it("должен возвращать путь из глубоко вложенного leaf", () => {
        const service = createTreeService(
          mockNavigate,
          "/Документы/Работа/Проекты/Проект А",
        );
        const parentPath = service.navigateToParent();
        expect(parentPath).toBe("/Документы/Работа/Проекты");
      });
    });

    describe("Из leaf элемента", () => {
      it.skip("должен возвращать родительскую папку для leaf в корне", () => {
        // Если бы у нас был leaf в корне (в текущих тестовых данных нет)
        // Это тест на будущее
        const service = createTreeService(mockNavigate, "/ЛичныйФайл");
        const parentPath = service.navigateToParent();
        expect(parentPath).toBe("/");
      });
    });

    describe("Пограничные случаи для navigateToParent", () => {
      it('должен возвращать null из "none" состояния', () => {
        const service = createTreeService(mockNavigate, "/НесуществующаяПапка");
        const parentPath = service.navigateToParent();
        expect(parentPath).toBeNull();
      });

      it("должен корректно обрабатывать пути с лишними слэшами", () => {
        const service = createTreeService(
          mockNavigate,
          "//Документы//Работа//",
        );
        expect(service.getType()).toBe("folder");
        const parentPath = service.navigateToParent();
        expect(parentPath).toBe("/Документы");
      });

      it("должен корректно обрабатывать пути с пробелами на концах", () => {
        const service = createTreeService(mockNavigate, "/Документы/Работа ");
        expect(service.getType()).toBe("folder");
        const parentPath = service.navigateToParent();
        expect(parentPath).toBe("/Документы");
      });
    });
  });
});
