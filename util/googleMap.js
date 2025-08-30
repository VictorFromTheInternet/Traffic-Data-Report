//
//  get map url
//
export async function getSnappedPoints(center,snappedPoints){
    try{        
        const centerStr = `${center.lat},${center.lon}`
        const path = snappedPoints.map(elm => `${elm.location.latitude},${elm.location.longitude}`).join('|')
        const zoom = 16
        // console.log(path)
        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${centerStr}&zoom=${zoom}&size=800x800&key=${process.env.gapi_key}&path=color:0x0000FF|weight:5|${path}`
        console.log(url)
        return url
    }
    catch(err){
        console.error(`Could not create static map url: ${err}`)
    }    
}


//
// Snap to roads (batch loop)
//
export async function snapPointsToRoads(points){

    const batchSize = 100; // max amount of points per google api req
    let snappedPoints = [];

    for(let i=0; i<points.length; i+=batchSize){
        const batch = points.slice(i, i + batchSize)
        const path = batch.map(elm => `${elm.lat},${elm.lon}`).join('|') // query param for path

        try{
            const baseUrl = `https://roads.googleapis.com/v1/snapToRoads`
            const response = await fetch(`${baseUrl}?interpolate=true&path=${path}&key=${process.env.gapi_key}`)

            const data = await response.json()
                        
            if(data.snappedPoints){
                snappedPoints = [...snappedPoints, ...data.snappedPoints]
            }            
        }catch(err){
            console.error(`Could not snap points to roads: ${err}`)
        }
    }    

    return snappedPoints.slice(0,50)

}
//snapPointsToRoads(points)


//
// down sample road path points (every nth)
//
function downsamplePath(points){

}

//
// multiple path points (every nth)
//
function multiplePaths(points){

}




//
// Collect Data
//
export async function getCurrentTrafficData(snappedPoints){
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
                    address: "Mount Pleasant, TX, USA",
                },
                destination: {
                    vehicleStopover: false,
                    sideOfRoad: false,
                    address: "Mount Pleasant, TX, USA",
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
    // console.log(response)

    const data = await response.json()
    console.log(data)

}
// getCurrentTrafficData()


export default getSnappedPoints