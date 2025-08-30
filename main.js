import dotenv from 'dotenv'
dotenv.config()
import {getWeeklyPdf, htmlToPdfBuffer, getMappedPointsPdf, createLocalPdf} from './util/templatePdf.js'
import {getSnappedPoints, snapPointsToRoads, getCurrentTrafficData} from './util/googleMap.js'
import createLatLonPoints from './util/createLatLonPoints.js'
import sendEmail from './util/email.js'
import fs from 'fs/promises'


async function writeTestData(points, bounds, snappedPoints){
    try{
        await fs.writeFile('./testdata/points.json', JSON.stringify(points))
        await fs.writeFile('./testdata/bounds.json', JSON.stringify(bounds))
        await fs.writeFile('./testdata/snappedPoints.json', JSON.stringify(snappedPoints))
        console.log('finished writing to testdata files')
    }catch(err){
        console.error(err)
    }
}

async function readTestData(){
    try{
        const points = JSON.parse(await fs.readFile('./testdata/points.json', 'utf-8'))
        const bounds = JSON.parse(await fs.readFile('./testdata/bounds.json', 'utf-8'))
        const snappedPoints = JSON.parse(await fs.readFile('./testdata/snappedPoints.json', 'utf-8')        )
        console.log('finished writing to testdata files')

        return {points, bounds, snappedPoints}
    }catch(err){
        console.error(err)
    }
}

//
// Driver 
//
async function main(){
    
    // create points and bounds
    const center = { lat: 33.1568, lon: -94.9683 } // example downtown coords
    const delta = 0.01 // +/- 0.01 lat/lng gives you ~1.1 km in each direction, defines the bounds
    const step = 0.002 // offset for each point
    // const {points,bounds} = createLatLonPoints(center, delta, step)
        
    
    // snap to roads
    // const snappedPoints = await snapPointsToRoads(points, true) // points, interpolate    


    // write test data to files
    // await writeTestData(points, bounds, snappedPoints)

    // read test data from files
    const {points, bounds, snappedPoints} = await readTestData()
    console.log(typeof snappedPoints)
    console.log(bounds)

    // get static map img
    // const map = await getSnappedPoints(center, snappedPoints)

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
    // const htmlStr = await getMappedPointsPdf({
    //     center: center,
    //     bounds: bounds,        
    //     map: map,
    //     snappedPoints: snappedPoints
    // }) 
    // const pdfBuffer = await htmlToPdfBuffer(htmlStr)


    // test, create local copy    
    // createLocalPdf(pdfBuffer, './testpdfs/output.pdf')


    // email to yourself
    // await sendEmail(pdfBuffer)
}
main()