import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '1550px',
    height: '800px',
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
                    let url;
                    if (selectedCategory === 'Hotel') {
                        // Para hoteles, usamos un radio de 100 km (100,000 metros)
                        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.lat},${userLocation.lng}&radius=100000&type=${selectedCategory.toLowerCase()}&key=YOUR_API_KEY`;
                    } else {
                        // Para otras categorías, usamos un radio de 5000 metros
                        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.lat},${userLocation.lng}&radius=5000&type=${selectedCategory.toLowerCase()}&key=YOUR_API_KEY`;
                    }
                    const response = await fetch(url);
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
        <div className="flex justify-center items-center h-screen">
            <div className="w-4/5 flex flex-col items-center">
                <div className="mb-4">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => handleCategorySelect(category)}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2 ${selectedCategory === category ? 'bg-blue-700' : ''
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className="w-full flex">
                    <div className="w-1/2 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-2">Resultados:</h2>
                        <ul>
                            {places.map(place => (
                                <li key={place.place_id}>{place.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-1/2">
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
                                        position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }}
                                    />
                                ))}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Mapa;
