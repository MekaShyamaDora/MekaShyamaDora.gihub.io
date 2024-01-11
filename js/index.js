class Game {
	constructor() {
		this.APINumbers = new Array();
		this.cards = new Array();
		this.currentLevel;
		this.levelCards = [10];
		this.selectedOne;
		this.selectedTwo;
		this.selectedCardsCount = 0;
		this.victoryCounter = 0;
		this.moves = 0;
		this.loadingContainer = document.getElementById('loading');
		this.movesContainer = document.getElementById('moves');
		this.container = document.getElementById('game');
		this.time = true;
		this.APIdata = {
			loading: true,
			error: null,
			data: {
				info: {},
				results: []
			}
		};
		//Timer
		this.firstMove = false;
		this.hours = 0;
		this.minutes = 0;
		this.seconds = 0;
		this.decimals = 0;
		this.timer = '';
		this.stopTimer = true;
	}

	fetchCharacters = async () => {
		this.APIdata = { loading: true, error: null };

		try {
			const response = await fetch(`https://rickandmortyapi.com/api/character/`);
			const data = await response.json();

			this.APIdata = {
				loading: false,
				data: {
					info: data.info,
					results: data.results
				}
			};
		} catch (error) {
			this.APIdata = { loading: false, error: error };
		}
	}

	async startGame() {
		this.currentLevel = 0;
		this.chooseCard = this.chooseCard.bind(this);
		await this.fetchCharacters();

		for (let i = 0; i < this.APIdata.data.info.count; i++) {
			this.APINumbers.push(i + 1);
		}

		this.APINumbers = this.APINumbers.sort(function() {
			return Math.random() - 0.5;
		});

		this.APINumbers.length = 10;

		const staticLength = this.APINumbers.length;

		for (let i = 0; i < staticLength; i++) {
			this.APINumbers.push(this.APINumbers[i]);
		}

		this.cards.length = this.APINumbers.length;

		this.APINumbers = this.APINumbers.sort(function() {
			return Math.random() - 0.5;
		});

		for (let i = 0; i < this.cards.length; i++) {
			this.tempCharacter = {};

			try {
				const response = await fetch(
					`https://rickandmortyapi.com/api/character/${this.APINumbers[i]}`
				);
				const data = await response.json();

				this.tempCharacter = data;
			} catch (error) {
				this.tempCharacter = { error: error };
			}

			this.cards[i] = document.createElement('div');
			this.cards[i].classList.add('card');
			this.cards[i].innerText = this.APINumbers[i];
			this.cards[i].setAttribute('data-position', i);
			this.cards[i].addEventListener('click', this.chooseCard);
			this.cards[i].innerHTML =
				'<div class="front flipFront" data-position="' +
				i +
				'"></div><div class="back flipBack" data-position="' +
				i +
				'" style="background-image: url(' +
				this.tempCharacter.image +
				');">' +
				'' +
				'</div>';
			this.container.appendChild(this.cards[i]);
		}
		this.loadingContainer.style.display = 'none';
		this.container.style.display = 'flex';
	}

	addEvents(n) {
		this.cards[n].addEventListener('click', this.chooseCard);
	}

	removeEvents(n) {
		this.cards[n].removeEventListener('click', this.chooseCard);
	}

	chooseCard(e) {
		if (this.time === true) {
			switch (this.selectedCardsCount) {
				case 0:
					if (!this.firstMove) {
						this.startTimer();
					}
					this.firstMove = true;
					this.selectedOne = e.target.dataset.position;
					this.cards[this.selectedOne].classList.add('rotate');
					this.removeEvents(this.selectedOne);
					this.selectedCardsCount++;
					this.moves++;
					this.movesContainer.innerText = `Moves: ${this.moves}`;
					break;
				case 1:
					this.moves++;
					this.movesContainer.innerText = `Moves: ${this.moves}`;
					this.selectedTwo = e.target.dataset.position;
					this.cards[this.selectedTwo].classList.add('rotate');
					if (
						this.APINumbers[this.selectedOne] ===
						this.APINumbers[this.selectedTwo]
					) {
						console.log('correct');
						this.removeEvents(this.selectedTwo);
						this.victoryCounter++;
						if (this.victoryCounter === this.levelCards[this.currentLevel]) {
							setTimeout(() => {
								this.victory();
							}, 1000);
						}
					} else {
						console.log('incorrect');
						this.time = false;
						setTimeout(() => {
							this.cards[this.selectedOne].classList.remove('rotate');
							this.cards[this.selectedTwo].classList.remove('rotate');
							this.time = true;
						}, 1000);
						this.addEvents(this.selectedOne);
					}
					this.selectedCardsCount = 0;
					break;
			}
		}
	}

	victory() {
		this.pauseTimer();
		swal(
			'You Win!',
			`Moves: ${this.moves} \n\n Time: ${this.timer}`,
			'success'
		).then(() => {
			console.log('hello');
		});
	}

	newGame() {
		location.reload();
	}

	getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	//Timer
	startTimer() {
		if (this.stopTimer == true) {
			this.stopTimer = false;
			this.timerFunc();
		}
	}

	timerFunc() {
		if (this.stopTimer == false) {
			this.decimals++;
			if (this.decimals > 9) {
				this.decimals = 0;
				this.seconds++;
			}
			if (this.seconds > 59) {
				this.seconds = 0;
				this.minutes++;
			}
			if (this.minutes > 59) {
				this.minutes = 0;
				this.hours++;
			}
			this.displayTimer();
			setTimeout('game.timerFunc()', 100);
		}
	}
	displayTimer() {
		if (this.hours < 10) this.timer = '';
		else this.timer = this.hours;
		if (this.minutes < 10) this.timer = this.timer + '0';
		this.timer = this.timer + this.minutes + ':';
		if (this.seconds < 10) this.timer = this.timer + '0';
		this.timer = this.timer + this.seconds;
		document.getElementById('timer').innerHTML = this.timer;
	}
	pauseTimer() {
		this.stopTimer = true;
	}
	resetTimer() {
		if (this.stopTimer == false) {
			this.stopTimer = true;
		}
		this.hours = this.minutes = this.seconds = this.dec
