export interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  date: string;
  emoji: string;
}

interface AdCardProps {
  ad: Ad;
}

function AdCard({ ad }: AdCardProps) {
  return (
    <article className="ad-card">
      <div className="ad-picture">
        <span>{ad.emoji}</span>
        <span className="ad-category">{ad.category}</span>
      </div>

      <div className="ad-content">
        <p className="ad-location">
          {ad.location} · {ad.date}
        </p>

        <h3>{ad.title}</h3>

        <p className="ad-description">{ad.description}</p>

        <div className="ad-bottom">
          <strong>{ad.price.toLocaleString("ru-RU")} сом</strong>
          <button
            className="details-button"
            onClick={() => alert(`${ad.title}\n\n${ad.description}`)}
          >
            Подробнее →
          </button>
        </div>
      </div>
    </article>
  );
}

export default AdCard;