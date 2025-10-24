import dotenv from 'dotenv'
dotenv.config()
import {getWeeklyPdf, htmlToPdfBuffer, getPdfTemplateStr, createLocalPdf} from './util/templatePdf.js'
import {getSnappedPoints, getStaticMap, snapPointsToRoads, getCurrentTrafficData, getCurrentRouteData, getCurrentTrafficDataMatrix} from './util/googleMap.js'
import {readCurrentData,  writeCurrentData, readTestData, writeTestData} from './util/testData.js'
import getCstTimestamp from './util/dateFunctions.js'
import UploadFile from './util/awsS3.js'
import createLatLonPoints from './util/createLatLonPoints.js'
import sendEmail from './util/email.js'
import fs from 'fs/promises'
import mongoose from 'mongoose'
import ReportSchema from './models/Reports.js'



//
// Driver 
//
async function main(){
    // connect to mongodb
    await mongoose.connect(process.env.mongodb_connection)    

    
    // create points and bounds 5th ave NY                      
    const delta = 0.01 // +/- 0.01 lat/lng gives you ~1.1 km in each direction, defines the bounds
    const step = 0.002 // offset for each point
    const start = { lat: 40.73124319217295, lon: -73.99711744955137 }
    const end = { lat: 40.803228812387765, lon: -73.9446265187239 }
    const center = { lat: (start.lat + end.lat)/2 , lon: (start.lon + end.lon )/2 } // example downtown coords
    

    // get static map img (center, start, end, zoom, size)
    const map = await getStaticMap(center, start, end, 13, 800)
    
    // get route data
    //const routeData = await getCurrentRouteData(start, end)
    //await writeTestData(routeData)
    const routeData = await readTestData()    


    // create a pdf    
    const htmlStr = await getPdfTemplateStr({
        center: center,        
        map: map,        
        start: start,
        end: end,
        routeData: routeData
    }, 'singleRoute') 
    const pdfBuffer = await htmlToPdfBuffer(htmlStr)


    // test, create local copy    
    createLocalPdf(pdfBuffer, './testpdfs/output.pdf')


    // upload to s3    
    const cstTimestamp = getCstTimestamp()
    const fileName = `test/${cstTimestamp}.pdf`    
    const s3UploadResults = await UploadFile(pdfBuffer, fileName)
    console.log(s3UploadResults)

    // create record in mongodb
    const Report = mongoose.model('Report', ReportSchema)
    const newReport = Report({
        link: `https://${process.env.aws_bucket_name}.s3.${process.env.aws_region}.amazonaws.com/${fileName}`,
        start: start,
        stop: end,
        distance: routeData.routes[0].localizedValues.distance.text,
        duration: routeData.routes[0].localizedValues.duration.text
    })
    const mongoUploadResults = await newReport.save()
    console.log(mongoUploadResults)


    // email to yourself
    //await sendEmail(pdfBuffer)

    await mongoose.disconnect()
}
main()