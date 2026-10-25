
import { useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

type Ad = {
  id: number;
  title: string;
  description: string;
  price: number;
  city: string;
  category: string;
  image: string;
};

function App() {
  const [ads, setAds] = useState<Ad[]>(() => {
    try {
      const saved = localStorage.getItem("my-ads");
      return saved ? (JSON.parse(saved) as Ad[]) : [];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  function saveAds(newAds: Ad[]) {
    try {
      localStorage.setItem("my-ads", JSON.stringify(newAds));
      setAds(newAds);
    } catch {
      alert("Не удалось сохранить данные. Попробуй фотографию поменьше.");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericPrice = Number(price);

    if (
      !title.trim() ||
      !description.trim() ||
      !city.trim() ||
      !category.trim() ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      alert("Заполни все поля и укажи цену больше нуля.");
      return;
    }

    const newAd: Ad = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      price: numericPrice,
      city: city.trim(),
      category: category.trim(),
      image,
    };

    saveAds([newAd, ...ads]);

    setTitle("");
    setDescription("");
    setPrice("");
    setCity("");
    setCategory("");
    setImage("");
    setShowForm(false);
  }

  function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Выбери файл изображения.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Размер фотографии должен быть меньше 2 МБ.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };

    reader.readAsDataURL(file);
  }

  function deleteAd(id: number) {
    const confirmed = window.confirm("Удалить это объявление?");

    if (confirmed) {
      saveAds(ads.filter((ad) => ad.id !== id));
    }
  }

  const filteredAds = ads.filter((ad) => {
    const text =
      `${ad.title} ${ad.description} ${ad.city} ${ad.category}`;

    return text.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h2>Доска объявлений</h2>

          <button
            type="button"
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Добавить объявление
          </button>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <h1>Доска объявлений</h1>
          <p>Размещай свои объявления и находи нужные вещи.</p>

          <input
            className="search-input"
            type="search"
            placeholder="Поиск объявлений..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </section>

        <section className="catalog">
          <h2>Объявления ({ads.length})</h2>

          {filteredAds.length === 0 ? (
            <div className="empty-state">
              <h3>
                {ads.length === 0
                  ? "Объявлений пока нет"
                  : "Ничего не найдено"}
              </h3>

              <p>
                {ads.length === 0
                  ? "Нажми «Добавить объявление», чтобы создать первое."
                  : "Попробуй изменить поисковый запрос."}
              </p>
            </div>
          ) : (
            <div className="ads-grid">
              {filteredAds.map((ad) => (
                <article className="ad-card" key={ad.id}>
                  {ad.image && (
                    <img
                      className="ad-photo"
                      src={ad.image}
                      alt={ad.title}
                    />
                  )}

                  <div className="ad-content">
                    <p className="ad-category">{ad.category}</p>
                    <h3>{ad.title}</h3>
                    <p>{ad.description}</p>
                    <p>Город: {ad.city}</p>
                    <strong>{ad.price.toLocaleString("ru-RU")} сом</strong>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => deleteAd(ad.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {showForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <h2>Новое объявление</h2>

              <button
                type="button"
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="title">Название</label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Введите название"
                required
              />

              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Введите описание"
                required
              />

              <label htmlFor="price">Цена в сомах</label>
              <input
                id="price"
                type="number"
                min="1"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Введите цену"
                required
              />

              <label htmlFor="city">Город</label>
              <input
                id="city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Введите город"
                required
              />

              <label htmlFor="category">Категория</label>
              <input
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Введите категорию"
                required
              />

              <label htmlFor="image">Фотография (необязательно)</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImage}
              />

              {image && (
                <div className="image-preview">
                  <img src={image} alt="Предпросмотр" />

                  <button
                    type="button"
                    onClick={() => setImage("")}
                  >
                    Убрать фото
                  </button>
                </div>
              )}

              <button className="submit-button" type="submit">
                Опубликовать
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>Доска объявлений</p>
      </footer>
    </div>
  );
}

export default App;
