export default async function fetchWord(wordLength: number): Promise<string | null> {
	try {
		const URL = "https://random-word-api.herokuapp.com/word?length=" + wordLength;
		const res = await fetch(URL)
		const data = await res.json()
		return data[0];
	}
	catch (err) {
		console.log(err);
		return null;
	}
}

/*
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
*/
