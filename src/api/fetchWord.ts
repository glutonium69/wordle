export default async function fetchWord(wordLength: number): Promise<string | null>{
	try{
		const URL = "https://random-word-api.herokuapp.com/word?length=" + wordLength;
		const res = await fetch(URL)
		const data = await res.json()
		return data[0];
	}
	catch(err){
		console.log(err);
		return null;
	}
}