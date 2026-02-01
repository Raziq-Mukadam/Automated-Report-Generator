import express from 'express';
import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { generatePage4, generatePage5 } from './utils/pageGenerator.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/download/pdf', async (req, res) => {
  try {
    console.log('PDF generation started...');
    
    // Fetch data from Supabase
    const { data: institutionData, error: instError } = await supabase
      .from('institution')
      .select('*')
      .single();

    const { data: programsData, error: progError } = await supabase
      .from('program')
      .select('*');

    const { data: departmentsData, error: deptError } = await supabase
      .from('department')
      .select('*');

    if (instError || progError || deptError) {
      console.error('Supabase error:', instError || progError || deptError);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    console.log('Data fetched successfully');

    // Read HTML templates
    const page1 = fs.readFileSync(path.join(__dirname, 'Template', 'page1.html'), 'utf8');
    const page2 = fs.readFileSync(path.join(__dirname, 'Template', 'page2.html'), 'utf8');
    let page3 = fs.readFileSync(path.join(__dirname, 'Template', 'page3.html'), 'utf8');
    const page4Template = fs.readFileSync(path.join(__dirname, 'Template', 'page4.html'), 'utf8');
  const page5Template = fs.readFileSync(path.join(__dirname, 'Template', 'page5.html'), 'utf8');


    // Fill page 3
    page3 = page3.replace(
      '<div class="question">1. Name and Address of the Institution:</div>',
      `<div class="question">1. Name and Address of the Institution:</div>
      <div style="margin-left: 25px; margin-top: 8px; font-size: 12px;">${institutionData.institution_name || ''}</div>`
    );

    page3 = page3.replace(
      '<div class="question">3. Year of Establishment of the Institution:</div>',
      `<div class="question">3. Year of Establishment of the Institution: <span style="font-weight: normal; margin-left: 10px;">${institutionData.year_established || ''}</span></div>`
    );

    // Generate page 4 with data
    const page4 = generatePage4(page4Template, programsData, departmentsData);
    const page5 = generatePage5(page5Template, programsData, departmentsData);
    const combinedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .page-break { page-break-after: always; }
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        ${page1}
        <div class="page-break"></div>
        ${page2}
        <div class="page-break"></div>
        ${page3}
        <div class="page-break"></div>
        ${page4}
        <div class="page-break"></div>
       ${page5}
      </body>
      </html>
    `;

    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(combinedHtml, { waitUntil: 'networkidle0' });

        console.log('Generating PDF...');
    const pdf = await page.pdf({ 
      format: 'A4', 
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width: 100%; text-align: center; font-size: 12px; padding: 0;">
          <div style="border-top: 2px solid #333; width: calc(100% - 100px); margin: 0 auto 10px auto;"></div>
          <span class="pageNumber"></span>
        </div>
      `,
      margin: {
        top: '0px',
        bottom: '60px',
        left: '0px',
        right: '0px'
      }
    });
    
    await browser.close();
    console.log('PDF generated successfully');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.send(pdf);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/generate', (req, res) => {
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});