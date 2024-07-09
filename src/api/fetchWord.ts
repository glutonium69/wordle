export default async function fetchWord(wordLength: number): Promise<string | null> {
	try {
		const URL = "https://randomwordapi.onrender.com/word/rand/" + wordLength;
		const res = await fetch(URL)
                if(!res.ok) return null;
		const data = await res.json()
		return data.word;
	}
	catch (err) {
		console.log(err);
		return null;
	}
}
