class TextManager {
    constructor() {
        this.injectText();
    }

    // Method to inject text into specific elements
    injectText() {
        document.getElementById('gameTitle').textContent = TEXTCONTENT.gameTitle;
        document.getElementById('labelText').textContent = TEXTCONTENT.labelText;
        document.getElementById('submitBtn').textContent = TEXTCONTENT.submitButtonText;
    }

    // Method to update game message (e.g., "Excellent memory!" or "Wrong order!")
    setGameMessage(messageKey) {
        const message = this.textContent[messageKey];
        if (message) {
            document.getElementById('gameMessage').textContent = message;
        }
    }
}

class ButtonCreator {
    constructor(textManager) {
        this.textManager = textManager; // Reference to the TextManager instance
        this.submitBtn = document.getElementById('submitBtn');
        this.buttonNumberInput = document.getElementById('buttonNumber');
        this.buttonContainer = document.getElementById('buttonContainer');
        this.originalOrder = [];
        this.userOrder = [];
        this.currentIndex = 0;
        this.gameActive = true;

        this.submitBtn.addEventListener('click', () => this.createButtons());
    }

    createButtons() {
        const n = this.validateInput(this.buttonNumberInput.value);
        if (n !== null) {
            this.clearButtons();
            this.originalOrder = [];
            this.userOrder = [];
            this.currentIndex = 0;
            this.textManager.setGameMessage(""); // Clear game message
            this.gameActive = true;

            // Create buttons with text
            for (let i = 1; i <= n; i++) {
                const button = document.createElement('button');
                button.textContent = `Button ${i}`;
                button.style.backgroundColor = this.getRandomColor();
                button.dataset.index = i; // Store the original order
                this.originalOrder.push(button); // Track original order
                this.buttonContainer.appendChild(button);
            }

            // After 3 to 7 seconds pause, scramble and remove text
            this.pauseAndScramble(n);
        }
    }

    validateInput(input) {
        const n = parseInt(input, 10);
        if (isNaN(n) || n < 3 || n > 7) {
            alert('Please enter a number between 3 and 7.');
            return null;
        }
        return n;
    }

    clearButtons() {
        this.buttonContainer.innerHTML = '';
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    pauseAndScramble(n) {
        // Pause for n seconds
        setTimeout(() => {
            // Remove the text before scrambling
            this.removeButtonText();

            // Convert buttons to absolute position and scramble them
            this.convertButtonsToAbsolute();
            this.scrambleButtons(n, n);  // Start scrambling n times
        }, n * 1000);
    }

    removeButtonText() {
        // Remove text from each button
        this.buttonContainer.childNodes.forEach(button => {
            button.textContent = ''; // Remove the text
            button.classList.add('hidden'); // Hide the text
        });
    }

    convertButtonsToAbsolute() {
        // Set each button's position as absolute based on current location
        this.buttonContainer.childNodes.forEach(button => {
            const rect = button.getBoundingClientRect();
            button.style.position = 'absolute';
            button.style.left = `${rect.left}px`;
            button.style.top = `${rect.top}px`;
        });
    }

    scrambleButtons(n, remainingScrambles) {
        if (remainingScrambles > 0) {
            // Scramble the positions of the buttons
            this.buttonContainer.childNodes.forEach(button => {
                const { innerWidth, innerHeight } = window;
                const maxX = innerWidth - button.offsetWidth;
                const maxY = innerHeight - button.offsetHeight;
                const randomX = Math.random() * maxX;
                const randomY = Math.random() * maxY;

                button.style.left = `${randomX}px`;
                button.style.top = `${randomY}px`;

                // Add event listeners to buttons for user input
                button.onclick = () => this.handleButtonClick(button);
            });

            // Repeat scrambling after 2 seconds
            setTimeout(() => {
                this.scrambleButtons(n, remainingScrambles - 1);
            }, 2000);
        }
    }

    handleButtonClick(button) {
        if (!this.gameActive) return; // Don't respond if the game is over

        const expectedButton = this.originalOrder[this.currentIndex];

        // If clicked in the correct order
        if (button === expectedButton) {
            this.revealButton(button);
            this.currentIndex++;

            // Check if all buttons are clicked correctly
            if (this.currentIndex === this.originalOrder.length) {
                this.textManager.setGameMessage('excellentMemory');
                this.gameActive = false;
            }
        } else {
            // Wrong order clicked
            this.textManager.setGameMessage('wrongOrder');
            this.revealAllButtons();
            this.gameActive = false;
        }
    }

    revealButton(button) {
        button.textContent = `Button ${button.dataset.index}`;
        button.classList.remove('hidden'); // Make the text visible
    }

    revealAllButtons() {
        // Reveal the correct order of all buttons
        this.originalOrder.forEach(button => {
            this.revealButton(button);
        });
    }
}

class GameManager {
    constructor() {
        this.textManager = new TextManager();
        this.buttonCreator = new ButtonCreator();
    }
}

// Instantiate TextManager and inject the text into the page
const gameManager = new GameManager();


