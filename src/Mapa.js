import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '800px',
    height: '400px',
    display: 'flex'
};

const categories = ['Hotel', 'Bar/Restaurante'];

function Mapa() {
    const [userLocation, setUserLocation] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                },
                error => {
                    console.error('Error getting user location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    useEffect(() => {
        const fetchPlaces = async () => {
            if (userLocation && selectedCategory) {
                try {
                    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.lat},${userLocation.lng}&radius=5000&type=${selectedCategory.toLowerCase()}&key=YOUR_API_KEY`);
                    const data = await response.json();
                    if (data.results) {
                        setPlaces(data.results);
                    }
                } catch (error) {
                    console.error('Error fetching nearby places:', error);
                }
            }
        };

        fetchPlaces();
    }, [userLocation, selectedCategory]);

    const handleCategorySelect = category => {
        setSelectedCategory(category);
    };

    return (
        <div style={{ display: 'flex' }}>
            <div>
                {categories.map(category => (
                    <button key={category} onClick={() => handleCategorySelect(category)}>
                        {category}
                    </button>
                ))}
            </div>
            <div style={{ flex: 1 }}>
                <LoadScript googleMapsApiKey="AIzaSyCIRD1SBRGvnsSVQGwfkUjDy34Nf5ht4C4">
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={userLocation}
                        zoom={userLocation ? 12 : 4}
                    >
                        {userLocation && <Marker position={userLocation} />}
                        {/* Mostrar marcadores para los lugares en la categoría seleccionada */}
                        {places.map(place => (
                            <Marker
                                key={place.place_id}
                                position={{ lat: place.geometry.location.lat, lng: place.geometry.location.lng }}
                            />
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
}

export default Mapa;
