export default async function fetchWord(wordLength: number): Promise<string | null> {
	try {
		const URL_PRIMARY = "https://random-word-api.herokuapp.com/word?length=" + wordLength;
		const resPrimary = await fetch(URL_PRIMARY);
                if(!resPrimary.ok) {
			const URL_SECONDARY = "https://randomwordapi.onrender.com/word/rand/" + wordLength;
			const resSecondary = await fetch(URL_SECONDARY);
			if(!resSecondary.ok) {
				return null;
			}
			const dataSecondary = await resSecondary.json()
			return dataSecondary.word;
		};
		const dataPrimary = await resPrimary.json()
		return dataPrimary[0];
	}
	catch (err) {
		console.log(err);
		return null;
	}
}
