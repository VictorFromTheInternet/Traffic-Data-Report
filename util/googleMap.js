//
//  get map url
//
export async function getSnappedPoints(center,snappedPoints){
    try{        
        const centerStr = `${center.lat},${center.lon}`
        const path = multiplePaths(snappedPoints)
        const zoom = 14
        const size = 800
        // console.log(path)
        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${centerStr}&zoom=${zoom}&size=${size}x${size}&key=${process.env.gapi_key}${path}`
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

    return snappedPoints

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
            let downsampledBatch = downsamplePath(snappedPoints.slice(start, start+batchSize))
            let temp = downsampledBatch.map(elm => `${elm.location.latitude},${elm.location.longitude}`).join('|')
            if(temp)
                queryStr += `&path=color:0x0000FF|weight:5|${temp}`
        }
        return queryStr
    }catch(err){
        console.error(`Could not create multiple paths for map: ${err}`)
    }    
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