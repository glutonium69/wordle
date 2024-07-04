// Suggested code may be subject to a license. Learn more: ~LicenseLog:1435836029.
export default async function isValid(word: string): Promise<{ valid: boolean, word: string, definition: string }> {
	try {
		const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
		const data = await res.json();
		if (data.title == "No Definitions Found") {
			return {
				valid: false,
				word: word.toLowerCase(),
				definition: `No Definitions Found.\nPerhaps check https://www.google.com/search?q=${word}+meaning`
			};
		}
		else {
			return {
				valid: true,
				word: word.toLowerCase(),
				definition: data[0].meanings[0].definitions[0].definition
			};
		}
	}
	catch (err) {
		console.log(err);
		return {
			valid: false,
			word: word.toLowerCase(),
			definition: ""
		};
	}
}