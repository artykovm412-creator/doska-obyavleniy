import { useMemo, useState } from "react";
import AdCard, { type Ad } from "./components/AdCard";
import "./App.css";

const initialAds: Ad[] = [
  {
    id: 1,
    title: "Уютная квартира в центре",
    description: "Светлая квартира с ремонтом. Рядом магазины и остановка.",
    price: 25000,
    category: "Недвижимость",
    location: "Бишкек",
    date: "Сегодня",
    emoji: "🏡",
  },
  {
    id: 2,
    title: "Ноутбук для учёбы",
    description: "Хороший ноутбук для учёбы и повседневных задач.",
    price: 30000,
    category: "Электроника",
    location: "Бишкек",
    date: "Сегодня",
    emoji: "💻",
  },
  {
    id: 3,
    title: "Велосипед в хорошем состоянии",
    description: "Удобный велосипед для прогулок по городу.",
    price: 8500,
    category: "Транспорт",
    location: "Ош",
    date: "Вчера",
    emoji: "🚲",
  },
  {
    id: 4,
    title: "Рабочий стол",
    description: "Компактный стол для дома или студенческой комнаты.",
    price: 4500,
    category: "Дом и мебель",
    location: "Бишкек",
    date: "Вчера",
    emoji: "🪑",
  },
  {
    id: 5,
    title: "Книги для студентов",
    description: "Учебные книги в хорошем состоянии.",
    price: 1200,
    category: "Учёба",
    location: "Ош",
    date: "Сегодня",
    emoji: "📚",
  },
  {
    id: 6,
    title: "Наушники",
    description: "Наушники для музыки, занятий и просмотра видео.",
    price: 1800,
    category: "Электроника",
    location: "Бишкек",
    date: "Вчера",
    emoji: "🎧",
  },
];

const categories = [
  "Все объявления",
  "Недвижимость",
  "Электроника",
  "Транспорт",
  "Дом и мебель",
  "Учёба",
  "Другое",
];

function App() {
  const [ads, setAds] = useState<Ad[]>(() => {
    try {
      const saved = localStorage.getItem("lavanda-ads");
      return saved ? JSON.parse(saved) as Ad[] : initialAds;
    } catch {
      return initialAds;
    }
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все объявления");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("Бишкек");
  const [newCategory, setNewCategory] = useState("Электроника");

  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const matchesSearch =
        `${ad.title} ${ad.description} ${ad.location}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "Все объявления" || ad.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [ads, search, category]);

  function saveAds(updatedAds: Ad[]) {
    setAds(updatedAds);
    localStorage.setItem("lavanda-ads", JSON.stringify(updatedAds));
  }

  function addAd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericPrice = Number(price);

    if (
      !title.trim() ||
      !description.trim() ||
      price.trim() === "" ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      alert("Заполни все поля и укажи правильную цену.");
      return;
    }

    const emojis: Record<string, string> = {
      Недвижимость: "🏡",
      Электроника: "💻",
      Транспорт: "🚲",
      "Дом и мебель": "🪑",
      Учёба: "📚",
      Другое: "📦",
    };

    const newAd: Ad = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      price: numericPrice,
      category: newCategory,
      location,
      date: "Только что",
      emoji: emojis[newCategory] || "📦",
    };

    saveAds([newAd, ...ads]);

    setTitle("");
    setDescription("");
    setPrice("");
    setShowForm(false);
  }

  function deleteAd(id: number) {
    if (confirm("Удалить это объявление?")) {
      saveAds(ads.filter((ad) => ad.id !== id));
    }
  }

  return (
    <div className="site">
      <header className="header">
        <a className="logo" href="#home">
          <span className="logo-icon">Л</span>
          <span>Лаванда<span className="logo-dot">.</span></span>
        </a>

        <nav className="navigation">
          <a href="#home">Главная</a>
          <a href="#ads">Объявления</a>
          <a href="#about">О проекте</a>
        </nav>

        <button
          className="primary-button header-button"
          onClick={() => setShowForm(true)}
        >
          + Подать объявление
        </button>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">ТВОЙ ГОРОД · ТВОИ ВОЗМОЖНОСТИ</span>

            <h1>
              Найди своё.
              <br />
              <span>Поделись своим.</span>
            </h1>

            <p>
              Удобная доска объявлений, где легко найти нужное
              и разместить то, что больше не нужно.
            </p>

            <button
              className="primary-button hero-button"
              onClick={() =>
                document.getElementById("ads")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Смотреть объявления <span>→</span>
            </button>

            <div className="hero-stats">
              <div>
                <strong>{ads.length}+</strong>
                <span>объявлений</span>
              </div>
              <div>
                <strong>2</strong>
                <span>города</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>онлайн</span>
              </div>
            </div>
          </div>

          <div className="hero-art" aria-label="Иллюстрация покупок">
            <div className="art-circle"></div>
            <div className="art-card art-card-top">
              <span>🌷</span>
              <div>
                <strong>Новые возможности</strong>
                <small>Начни сегодня</small>
              </div>
            </div>
            <div className="art-emoji">🛍️</div>
            <div className="art-card art-card-bottom">
              <span>✨</span>
              <div>
                <strong>Всё рядом</strong>
                <small>Найди то, что нужно</small>
              </div>
            </div>
          </div>
        </section>

        <section className="benefits" id="about">
          <div>
            <span className="benefit-icon">🔎</span>
            <div>
              <strong>Легко найти</strong>
              <p>Удобный поиск по объявлениям</p>
            </div>
          </div>
          <div>
            <span className="benefit-icon">💜</span>
            <div>
              <strong>Просто разместить</strong>
              <p>Добавляй собственные объявления</p>
            </div>
          </div>
          <div>
            <span className="benefit-icon">📍</span>
            <div>
              <strong>Рядом с тобой</strong>
              <p>Объявления из твоего города</p>
            </div>
          </div>
        </section>

        <section className="listings" id="ads">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ВЫБИРАЙ И НАХОДИ</span>
              <h2>Свежие объявления<span>.</span></h2>
              <p>Возможно, именно здесь есть то, что ты ищешь.</p>
            </div>

            <button
              className="outline-button"
              onClick={() => setShowForm(true)}
            >
              + Разместить своё
            </button>
          </div>

          <div className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Что будем искать?"
              aria-label="Поиск объявлений"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Очистить поиск">
                ×
              </button>
            )}
          </div>

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "category active" : "category"}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="ads-grid">
            {filteredAds.map((ad) => (
              <div className="ad-wrapper" key={ad.id}>
                <AdCard ad={ad} />
                <button
                  className="delete-button"
                  onClick={() => deleteAd(ad.id)}
                >
                  Удалить объявление
                </button>
              </div>
            ))}
          </div>

          {filteredAds.length === 0 && (
            <div className="empty-state">
              <span>🌱</span>
              <h3>Пока ничего не найдено</h3>
              <p>Попробуй изменить запрос или выбрать другую категорию.</p>
            </div>
          )}

          <div className="add-banner">
            <div>
              <span>💜</span>
              <h3>Есть что предложить?</h3>
              <p>Размести объявление и найди своего покупателя.</p>
            </div>
            <button
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              Подать объявление →
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="logo" href="#home">
          <span className="logo-icon">Л</span>
          <span>Лаванда<span className="logo-dot">.</span></span>
        </a>
        <p>Находи нужное. Делись важным.</p>
        <span>Учебный проект · 2026</span>
      </footer>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowForm(false)}
              aria-label="Закрыть"
            >
              ×
            </button>

            <span className="eyebrow">ТВОЁ ОБЪЯВЛЕНИЕ</span>
            <h2 id="form-title">Подать объявление</h2>
            <p>Расскажи, что ты предлагаешь.</p>

            <form onSubmit={addAd}>
              <label>
                Название
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Например, велосипед"
                  required
                />
              </label>

              <label>
                Описание
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Расскажи подробнее..."
                  required
                />
              </label>

              <label>
                Цена в сомах
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="5000"
                  required
                />
              </label>

              <label>
                Категория
                <select
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                >
                  {categories
                    .filter((item) => item !== "Все объявления")
                    .map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                </select>
              </label>

              <label>
                Город
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                >
                  <option>Бишкек</option>
                  <option>Ош</option>
                  <option>Другой город</option>
                </select>
              </label>

              <button className="primary-button submit-button" type="submit">
                Опубликовать объявление
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;