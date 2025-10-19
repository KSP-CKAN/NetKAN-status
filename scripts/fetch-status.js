// Import necessary modules from Node.js standard library
import * as fs from 'fs/promises';
import * as path from 'path';

const urls = {
    'netkan.json': 'https://status.ksp-ckan.space/status/netkan.json',
    'netkan-ksp2.json': 'https://status.ksp-ckan.space/status/netkan-ksp2.json'
};

const outputDir = 'public/status';

/**
 * Fetches content from URLs using native fetch, creates the output directory,
 * and saves the files.
 */
async function fetchAndSaveStatus() {
    console.log(`Starting process to fetch and save files to: ${outputDir}`);

    try {
        await fs.mkdir(outputDir, { recursive: true });
        console.log(`✅ Directory created/verified: ${outputDir}`);

        const savePromises = Object.entries(urls).map(async ([filename, url]) => {
            console.log(`  -> Fetching ${filename} from ${url}`);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} for URL: ${url}`);
            }

            const data = await response.text();

            const outputPath = path.join(outputDir, filename);

            await fs.writeFile(outputPath, data);

            console.log(`  ✅ Successfully saved: ${outputPath}`);
            return outputPath;
        });

        await Promise.all(savePromises);

        console.log('\n🎉 All status files have been successfully fetched and saved.');

    } catch (error) {
        console.error('\n❌ An error occurred during the fetch and save process:', error.message);
        process.exit(1);
    }
}

fetchAndSaveStatus();
