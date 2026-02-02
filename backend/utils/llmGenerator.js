import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import dotenv from 'dotenv';

dotenv.config();

const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama-3.1-8b-instant',
  temperature: 0.4,
});

export const generatePage9Content = async (programData, departmentData, peosData) => {
  try {
    console.log('=== GENERATING PAGE 9 CONTENT VIA LLM ===');
    
    const programName = `${programData.degree_title} ${programData.programme_name}`.trim();
    const visionMission = departmentData?.vision && departmentData?.mission 
      ? `Vision: ${departmentData.vision}\nMission: ${departmentData.mission}`
      : 'Vision and Mission not available';
    
    const peosText = peosData && peosData.length > 0
      ? peosData.map((peo, idx) => `${idx + 1}. ${peo.peo_statement}`).join('\n')
      : 'PEOs not available';

    const rawMission = departmentData?.mission || '';
    let missionElements = rawMission
      .split(/\.|;|\n/)
      .map(item => item.trim())
      .filter(Boolean);

    if (missionElements.length <= 1 && rawMission.includes(',')) {
      missionElements = rawMission
        .split(/,/)
        .map(item => item.trim())
        .filter(Boolean);
    }

    const normalizedMissionElements = missionElements.length > 0
      ? missionElements
      : ['Mission Element 1', 'Mission Element 2', 'Mission Element 3'];

    const unifiedPrompt = PromptTemplate.fromTemplate(
      `You are an educational accreditation expert. Using the given context, generate concise content for an NBA report.\n\nContext:\n- Program: {program_name}\n- Vision/Mission: {vision_mission}\n- Mission Elements: {mission_elements}\n- PEOs: {peos}\n\nReturn ONLY valid JSON with these keys (no markdown):\n{{\n  "visionMissionContent": "...",\n  "peosContent": "...",\n  "processContent": "...",\n  "disseminationContent": "...",\n  "mappingContent": "...",\n  "peoMissionMatrix": [["1"|"2"|"3"|"-"], ...]\n}}\n\nGuidelines:\n- Each content value should be 2–4 sentences.\n- peoMissionMatrix must have rows = number of PEOs and columns = number of mission elements.\n- Use only "1", "2", "3", or "-" values.\n- Do not include any extra keys.\n- Do not include line breaks.`
    );

    const unifiedChain = unifiedPrompt.pipe(groq);
    const unifiedResponse = await unifiedChain.invoke({
      program_name: programName,
      vision_mission: visionMission,
      mission_elements: normalizedMissionElements.map((m, i) => `M${i + 1}: ${m}`).join('\n'),
      peos: peosText
    });

    let parsed = null;
    try {
      parsed = JSON.parse(unifiedResponse.content);
    } catch (parseError) {
      console.error('Failed to parse LLM JSON:', parseError, unifiedResponse.content);
    }

    const visionMissionContent = parsed?.visionMissionContent || 'The vision and mission guide the program toward academic excellence, societal impact, and continuous improvement aligned with stakeholder needs.';
    const peosContent = parsed?.peosContent || 'The Program Educational Objectives define graduate capabilities in professional practice, lifelong learning, and ethical responsibility aligned with the program focus.';
    const processContent = parsed?.processContent || 'The institution defines and reviews Vision, Mission, and PEOs through departmental committees, stakeholder feedback, and periodic academic reviews.';
    const disseminationContent = parsed?.disseminationContent || 'The Vision, Mission, and PEOs are disseminated through the website, curriculum documents, orientation sessions, and engagement with students, alumni, and industry.';
    const mappingContent = parsed?.mappingContent || 'PEOs are mapped to mission elements to ensure alignment between institutional intent and graduate outcomes, with documented rationale for each linkage.';

    const matrix = Array.isArray(parsed?.peoMissionMatrix) ? parsed.peoMissionMatrix : null;

    // Generate PEO table rows
    let peoRows = '';
    if (peosData && peosData.length > 0) {
      peosData.forEach((peo, rowIndex) => {
        const rowValues = Array.isArray(matrix?.[rowIndex])
          ? matrix[rowIndex]
          : new Array(normalizedMissionElements.length).fill('2');

        const normalizedRow = rowValues.map(value => {
          const normalized = String(value || '-').trim();
          return ['1', '2', '3', '-'].includes(normalized) ? normalized : '-';
        });

        peoRows += `
            <tr>
              <td>${peo.peo_statement || ''}</td>
              ${normalizedRow.map(val => `<td>${val}</td>`).join('')}
            </tr>`;
      });
    } else {
      peoRows = `
            <tr>
              <td>PEO1</td>
              ${new Array(normalizedMissionElements.length).fill('<td>2</td>').join('')}
            </tr>`;
    }

    console.log('=== PAGE 9 CONTENT GENERATED ===');

    return {
      visionMissionContent: visionMissionContent.trim(),
      peosContent: peosContent.trim(),
      processContent: processContent.trim(),
      disseminationContent: disseminationContent.trim(),
      mappingContent: mappingContent.trim(),
      peoRows,
      missionHeaders: normalizedMissionElements.map((_, i) => `<th>M${i + 1}</th>`).join('')
    };
  } catch (error) {
    console.error('Error generating page 9 content:', error);
    return {
      visionMissionContent: 'The vision and mission guide the program toward academic excellence, societal impact, and continuous improvement aligned with stakeholder needs.',
      peosContent: 'The Program Educational Objectives define graduate capabilities in professional practice, lifelong learning, and ethical responsibility aligned with the program focus.',
      processContent: 'The institution defines and reviews Vision, Mission, and PEOs through departmental committees, stakeholder feedback, and periodic academic reviews.',
      disseminationContent: 'The Vision, Mission, and PEOs are disseminated through the website, curriculum documents, orientation sessions, and engagement with students, alumni, and industry.',
      mappingContent: 'PEOs are mapped to mission elements to ensure alignment between institutional intent and graduate outcomes, with documented rationale for each linkage.',
      peoRows: '<tr><td>PEO1</td><td>2</td><td>2</td><td>2</td></tr>',
      missionHeaders: '<th>M1</th><th>M2</th><th>M3</th>'
    };
  }
};
