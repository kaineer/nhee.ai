import { describe, it, expect, beforeEach, vi } from "vitest";
import { createDataService } from "./dataService";
import { type DataNode } from "./types";

// Мок-данные для тестирования
const mockData: DataNode[] = [
  {
    type: "folder",
    name: "Документы",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-05-20T14:25:00Z",
    children: [
      {
        type: "folder",
        name: "Работа",
        createdAt: "2023-02-10T09:15:00Z",
        children: [
          {
            type: "leaf",
            name: "Отчет за январь",
            createdAt: "2023-01-31T17:45:00Z",
            updatedAt: "2023-02-05T11:20:00Z",
            contentType: "markdown",
            tags: ["финансы", "отчет", "январь"],
            content: "# Отчет\n## Основные показатели",
          },
        ],
      },
      {
        type: "leaf",
        name: "Личная заметка",
        createdAt: "2023-03-01T13:20:00Z",
        contentType: "html",
        tags: ["личное"],
        content: "<h1>Личная заметка</h1><p>Текст</p>",
      },
    ],
  },
  {
    type: "leaf",
    name: "Корневой файл",
    createdAt: "2023-04-12T11:10:00Z",
    contentType: "markdown",
    tags: ["тест"],
    content: "# Корневой файл",
  },
];

const createMockService = (path: string) => createDataService(mockData, path);

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
    const mockedData: DataNode[] = [
      {
        type: "leaf",
        name: "Markdown файл",
        createdAt: "2023-01-01T00:00:00Z",
        contentType: "markdown",
        tags: ["test"],
        content: "**Жирный текст** и [ссылка](https://example.com)",
      },
      {
        type: "leaf",
        name: "HTML файл",
        createdAt: "2023-01-01T00:00:00Z",
        contentType: "html",
        tags: ["test"],
        content: '<div class="test"><p>HTML content</p></div>',
      },
    ];

    it("должен корректно конвертировать markdown с форматированием", () => {
      const service = createDataService(mockedData, "/Markdown файл");
      const content = service.getContent();

      expect(content).toContain("<strong>Жирный текст</strong>");
      expect(content).toContain('<a href="https://example.com">ссылка</a>');
    });

    it("должен возвращать HTML без изменений", () => {
      const service = createDataService(mockedData, "/HTML файл");
      const content = service.getContent();

      expect(content).toBe('<div class="test"><p>HTML content</p></div>');
    });
  });
});
