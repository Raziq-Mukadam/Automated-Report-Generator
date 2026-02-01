// backend/utils/pageGenerator.js - Replace entire file with this:

export const generatePage4 = (htmlTemplate, programsData, departmentsData) => {
  let page4 = htmlTemplate;

  console.log('=== PAGE GENERATOR DEBUG ===');
  console.log('Programs Data:', programsData);
  console.log('Programs Count:', programsData?.length || 0);
  console.log('Departments Data:', departmentsData);
  console.log('Departments Count:', departmentsData?.length || 0);

  // Generate programs table rows
  let programsRows = '';
  if (programsData && programsData.length > 0) {
    console.log('Generating program rows...');
    programsData.forEach((program, index) => {
      const fullProgramName = `${program.degree_title || ''} ${program.programme_name || ''}`.trim();
      console.log(`Row ${index + 1}:`, fullProgramName, program.year_started, program.sanctioned_intake);
      
      programsRows += `
        <tr>
          <td style="text-align: center;">${index + 1}</td>
          <td>${fullProgramName}</td>
          <td style="text-align: center;">${program.year_started || ''}</td>
          <td style="text-align: center;">${program.sanctioned_intake || ''}</td>
          <td style="text-align: center;"></td>
          <td style="text-align: center;"></td>
          <td></td>
          <td>${program.accreditation_status || ''}</td>
          <td style="text-align: center;"></td>
        </tr>`;
    });
    console.log('Generated programs rows length:', programsRows.length);
  } else {
    console.log('No programs data - using placeholder');
    programsRows = `
        <tr>
          <td style="text-align: center;">1</td>
          <td colspan="8">No program data available</td>
        </tr>`;
  }

  // Generate accreditation table rows
  let accreditationRows = '';
  if (programsData && programsData.length > 0 && departmentsData && departmentsData.length > 0) {
    console.log('Generating accreditation rows...');
    programsData.forEach((program, index) => {
      const dept = departmentsData.find(d => d.department_id === program.department_id);
      const fullProgramName = `${program.degree_title || ''} ${program.programme_name || ''}`.trim();
      
      accreditationRows += `
          <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td>${dept?.department_name || 'N/A'}</td>
            <td>${fullProgramName}</td>
          </tr>`;
    });
  } else {
    accreditationRows = `
          <tr>
            <td style="text-align: center;">1.</td>
            <td colspan="2">No data</td>
          </tr>`;
  }

  // Generate allied departments table rows
  let alliedRows = '';
  if (departmentsData && departmentsData.length > 0) {
    console.log('Generating allied dept rows...');
    departmentsData.forEach((dept, index) => {
      alliedRows += `
          <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td>${dept.department_name || ''}</td>
            <td>N/A</td>
          </tr>`;
    });
  } else {
    alliedRows = `
          <tr>
            <td style="text-align: center;">1.</td>
            <td colspan="2">No data</td>
          </tr>`;
  }

  // Use regex to replace - more flexible with whitespace
  console.log('Starting replacements...');
  
  // Replace first tbody (programs table)
  page4 = page4.replace(
    /<tbody>\s*<!-- Data rows will be inserted here -->\s*<\/tbody>/,
    `<tbody>${programsRows}\n      </tbody>`
  );
  
  // Replace second tbody (accreditation table)
  page4 = page4.replace(
    /<tbody>\s*<!-- Data rows will be inserted here -->\s*<\/tbody>/,
    `<tbody>${accreditationRows}\n        </tbody>`
  );
  
  // Replace third tbody (allied table)
  page4 = page4.replace(
    /<tbody>\s*<!-- Data rows will be inserted here -->\s*<\/tbody>/,
    `<tbody>${alliedRows}\n        </tbody>`
  );

  console.log('Replacements complete');
  console.log('=== END DEBUG ===');

  return page4;
};

export const generatePage5 = (htmlTemplate, programsData, departmentsData) => {
  let page5 = htmlTemplate;

  console.log('=== PAGE 5 GENERATOR ===');
  console.log('Programs Count:', programsData?.length || 0);
  console.log('Departments Count:', departmentsData?.length || 0);

  // Generate accreditation table rows (Table A8.1)
  let accreditationRows = '';
  if (programsData && programsData.length > 0 && departmentsData && departmentsData.length > 0) {
    console.log('Generating accreditation rows...');
    programsData.forEach((program, index) => {
      const dept = departmentsData.find(d => d.department_id === program.department_id);
      const fullProgramName = `${program.degree_title || ''} ${program.programme_name || ''}`.trim();
      
      accreditationRows += `
        <tr>
          <td style="text-align: center;">${index + 1}</td>
          <td>${dept?.department_name || 'N/A'}</td>
          <td>${fullProgramName}</td>
        </tr>`;
    });
  } else {
    accreditationRows = `
        <tr>
          <td style="text-align: center;">1.</td>
          <td colspan="2">No data</td>
        </tr>`;
  }

  // Generate allied departments table rows (Table A8.2)
  let alliedRows = '';
  if (departmentsData && departmentsData.length > 0) {
    console.log('Generating allied dept rows...');
    departmentsData.forEach((dept, index) => {
      alliedRows += `
        <tr>
          <td style="text-align: center;">${index + 1}</td>
          <td>${dept.department_name || ''}</td>
          <td>N/A</td>
        </tr>`;
    });
  } else {
    alliedRows = `
        <tr>
          <td style="text-align: center;">1.</td>
          <td colspan="2">No data</td>
        </tr>`;
  }

  // Replace table bodies using regex
  page5 = page5.replace(
    /<tbody>\s*<!-- Data rows will be inserted here -->\s*<\/tbody>/,
    `<tbody>${accreditationRows}\n      </tbody>`
  );

  page5 = page5.replace(
    /<tbody>\s*<!-- Data rows will be inserted here -->\s*<\/tbody>/,
    `<tbody>${alliedRows}\n      </tbody>`
  );

  console.log('=== END PAGE 5 ===');
  return page5;
};