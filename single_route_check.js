import dotenv from 'dotenv'
dotenv.config()
import {getWeeklyPdf, htmlToPdfBuffer, getPdfTemplateStr, createLocalPdf} from './util/templatePdf.js'
import {getSnappedPoints, getStaticMap, snapPointsToRoads, getCurrentTrafficData, getCurrentRouteData, getCurrentTrafficDataMatrix} from './util/googleMap.js'
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

async function readCurrentData(){
    try{

        const currentData = JSON.parse(await fs.readFile('./testdata/currentData.json', 'utf-8'))
        
        return currentData
    }catch(err){
        console.error(err)
    }
}

async function writeCurrentData(currentData){
    try{

        await fs.writeFile('./testdata/currentData.json', JSON.stringify(currentData))
        console.log('finished writing current data')

    }catch(err){
        console.error(err)
    }
}

//
// Driver 
//
async function main(){
    
    // create points and bounds 5th ave NY                      
    const delta = 0.01 // +/- 0.01 lat/lng gives you ~1.1 km in each direction, defines the bounds
    const step = 0.002 // offset for each point
    const start = { lat: 40.73124319217295, lon: -73.99711744955137 }
    const end = { lat: 40.803228812387765, lon: -73.9446265187239 }
    const center = { lat: (start.lat + end.lat)/2 , lon: (start.lon + end.lon )/2 } // example downtown coords
    

    // get static map img (center, start, end, zoom, size)
    const map = await getStaticMap(center, start, end, 13, 800)
    
    // get route data
    const routeData = await getCurrentRouteData(start, end)
    console.log(routeData)

    // create a pdf    
    const htmlStr = await getPdfTemplateStr({
        center: center,        
        map: map,        
        start: start,
        end: end
    }, 'singleRoute') 
    const pdfBuffer = await htmlToPdfBuffer(htmlStr)


    // test, create local copy    
    createLocalPdf(pdfBuffer, './testpdfs/output.pdf')


    // email to yourself
    //await sendEmail(pdfBuffer)
}
main()