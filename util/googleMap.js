
export async function getSnappedPoints(center,snappedPoints){
    try{
        console.log(snappedPoints)
        console.log(typeof snappedPoints)
        const centerStr = `${center.lat},${center.lon}`
        const path = snappedPoints.map(elm => `${elm.location.latitude},${elm.location.longitude}`).join('|')
        console.log(path)
        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${centerStr}&zoom=12&size=400x400&key=${process.env.gapi_key}&path=color:0x0000FF|weight:5|${path}`
        console.log(url)
        return url
    }
    catch(err){
        console.error(`Could not create static map url: ${err}`)
    }    
}


export default getSnappedPoints