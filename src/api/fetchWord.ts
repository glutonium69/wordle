export default async function fetchWord(wordLength: number): Promise<string | null> {
    try {
        const URL = `https://random-word-api.herokuapp.com/word?length=${wordLength}`;
        const res = await fetch(URL);
        if (!res.ok) {
            console.error(`Primary API request failed with status: ${res.status}`);
            return await backupFetchWord(wordLength);
        }
        const data = await res.json();
        if (data && data.length > 0) {
            return data[0];
        } else {
            console.error('Primary API response did not contain a word');
            return await backupFetchWord(wordLength);
        }
    } catch (err) {
        console.error('Error in primary API request:', err);
        return await backupFetchWord(wordLength);
    }
}

async function backupFetchWord(wordLength: number): Promise<string | null> {
    try {
        const URL = `https://randomwordapi.onrender.com/word/rand/${wordLength}`;
        const res = await fetch(URL);
        if (!res.ok) {
            console.error(`Backup API request failed with status: ${res.status}`);
            return null;
        }
        const data = await res.json();
        if (data && data.word) {
            return data.word;
        } else {
            console.error('Backup API response did not contain a word');
            return null;
        }
    } catch (err) {
        console.error('Error in backup API request:', err);
        return null;
    }
}
