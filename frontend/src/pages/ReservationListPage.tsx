import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import '../styles/CaravanListPage.css'; // Reuse styles for now
import { Calendar } from 'lucide-react';

interface Reservation {
    id: number;
    caravanId: number;
    startDate: string;
    endDate: string;
    status: string;
    totalPrice: number;
    caravan?: { // Optional if we expand backend to include relation, otherwise we might just show ID
        name: string;
        location: any;
    }
}

const ReservationListPage: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservations = async () => {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                navigate('/login');
                return;
            }
            const user = JSON.parse(userStr);

            try {
                const response = await client.get<Reservation[]>(`/reservations?userId=${user.id}`);
                setReservations(response.data);
            } catch (err) {
                console.error('Failed to load reservations', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [navigate]);

    if (loading) return <div className="container" style={{ paddingTop: '100px' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <h1>My Trips</h1>
            {reservations.length === 0 ? (
                <p>No trips booked yet.</p>
            ) : (
                <div className="caravan-grid">
                    {reservations.map((res) => (
                        <div key={res.id} className="caravan-card" style={{ cursor: 'default' }}>
                            <div className="card-content" style={{ padding: '1rem' }}>
                                <div className="card-header">
                                    <h3 className="card-title">Reservation #{res.id}</h3>
                                    <span className={`status-badge ${res.status.toLowerCase()}`}>{res.status}</span>
                                </div>
                                <p className="card-info"><Calendar size={14} /> {new Date(res.startDate).toLocaleDateString()} - {new Date(res.endDate).toLocaleDateString()}</p>
                                <div className="card-price">
                                    <span className="price-value">${res.totalPrice}</span> total
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReservationListPage;
