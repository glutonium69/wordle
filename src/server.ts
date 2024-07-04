import express, { Response } from 'express';
const app = express();

const port: number = 3000;

app.all("/", (_, res: Response) => {
	res.send("Bot is running!");
});

export default function listen(): void {
	app.listen(port, () => {
		console.log(`Server is listening on port ${port}`);
	});
}