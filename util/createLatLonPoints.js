// Create Lat/Lon Points
export function createLatLonPoints(center, delta, step){
    // Create Lat/Lon Points    
    const bounds = {
        north: center.lat + delta,
        south: center.lat - delta,
        east: center.lon + delta,
        west: center.lon - delta,
    };

    // it might be better to create a 2d array, getting a path for each row    
    const points = [];
    for (let lat = bounds.south; lat <= bounds.north; lat += step) {
        for (let lon = bounds.west; lon <= bounds.east; lon += step) {
            points.push({
                "lat": lat,
                "lon": lon
            });
        }
    }

    return {points, bounds}
}
    
export default createLatLonPoints