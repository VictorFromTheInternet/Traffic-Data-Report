import puppeteer from 'puppeteer'
import nunjucks from 'nunjucks'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const templatesFolderPath = path.join(__dirname, '..', 'pdf_templates', 'weeklyTraffic.html' )
// console.log(templatesFolderPath)
nunjucks.configure('./pdf_templates', { autoescape: true });


export async function getMappedPoints(data){

    // call to db here

    // calculations / averages

    // get css data
    const cssPath = path.join(__dirname, '..', 'pdf_templates', 'styles.css') 
    const cssStr = await fs.readFile(cssPath, 'utf-8')

    // create pdf/html str        
    const renderedStr = await nunjucks.render('mappedPoints.html', {"styles": `<style>${cssStr}</style>`, "data":data });
    // console.log(renderedStr)
    return renderedStr
}

export async function getWeeklyPdf(data){

    // call to db here

    // calculations / averages

    // get css data
    const cssPath = path.join(__dirname, '..', 'pdf_templates', 'styles.css') 
    const cssStr = await fs.readFile(cssPath, 'utf-8')

    // create pdf/html str        
    const renderedStr = await nunjucks.render('weeklyTraffic.html', {"styles": `<style>${cssStr}</style>`, "data":data });
    // console.log(renderedStr)
    return renderedStr
}

export async function htmlToPdfBuffer(htmlStr){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlStr, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ 
        format: 'A4',
        printBackground: true 
    });
    await browser.close();

    return pdfBuffer;
}

export async function createLocalPdf(buffer, filePath){
    try{
        await fs.writeFile(filePath, buffer)
        console.log('created file:', filePath)
    }catch(err){
        console.error(err)
    }

}

export default getWeeklyPdf