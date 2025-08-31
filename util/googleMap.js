//
//  get map url
//
export async function getSnappedPoints(center,snappedPoints){
    try{        
        const centerStr = `${center.lat},${center.lon}`
        // const path = multiplePaths(snappedPoints)
        const multipleMarkersStr = multipleMarkers(snappedPoints)
        const markers = `&markers=color:red|label:center|${centerStr}${multipleMarkersStr}`
        const zoom = 15
        const size = 800
        // console.log(path)
        // const url = `https://maps.googleapis.com/maps/api/staticmap?center=${centerStr}&zoom=${zoom}&size=${size}x${size}&key=${process.env.gapi_key}${path}${markers}`
        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${centerStr}&zoom=${zoom}&size=${size}x${size}&key=${process.env.gapi_key}${markers}`
        // console.log(url)
        return url
    }
    catch(err){
        console.error(`Could not create static map url: ${err}`)
    }    
}


//
// Snap to roads (batch loop)
//
export async function snapPointsToRoads(points, interpolate){

    const batchSize = 100; // max amount of points per google api req
    let snappedPoints = [];

    for(let i=0; i<points.length; i+=batchSize){
        const batch = points.slice(i, i + batchSize)
        const path = batch.map(elm => `${elm.lat},${elm.lon}`).join('|') // query param for path

        try{
            const interpolateStr = (interpolate) ? '&interpolate=true' : ''
            const baseUrl = `https://roads.googleapis.com/v1/snapToRoads`
            const response = await fetch(`${baseUrl}?path=${path}&key=${process.env.gapi_key}${interpolateStr}`)

            const data = await response.json()
                        
            if(data.snappedPoints){
                snappedPoints = [...snappedPoints, ...data.snappedPoints]
            }            
        }catch(err){
            console.error(`Could not snap points to roads: ${err}`)
        }
    }    
    
    return downsamplePath(snappedPoints)

}
//snapPointsToRoads(points)


//
// down sample road path points (every nth)
//
function downsamplePath(points){
    return points.filter((elm, ind) => !(ind % 3 === 0))
}

//
// multiple path points (every nth)
//
function multiplePaths(snappedPoints){
    try{
        let queryStr = ''
        let batchSize = 50
        for(let i=0; i<snappedPoints.length/50; i++){
            let start = i*batchSize
            // let downsampledBatch = downsamplePath(snappedPoints.slice(start, start+batchSize))
            let temp = snappedPoints.slice(start, start+batchSize).map(elm => `${elm.location.latitude},${elm.location.longitude}`).join('|')
            if(temp)
                queryStr += `&path=color:0x0000FF|weight:5|${temp}`
        }
        return queryStr
    }catch(err){
        console.error(`Could not create multiple paths for map: ${err}`)
    }    
}

//
//  create markers
//
function multipleMarkers(snappedPoints){
    try{
        let queryStr = ''
        let batchSize = 50
        for(let i=0; i<snappedPoints.length/50; i++){
            let start = i*batchSize
            // let downsampledBatch = downsamplePath(snappedPoints.slice(start, start+batchSize))
            let temp = snappedPoints.slice(start, start+batchSize).map(elm => `${elm.location.latitude},${elm.location.longitude}`).join('|')
            if(temp)
                queryStr += `&markers=color:blue|label:center|${temp}`                
        }
        return queryStr
    }catch(err){
        console.error(`Could not create multiple paths for map: ${err}`)
    }    
}


//
// Collect Data (route)
//
export async function getCurrentTrafficData(snappedPoints){

    try{
        let currData = []

        for(let i=0; i<10; i+=2){
            let START_LAT = snappedPoints[i].location.latitude
            let START_LON = snappedPoints[i].longitude.latitude
            let END_LAT = snappedPoints[i+1].location.latitude
            let END_LON = snappedPoints[i+1].location.latitude

            const baseUrl = "https://routes.googleapis.com/directions/v2:computeRoutes" 
            const response = await fetch(`${baseUrl}?key=${process.env.gapi_key}`, {
                headers: {
                    accept: "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/json",
                    "X-Goog-FieldMask":"*",
                },
                method: "POST",
                body: JSON.stringify({
                        origin: {
                            vehicleStopover: false,
                            sideOfRoad: false,
                            // address: "Mount Pleasant, TX, USA",
                            location:{
                                latitude: START_LAT,
                                longitude: START_LON
                            }
                        },
                        destination: {
                            vehicleStopover: false,
                            sideOfRoad: false,
                            // address: "Mount Pleasant, TX, USA",
                            location:{
                                latitude: END_LAT,
                                longitude: END_LON
                            }
                        },
                        travelMode: "drive",
                        routingPreference: "traffic_aware",
                        polylineQuality: "high_quality",
                        computeAlternativeRoutes: true,
                        routeModifiers: {
                            avoidTolls: false,
                            avoidHighways: false,
                            avoidFerries: false,
                            avoidIndoor: false,
                        },
                    }),
            });            

            const data = await response.json()            

            currData.push(data)
        }        

        return currData
    }catch(err){
        console.error(err)
    }    

}
// getCurrentTrafficData()


//
// collect data (matrix)
//
export async function getCurrentTrafficDataMatrix(snappedPoints){
    try{


        const baseUrl = "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix" 
            const response = await fetch(`${baseUrl}?key=${process.env.gapi_key}`, {
                headers: {
                    accept: "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/json",
                    "X-Goog-FieldMask":"*",
                },
                method: "POST",
                body: JSON.stringify({	
                    "origins": [
                        {
                        "waypoint": {
                            "location": {
                            "latLng": {
                                "latitude": 37.420761,
                                "longitude": -122.081356
                            }
                            }
                        },
                        "routeModifiers": { "avoid_ferries": true}
                        },
                        {
                        "waypoint": {
                            "location": {
                            "latLng": {
                                "latitude": 37.403184,
                                "longitude": -122.097371
                            }
                            }
                        },
                        "routeModifiers": { "avoid_ferries": true}
                        }
                    ],
                    "destinations": [
                        {
                        "waypoint": {
                            "location": {
                            "latLng": {
                                "latitude": 37.420999,
                                "longitude": -122.086894
                            }
                            }
                        }
                        },
                        {
                        "waypoint": {
                            "location": {
                            "latLng": {
                                "latitude": 37.383047,
                                "longitude": -122.044651
                            }
                            }
                        }
                        }
                    ],
                    "travelMode": "DRIVE",
                    "routingPreference": "TRAFFIC_AWARE"
                }),
            });            

            const data = await response.json()   
            
            return data

    }catch(err){
        console.error(err)
    }
}

export default getSnappedPoints