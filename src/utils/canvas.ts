import { createCanvas, CanvasRenderingContext2D, registerFont } from "canvas";
import { TileColor } from "./enums";

registerFont("/home/user/wordle/menloFont.ttf", { family: "menloFont" });

export default function canvas(
	totalColumns: number,
	totalRows: number,
	guessedWordArr: string[],
	letterStateArr: TileColor[][],
	triesLeft: number
): Buffer {

	const triesLeftHeight = 40;
	const boardWidth = 300;
	const canvasWidth = boardWidth;
	// (rows / colums) = (width / height) = ratio 
	// height = ratio * width
	const boardHeight = (totalRows / totalColumns) * boardWidth;
	const canvasHeight = boardHeight + triesLeftHeight;

	const boardColor = "#121213";

	const canvas = createCanvas(canvasWidth, canvasHeight);
	const ctx = canvas.getContext("2d");

	ctx.fillStyle = boardColor;
	ctx.fillRect(0, 0, boardWidth, boardHeight);

	const { tileWidth, gap } = drawTiles(
		boardWidth,
		ctx,
		totalRows,
		totalColumns,
		letterStateArr
	)

	setLetters(
		ctx,
		totalRows,
		totalColumns,
		tileWidth,
		gap,
		guessedWordArr
	);

	// set the tries left section that sits in bottop right corner
	// it shows how many tries are left
	const triesLeftWidth = (tileWidth * 3) + (gap * 3);
	const pos = {
		x: canvasWidth - triesLeftWidth,
		y: canvasHeight - triesLeftHeight
	}

	ctx.fillStyle = boardColor;
	ctx.fillRect(pos.x, pos.y, triesLeftWidth, triesLeftHeight);

	ctx.font = `bold 15px menloFont`;
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(
		`TRIES LEFT: ${triesLeft}`,
		(canvas.width - triesLeftWidth / 2),
		(canvas.height - triesLeftHeight / 2)
	);


	// turn the whole canvas into a buffer of an image file and png format
	const buffer: Buffer = canvas.toBuffer('image/png');

	return buffer;
}

function drawTiles(
	canvasWidth: number,
	ctx: CanvasRenderingContext2D,
	totalRows: number,
	totalColumns: number,
	letterStateArr: TileColor[][]
): { tileWidth: number, gap: number } {


	// gap between tiles
	const gap = 10;
	// the width of the canvas after subtracting the total amount of gaps
	const leftOverWidth = canvasWidth - ((totalColumns + 1) * gap);
	const tileWidth = leftOverWidth / totalColumns;

	const tileColor = {
		incorrect_letter: "#3a3a3c",
		correct_letter: "#538d4e",
		incorrect_position: "#b59f3b"
	};

	for (let i = 0; i < totalRows; i++) {
		for (let j = 0; j < totalColumns; j++) {

			const pos = {
				// idk how to explain this calculation.. just know that it works lmao
				x: (j * tileWidth) + (gap * j) + gap,
				y: (i * tileWidth) + (gap * i) + gap
			}
			// check the state of the letter that'll be put in this tile
			const letterState = letterStateArr[i] ? letterStateArr[i][j] : null;

			// use the state of the letter to choose the correct tile color
			// set color to transparent if array of letter doesn't exist
			ctx.fillStyle = letterState ? letterState : "transparent";

			ctx.strokeStyle = tileColor.incorrect_letter;
			ctx.lineWidth = 3;

			ctx.fillRect(pos.x, pos.y, tileWidth, tileWidth);
			ctx.strokeRect(pos.x, pos.y, tileWidth, tileWidth);
		}
	}
	ctx.stroke();

	return { tileWidth, gap };
}

function setLetters(
	ctx: CanvasRenderingContext2D,
	totalRows: number,
	totalColumns: number,
	tileWidth: number,
	gap: number,
	guessedWordArr: string[]
): void {

	for (let i = 0; i < totalRows; i++) {
		for (let j = 0; j < totalColumns; j++) {

			const pos = {
				// using the same calculation as the tile it was seen that,
				// the center of the letters were at the origin(top left) of the tiles
				// hence we offset them by half the tile both axis using ( tileWidth / 2 )
				x: (j * tileWidth) + (gap * j) + gap + tileWidth / 2,
				y: (i * tileWidth) + (gap * i) + gap + tileWidth / 2
			}

			// check if the letter exists or not
			// if not then put an empty string
			const currentLetter = guessedWordArr[i]
				? guessedWordArr[i][j].toUpperCase()
				: "";

			ctx.font = "bold 25px menloFont";
			ctx.fillStyle = "#FFFFFF";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(currentLetter, pos.x, pos.y);
		}
	}
}