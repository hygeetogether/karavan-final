import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import type { Caravan } from '../types';
import '../styles/CaravanDetailPage.css';
import { Star, MapPin, Wifi, Wind, Coffee, Tv } from 'lucide-react';
import { reservationService } from '../services/reservationService';
import ReviewList from '../components/ReviewList';

const CaravanDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [caravan, setCaravan] = useState<Caravan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Reservation state
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isReserving, setIsReserving] = useState(false);

    useEffect(() => {
        const fetchCaravan = async () => {
            try {
                const response = await client.get<Caravan>(`/caravans/${id}`);
                setCaravan(response.data);
            } catch (err) {
                setError('Failed to load caravan details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCaravan();
        }
    }, [id]);

    const calculateTotal = () => {
        if (!startDate || !endDate || !caravan) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * caravan.dailyRate;
    };

    const handleReserve = async () => {
        if (!startDate || !endDate) {
            alert('Please select check-in and check-out dates.');
            return;
        }

        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('You must be logged in to reserve.');
            navigate('/login');
            return;
        }

        const user = JSON.parse(userStr);
        if (!caravan || !id) return;

        setIsReserving(true);
        try {
            const reservation = await reservationService.create({
                userId: user.id,
                caravanId: parseInt(id),
                startDate,
                endDate,
                totalPrice: calculateTotal()
            });
            // Navigate to payment page with reservation details
            navigate('/payment', { state: { reservationId: reservation.id, amount: reservation.totalPrice } });
        } catch (err) {
            console.error('Reservation failed:', err);
            alert('Reservation failed. Please try again.');
        } finally {
            setIsReserving(false);
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '100px' }}>Loading...</div>;
    if (error || !caravan) return <div className="container" style={{ paddingTop: '100px' }}>{error || 'Caravan not found'}</div>;

    // Helper to map amenity string to icon
    const getAmenityIcon = (amenity: string) => {
        const lower = amenity.toLowerCase();
        if (lower.includes('wifi')) return <Wifi size={20} />;
        if (lower.includes('air')) return <Wind size={20} />;
        if (lower.includes('kitchen')) return <Coffee size={20} />;
        if (lower.includes('tv')) return <Tv size={20} />;
        return <Star size={20} />; // Default
    };

    const total = calculateTotal();

    return (
        <div className="caravan-detail-page">
            <div className="container">
                <div className="detail-header">
                    <h1 className="detail-title">{caravan.name}</h1>
                    <div className="detail-subtitle">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Star size={16} fill="black" /> 4.9 · <span style={{ textDecoration: 'underline' }}>12 reviews</span> · <MapPin size={16} /> {caravan.location?.address}
                        </span>
                    </div>
                </div>

                <div className="detail-gallery">
                    {caravan.photos && caravan.photos.length > 0 ? (
                        <>
                            <img src={caravan.photos[0]} alt="Main view" className="gallery-item" />
                            {caravan.photos.slice(1, 5).map((photo, index) => (
                                <img key={index} src={photo} alt={`View ${index + 2}`} className="gallery-item" />
                            ))}
                            {/* Fill remaining slots if needed or just show what we have */}
                            {caravan.photos.length < 5 && Array.from({ length: 5 - caravan.photos.length }).map((_, i) => (
                                <div key={`placeholder-${i}`} className="gallery-item" style={{ backgroundColor: '#f0f0f0' }}></div>
                            ))}
                        </>
                    ) : (
                        <div className="gallery-item" style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Images</div>
                    )}
                </div>

                <div className="detail-content">
                    <div className="main-info">
                        <div className="host-info">
                            <div className="host-text">
                                <h3>Hosted by Host #{caravan.ownerId}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Superhost · 5 years hosting</p>
                            </div>
                            <div className="host-avatar">H</div>
                        </div>

                        <div className="amenities-section">
                            <h3>What this place offers</h3>
                            <div className="amenities-grid">
                                {caravan.amenities.map((amenity, idx) => (
                                    <div key={idx} className="amenity-item">
                                        {getAmenityIcon(amenity)}
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {caravan.tags && caravan.tags.length > 0 && (
                            <div className="tags-section" style={{ marginTop: '2rem' }}>
                                <h3>Special Features</h3>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {caravan.tags.map((tag, idx) => (
                                        <span key={idx} style={{
                                            backgroundColor: '#e0f2fe',
                                            color: '#0284c7',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '20px',
                                            fontSize: '0.9rem',
                                            fontWeight: '500'
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {caravan.nearbyFacilities && caravan.nearbyFacilities.length > 0 && (
                            <div className="facilities-section" style={{ marginTop: '2rem' }}>
                                <h3>Nearby Facilities</h3>
                                <div className="facilities-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {caravan.nearbyFacilities.map((facility, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '1px solid #eee', borderRadius: '8px' }}>
                                            <div style={{ color: '#666' }}>
                                                {facility.type.toLowerCase().includes('hospital') ? <span role="img" aria-label="hospital">🏥</span> :
                                                    facility.type.toLowerCase().includes('mart') ? <span role="img" aria-label="mart">🛒</span> :
                                                        facility.type.toLowerCase().includes('park') ? <span role="img" aria-label="park">🌳</span> :
                                                            <span role="img" aria-label="place">📍</span>}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>{facility.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#888' }}>{facility.distance}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="description-section">
                            <h3>About this caravan</h3>
                            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                                Escape to nature in this beautiful {caravan.name}. Perfect for a getaway with friends or family.
                                Located in {caravan.location?.address}, offering stunning views and modern amenities.
                            </p>
                        </div>

                        <div className="reviews-section" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
                            <ReviewList caravanId={parseInt(id || '0')} />
                        </div>
                    </div>

                    <div className="booking-sidebar">
                        <div className="booking-card">
                            <div className="booking-header">
                                <div>
                                    <span className="price-large">${caravan.dailyRate}</span> <span style={{ color: 'var(--text-secondary)' }}>night</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
                                    <Star size={14} fill="black" /> 4.9
                                </div>
                            </div>

                            <div className="booking-form">
                                <div className="date-picker">
                                    <input
                                        type="date"
                                        className="date-input"
                                        placeholder="Check-in"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        className="date-input"
                                        placeholder="Check-out"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={handleReserve}
                                    disabled={isReserving}
                                >
                                    {isReserving ? 'Reserving...' : 'Reserve'}
                                </button>
                            </div>

                            <div className="total-price">
                                <span>Total</span>
                                <span>${total > 0 ? total : caravan.dailyRate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaravanDetailPage;
