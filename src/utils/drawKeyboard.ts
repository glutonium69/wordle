import { createCanvas, CanvasRenderingContext2D } from "canvas";
import { TileColor } from "./enums";

export default function drawKeyboard(keyboardState: {
	correct: string[],
	incorrect: string[],
	wrongPos: string[]
}): Buffer {
	const keyWidth = 50;
	const keyHeight = 50;
	const keySpacing = 10;
	const keyRadius = 10;
	const rows = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
		['Z', 'X', 'C', 'V', 'B', 'N', 'M']
	];

	const canvas = createCanvas(
		keyWidth * 10 + keySpacing * 9 + 40,
		keyHeight * 3 + keySpacing * 2 + 40
	);
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "#121213";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	let yOffset = 20;
	rows.forEach((row) => {
		let xOffset = (canvas.width - (row.length * (keyWidth + keySpacing) - keySpacing)) / 2;
		row.forEach((key) => {
			let keyColor = "#d9d9d9";
			let textColor = '#121213';

			if (keyboardState.correct.includes(key.toLowerCase())) {
				keyColor = TileColor.correct_letter;
			}
			else if (keyboardState.incorrect.includes(key.toLowerCase())) {
				keyColor = TileColor.incorrect_letter;
				textColor = "#d9d9d9";
			}
			else if (keyboardState.wrongPos.includes(key.toLowerCase())) {
				keyColor = TileColor.incorrect_position;
			}
			drawKey(ctx, xOffset, yOffset, key, keyWidth, keyHeight, keyRadius, keyColor, textColor);
			xOffset += keyWidth + keySpacing;
		});
		yOffset += keyHeight + keySpacing;
	});

	const buffer: Buffer = canvas.toBuffer('image/png');
	return buffer;
}

function drawRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
	color: string
) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
}

function drawKey(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	label: string,
	keyWidth: number,
	keyHeight: number,
	keyRadius: number,
	keyColor: string,
	textColor: string,
) {
	drawRoundedRect(ctx, x, y, keyWidth, keyHeight, keyRadius, keyColor);
	ctx.fillStyle = textColor;
	ctx.font = 'bold 20px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(label, x + keyWidth / 2, y + keyHeight / 2);
}