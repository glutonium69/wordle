import express from 'express';
const app = express();

const port = 3000;

app.all("/", (req, res) => {
	res.send("Bot is running!");
});

export default function listen(){
	app.listen(port, () => {
		console.log(`Server is listening on port ${port}`);
	});
}