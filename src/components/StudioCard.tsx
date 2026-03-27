import { Link } from "react-router-dom";

// Inline Star Icon
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

interface StudioCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  category?: string;
}

const StudioCard = ({ id, name, location, price, rating, imageUrl, category }: StudioCardProps) => {
  return (
    <Link to={`/studio/${id}`} className="studio-card">
      <div className="relative overflow-hidden">
        <img src={imageUrl} alt={name} className="studio-card-img" />
        {category && <span className="studio-card-label">{category}</span>}
      </div>
      <div className="studio-card-body">
        <div className="flex justify-between items-start mb-1">
          <h3 className="studio-card-name" style={{ margin: 0 }}>{name}</h3>
          <div className="studio-card-rating">
            <StarIcon />
            {rating.toFixed(1)}
          </div>
        </div>
        <p className="studio-card-location">{location}</p>
        
        <div className="studio-card-footer">
          <div>
            <span className="studio-card-price">KES {price.toLocaleString()}</span>
            <span className="text-muted" style={{ fontSize: '0.75rem', marginLeft: '4px' }}>/ hour</span>
          </div>
          <button className="btn btn-outline btn-sm" style={{ padding: '6px 12px' }}>
            Book
          </button>
        </div>
      </div>
    </Link>
  );
};

export default StudioCard;
