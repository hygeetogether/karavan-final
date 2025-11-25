import React, { useEffect, useState } from 'react';
import { reviewService, type Review } from '../services/reviewService';
import { Star } from 'lucide-react';

interface ReviewListProps {
    caravanId: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ caravanId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await reviewService.getByCaravanId(caravanId);
                setReviews(data);
            } catch (err) {
                console.error('Failed to load reviews', err);
            } finally {
                setLoading(false);
            }
        };

        if (caravanId) {
            fetchReviews();
        }
    }, [caravanId]);

    if (loading) return <div>Loading reviews...</div>;

    if (reviews.length === 0) {
        return <div style={{ padding: '2rem 0', color: 'var(--text-secondary)' }}>No reviews yet.</div>;
    }

    return (
        <div className="reviews-list">
            <h3>Reviews</h3>
            <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
                {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                        <div className="review-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <div className="reviewer-avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                R
                            </div>
                            <div className="reviewer-info">
                                <div style={{ fontWeight: 600 }}>Guest #{review.reviewerId}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(review.reviewDate).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="review-rating" style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={14} fill={i < review.rating ? "black" : "none"} stroke="black" />
                            ))}
                        </div>
                        <p className="review-comment" style={{ lineHeight: '1.5' }}>{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
