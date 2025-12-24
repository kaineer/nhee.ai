export const mockData = [
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

export const mockContent = [
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

export const mockNavigate: DataNode[] = [
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
          {
            type: "folder",
            name: "Проекты",
            createdAt: "2023-03-01T10:00:00Z",
            children: [
              {
                type: "leaf",
                name: "Проект А",
                createdAt: "2023-03-02T09:00:00Z",
                contentType: "markdown",
                tags: ["проект"],
                content: "# Проект А",
              },
            ],
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
    type: "folder",
    name: "Заметки",
    createdAt: "2023-04-12T11:10:00Z",
    children: [
      {
        type: "leaf",
        name: "Идеи",
        createdAt: "2023-05-01T14:00:00Z",
        contentType: "markdown",
        tags: ["идеи"],
        content: "# Идеи",
      },
    ],
  },
];
