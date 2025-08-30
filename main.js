import dotenv from 'dotenv'
dotenv.config()
import {getWeeklyPdf, htmlToPdfBuffer, getMappedPointsPdf, createLocalPdf} from './util/templatePdf.js'
import {getSnappedPoints, snapPointsToRoads, getCurrentTrafficData} from './util/googleMap.js'
import sendEmail from './util/email.js'
import fs from 'fs/promises'





//
// Driver 
//
async function main(){
    
    // Create Lat/Lon Points
    const center = { lat: 33.1568, lng: -94.9683 }; // example downtown coords, +/- 0.01 lat/lng gives you ~1.1 km in each direction.
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
    const snappedPoints = await snapPointsToRoads(points)    

    // get static map img
    const map = await getSnappedPoints(center, snappedPoints)

    // collect current data from points


    // visualize


    // create a pdf
    // const htmlStr = await getWeeklyPdf({ 
    //     lat:"10", 
    //     lon:"20",
    //     table:[
    //         {"val1":0}
    //     ]
    // })
    const htmlStr = await getMappedPointsPdf({
        center: center,
        bounds: bounds,        
        map: map,
        snappedPoints: snappedPoints
    }) 
    const pdfBuffer = await htmlToPdfBuffer(htmlStr)


    // test, create local copy    
    createLocalPdf(pdfBuffer, './testpdfs/output.pdf')


    // email to yourself
    // await sendEmail(pdfBuffer)
}
main()