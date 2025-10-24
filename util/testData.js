import fs from 'fs/promises'

export async function writeTestData(data){
    try{
        await fs.writeFile('./testdata/routeData.json', JSON.stringify(data))        
        console.log('finished writing to testdata files')
    }catch(err){
        console.error(err)
    }
}

export async function readTestData(){
    try{
        const routeData = JSON.parse(await fs.readFile('./testdata/routeData.json', 'utf-8'))        
        console.log('finished reading testdata files')

        return routeData
    }catch(err){
        console.error(err)
    }
}

export async function readCurrentData(){
    try{

        const currentData = JSON.parse(await fs.readFile('./testdata/currentData.json', 'utf-8'))
        
        return currentData
    }catch(err){
        console.error(err)
    }
}

export async function writeCurrentData(currentData){
    try{

        await fs.writeFile('./testdata/currentData.json', JSON.stringify(currentData))
        console.log('finished writing current data')

    }catch(err){
        console.error(err)
    }
}


export default {readCurrentData, writeCurrentData, readTestData, writeTestData}