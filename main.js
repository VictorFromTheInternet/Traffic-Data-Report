import dotenv from 'dotenv'
dotenv.config()
import {getWeeklyPdf, htmlToPdfBuffer, createLocalPdf} from './util/templatePdf.js'
import sendEmail from './util/email.js'
import fs from 'fs/promises'

//
// Snap to roads (batch loop)
//
async function snapPointsToRoads(points){

    const batchSize = 100; // max amount of points per google api req
    let snappedPoints = [];

    for(let i=0; i<points.length; i+=batchSize){
        const batch = points.slice(i, i + batchSize)
        const path = batch.map(elm => `${elm.lat},${elm.lon}`).join('|') // query param for path

        try{
            const baseUrl = `https://roads.googleapis.com/v1/snapToRoads`
            const response = await fetch(`${baseUrl}?interpolate=true&path=${path}&key=${process.env.gapi_key}`)

            const data = await response.json()
            console.log(data)

            // snappedPoints = [...snappedPoints, ...data.something.map]
        }catch(err){
            console.error(`Could not snap points to roads: ${err}`)
        }
    }

    return snappedPoints

}
//snapPointsToRoads(points)


//
// Collect Data
//
async function getCurrentTrafficData(snappedPoints){
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

    



//
// Driver 
//
async function main(){
    
    // Create Lat/Lon Points
    const center = { lat: 33.998, lng: -94.966 }; // example downtown coords, +/- 0.01 lat/lng gives you ~1.1 km in each direction.
    const delta = 0.01 ;
    const bounds = {
        north: center.lat + delta,
        south: center.lat - delta,
        east: center.lng + delta,
        west: center.lng - delta,
    };

    const step = 0.002;
    const points = [];
    for (let lat = bounds.south; lat <= bounds.north; lat += step) {
    for (let lon = bounds.west; lon <= bounds.east; lon += step) {
        points.push({
            "lat": lat,
            "lon": lon
        });
    }
    }
    
    // snap to roads
    //const snappedPoints = await snapPointsToRoads(points)

    // collect current data from points


    // visualize


    // create a pdf
    const htmlStr = await getWeeklyPdf({ 
        lat:"10", 
        lon:"20",
        table:[
            {"val1":0}
        ]
    })
    const pdfBuffer = await htmlToPdfBuffer(htmlStr)


    // test, create local copy    
    createLocalPdf(pdfBuffer, './testpdfs/output.pdf')


    // email to yourself
    // await sendEmail(pdfBuffer)
}
main()