# Table of contents

* [Wordle bot](#wordle-bot)

    * [Introduction](#introduction)

    * [How to play](#how-to-play)
        * [Slash Command](#slash-command)
        * [Prefix Command](#prefix-command)
        * [Color Definition](#color-definitions)

    * [Code integration](#code-integration)
        * [Prerequisite](#prerequisite)
        * [Installation](#installation)
        * [Code setup](#code-setup)

    * [Color definitions](#color-definitions)

* [Code Explanation](#code-explanation)

    * [api /](#api-)
        * [fetchWord.js](#fetchWordjs)
        * [isValid.js](#isValidjs)

    * [gameFunction /](#gameFunction-)
        * [handleGuesses.js](#handleGuessesjs)
        * [handleWinOrLose.js](#handleWinOrLosejs)
        * [sendHelpEmbed.js](#sendHelpEmbedjs)
        * [setGame.js](#setGamejs)

    * [slashCommand /](#slashCommand-)
        * [commands.js](#commandsjs)

    * [utils /](#utils-)
        * [canvas.js](#canvasjs)
        * [prefix&command.js](#prefix&commandjs)

    * [gameClass.js](#gameClassjs)
    * [index.js](#indexjs)
    * [registerSlash.js](#registerSlashjs)
    * [server.js](#serverjs)

---
---

# Wordle bot
Welcome to the Wordle Bot! Here you will find all the info about the bot you need.


## Introduction
Wordle is a word game where a random word of a certain length is picked and the player has to guess that word within a specific amount of tries. With each guess, if the guessed word is valid (as in if it is a legitamate word according to the dictionary) the word shows up in the board and letters are shown in different colors where each color gives a hint about that letter (check color definition section to learn more about these colors). The player based on those hints and with the power of their volabulary, are to guess the correct word.

## How to play

### Slash Command
In the chatbox, type `"/"` and from there you can click the bot icon from the bot list on the left and click on the command you want to execute. If exists, optional parameters would show up when clicking a command, you can click on them and fill them as required if you need so.

### Prefix Command

**Starting game: ` .wordle `**

This command will only work once there are no ongoing games.

You can give optional parameters alongside the start command

The way to give those parameters are as follows ` .wordle [parameter-1, parameter-2] `
* Parameter-1 : Length of the word ` [4 <= value <= 8] `
* Parameter-2 : Total amount of tries ` [3 <= value <= 12] `

**Guessing word: ` .<your guess> `**

The prefix needed to distinguish between normal text and guesses.

**Ending game: ` .end `**

This command can be used to end the game at any point when a game is on going.

### Color definitions

Letters of each guessed word will be in a color-coded tile if your guess is valid:

If not a valid word then the bot will notify

* :green_square: Green tiles indicate a correct letter in the correct position.
* :yellow_square: Yellow tiles indicate a correct letter but in the wrong position.
* :black_large_square: Black tiles indicate an incorrect letter


---
---


## Code integration

If you are looking forward to using the code for your own bot application then you should follow the following steps.

### Prerequisite

* Make sure to have your bot application ready. You can make bot application from [here](https://discord.com/developers/applications). Log in with your discord account if needed.

* Make sure to have `node` installed so you can run `npm` command.

### Installation

1. Via `github cli` :
    * If you have `github cli` then click the blue button that says `< > Code` and copy the link shown in the image.

    * Using your terminal navigate to the directory where you want to clone the repo and paste the link in and hit `enter`.

    * You can also just copy the link from within the URL and in your terminal run the following command.

    * `git clone "URL"`

2. Via `.zip` file :

    * Or if you don't have `github cli` installed then download the code as `.zip`.

    * Then go to the directory of your choice and `unzip` the file.

![code installation](https://cdn.discordapp.com/attachments/974032667450413098/1200232925841588366/Screenshot_2024-01-26_5.16.50_AM.png?ex=65c56f04&is=65b2fa04&hm=1ab3ead3ea8e5671168ad981bc8bdf589b510b66e66170ba7598d1d034905176&)

### Code setup

1. Within the project directory, look for a `.env` file.

2. Now open up the `.env`. You should see something like the following. If you don't find the `.env` file then make one and copy paste the following code.

```
TOKEN = "put your discord toke here"
APPLICATION_ID = "put your application id here"
```

3. Now go to this [URL](https://discord.com/developers/applications).

4. Select your bot application and navigate to the "**Bot**" from the navigation section. And copy your discord `TOKEN` (Reset token if needed). Now paste it in the `.env` file within the double quote where it says `put your discord toke here`.

> _**CAUTION: DO NOT share your discord "TOKEN" with anyone. If you have accidentally leaked your dicord "TOKEN" then go to the same [URL](https://discord.com/developers/applications) and from where you copied your discord "TOKE", hit "Reset Token".**_

5. Now go the same [URL](https://discord.com/developers/applications) and navigate to the `General Information` section and from there copy your `Application ID` and paste it in your `.env` file.

6. Once those done, open up the terminal.

7. Navigate inside the project directory and run the following command,

```
npm install && npm start
```

8. If done properly, this will start your bot and your bot should be online. And it will be online as long as the code + terminal is running. And you should see something like th following in your terminal.

```
Successfully reloaded application (/) commands.
Server is listening on port 3000
Bot is online with the username: <bot name><bot discriminator>
```

---
---

## Code Explanation

The project as of now has the following folder/file tree (ordered alphabetically)
```
.
├── api
│   ├── fetchWord.js
│   └── isValid.js
│
├── gameFunction
│   ├── handleGuesses.js
│   ├── handleWinOrLose.js
│   ├── sendHelpEmbed.js
│   └── setGame.js
│
├── slashCommands
│   └── commands.js
│
├── utils
│   ├── canvas.js
│   └── prefix&command.js
│
├── gameClass.js
├── index.js
├── registerSlash.js
├── server.js

```

Let's take a brief look at what each of those files are responsible for.


## api /

### fetchWord.js

The sole purpose of the code within this file is to return a random word everytime it is called, with the help of the following [API URL](https://random-word-api.herokuapp.com/word?length=5)
```
https://random-word-api.herokuapp.com/word?length={word-length: int}
```
The function within this file takes an `int` as an argument and uses `fetch()` method to send a `get` request to the API within a try catch block and returns a `string` / word of the given length or an `error` message in case of an error.

### isValid.js

Quite similer to `fetchWord.js` this function also uses a `fetch()` method to send a `get` request to the following [API URL](https://api.dictionaryapi.dev/api/v2/entries/en/${word})
```
https://api.dictionaryapi.dev/api/v2/entries/en/${word: string}
```
**Except** this function is responsible for checking the validation of a given word (i.e if that word if a valid english word). The function takes a `string` as an argument and returns an object such as the following,
```ts
return {
  valid: boolean,
  definition: string
};
```
if response is `OK` (i.e `try{...}` block executed) or
```ts
return false
```
in case of an `error` (i.e `catch(){...}` block executed).




## gameFunction /

### handleGuesses.js

The purpose of `handleGuesse.js` is to take the following properties as argument,
```ts
e: object
guessedWordArr: string[]
letterStateArr: string[][]
pickedWord: string
triesLeft: number
```
loops through `guessedWordArr` and based on different conditions updates `letterStateArr` which holds either of the three following states as `string` for each letter in each word (hence it's a 2D array). And this happens everytime the player guesses a new word
```
"correct_letter"
"incorrect_letter"
"incorrect_position"
```
Afterwards required properties are passed to [**canvas.js**](#canvasjs) which returns a `buffer` of the generated `canvas` [**read** [**canvas.js**](#canvasjs)]. The buffer is then passed into the `Discord.AttachmentBuilder()`, which then does it's magic and then the `attachment` is sent to discord with the help of `e :object` variable.


### handleWinOrLose.js

This file consists of 3 individual functions as shown below,
```ts
wordAndDefinition(
  word: string,
  definition: string
)

handleWin(
  e: object,
  guessedWordArr: string[],
  letterStateArr: string,
  PICKED_WORD: string,
  triesLeft: number,
  PICKED_WORD_DEFINITION: string
)

handleLoose(
  e: object,
  guessedWordArr: string[],
  letterStateArr: string,
  PICKED_WORD: string,
  triesLeft: number,
  PICKED_WORD_DEFINITION: string
)
```
**wordAndDefinition()**

This function takes two `string` as argument as shown above and concatenates them into one `string` and returns the `string` which look something like the following when it will be sent to discord.

```
‎ ```
‎ word: <word>
‎ definition: <definition>
‎ ```
```

<!--
 ‎  is an invisible character
 it is there so code block doesn't get messed up
 -->


**handleWin() & handleLose()**

These functions take the same properties shown above as argument and passes them to [**handleGuesses.js**](#handleGuessesjs) and also sends a message to the player regarding their win or loose.

![win](https://cdn.discordapp.com/attachments/1053037836045127761/1199517556474658877/Screenshot_2024-01-24_6.54.12_AM.png?ex=65c2d4c7&is=65b05fc7&hm=b58fad5d5fb818a48c6f2e5a83c9e3352aeabf6c406250778abb9f97b0e6934d&)

![loss](https://cdn.discordapp.com/attachments/1053037836045127761/1199518194914824292/Screenshot_2024-01-24_6.56.38_AM.png?ex=65c2d55f&is=65b0605f&hm=f080ffc3090ea7242df524530bf39bcca14011825b6cb37a6b605d432441acf3&)


### sendHelpEmbed.js

This file consists a description that is written in markdown format which is then, once the `sendHelpEmbed(e: object)` function is called will create a dicord embed using `Discord.EmbedBuilder()` and send to the appropriate channel based on the event object(`e`) passed to it.

### setGame.js

This file consists of the following 2 functions
```ts
getWord(wordLength: number)

setGame(
  e,
  guessedWordArr: string[],
  letterStateArr: string[][],
  triesLeft: number,
  wordLength: number
)
```

**getWord()**

This function uses `fetchWord()` and `isValid()` helper function from [**fetchWord.js**](#fetchWordjs) and [**isValid.js**](#isValidjs) respectively. Using a `while` loop, per iteration, it fetches a new word ([**fetchWord.js**](#fetchWordjs)) and checks it validation ([**isValid.js**](#isValidjs)). All though [**fetchWord.js**](#fetchWordjs) returns valid english word, sometimes it turns out invalid according to [**isValid.js**](#isValidjs) as most likely the the word doesn't exists within it's database. To prevent infinte loop there is a max attempts used as a base case.

**setGame()**

This function only runs once the game has started. This intializes the game by setting some variables such as `pickedWord` which is the random word returned by [**fetchWord.js**](#fetchWordjs) and validated by [**isValid.js**](#isValidjs) and setsup and empty board.

![sample generated image](https://cdn.discordapp.com/attachments/1053037836045127761/1199515214152999083/file.jpg?ex=65c2d298&is=65b05d98&hm=8bb43450f08b3d14d8313d8bee49f17712fe7f41492ecf727a63bbcb92d208b4&)




## slashCommands /

### commands.js
`commands.js` contains `objects` for all the `slash commands` for the bot. In order to register slash command in discord each command must be of an `object` of the following structure (excluding optional `key, value` pairs).

```js
const object = {
	name: 'command_name',
	description: 'Command description'
}
```
The file exports an `array` of all `slash command` `object` which is then used within [**registerSlash.js**](#registerSlashjs).

![slash command](https://cdn.discordapp.com/attachments/1053037836045127761/1199518724957417583/image.png?ex=65c2d5de&is=65b060de&hm=63a0eac7030506e0a712b0f075ec8534f34aee9848c9a76223f14800aaecc8f9&)



## utils /

### canvas.js

`canvas.js` consists of the follwoing functions,
```ts
canvas(
  totalColumns: number,
  totalRows: number,
  guessedWordArr: string[],
  letterStateArr: string[][],
  triesLeft: number
)

drawTiles(
  canvasWidth: number,
  ctx: object,
  totalRows: number,
  totalColumns: number,
  letterStateArr: string[][]
)

setLetters(
  ctx: object,
  totalRows: number,
  totalColumns: number,
  tileWidth: number,
  gap: number,
  guessedWordArr: string[]
)
```
**canvas()**

`canvas.js` uses the provided arguments alongside `drawTiles()` and `setLetters()` and dynamically generates images with the help of `canvas api`. It uses the two helper function to draw the canvas and returns the raw data / `buffer`.

**drawTiles()**

This funcntion simply calculates where each tiles of the board are supposed to go based on various factors and positions all tiles accordingly on the `canvas`

**setLetters()**

This funcntion simply calculates where each letters of the words are supposed to go based on variabous factors and positions all characters accordingly on the `canvas`

![sample generated image](https://cdn.discordapp.com/attachments/1053037836045127761/1199515693201231932/file.jpg?ex=65c2d30b&is=65b05e0b&hm=dadcd907ca71652344948850e847f4e3baeb0484003a34f93f7ee3904566971c&)


### prefix&command.js

The bot also supports the legacy prefix command (e.g `!command`)

**Bot PREFIX = "`.`"**

This file contains a `const` variable `PREFIX` and an `object` of all the available legacy prefix command.

```js
export const PREFIX = ".";
export const COMMANDS = {
	start: PREFIX + "wordle",
	end: PREFIX + "end",
	help: PREFIX + "help"
};
```


## gameClass.js

`gameCLass.js` has the structure of the `Wordle` `class` which is used within [**index.js**](#indexjs). The class contains all unique properties and methods that are of every game instance. Having a `class` makes it easier to assign a `new` instance of that `class` whenever a new game starts. This makes sure that when different games are being played in different servers, the unique datas are encapsulated within that game instace hence not letting any conflict to ocuur.



## index.js

`index.js` is the main js file that intializes a new `Discord.Client`, sets up the bot, logs in and also takes care of listening to events and initializing game as well as take care of game instances, that is keeping track of new and old game instaces. This is being done using a `new Map()` called `gameInstances` which is inside [**gameClass.js**](#gameClassjs). Everytime a new game instance is initialized it is added to the `gameInstances` with the `server/guild id` as the key which is.Each game instace also remembers it's `guild id`. Once a game ends we use the `guild id` to `delete` that instance from `gameInstacnes`. It also starts the server which has beeen setup by [**server.js**](#serverjs).


## package.txt

cs50 codespace I think has `package.json` in their `.gitignore` hence it doesn't get pushed to the repo
Which is why I am using `package.txt` to store all the `dependency packages` / the literal `package.json` code so anyone can simply make a `package.json`, paste the code in `package.txt` and subsequently run `npm install` to install all the dependencies.


## registerSlash.js

When making `slash commands` for bot, it is required to use `Discord.REST` and `Discord.Routes` to register the slash command. The file basically uses these constructors as well as bot `TOKEN` and `Application Id` alongside all the commands initialized within [**commands.js**](#commandsjs) to register the `slash commands`



## server.js

The code in this file uses `express.js` to start a `backend server`.
