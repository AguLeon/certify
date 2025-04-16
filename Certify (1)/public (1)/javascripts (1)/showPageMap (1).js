mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    center: report.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(report.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({
            offset: 25
        })
        .setHTML(
            `<h3>${report.brand} ${report.model}</h3><p>${report.location}</p>`
        )
    )
    .addTo(map)