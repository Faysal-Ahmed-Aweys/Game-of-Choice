document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const storyText = document.getElementById('story-text');
    const choices = document.getElementById('choices');
    const xpDisplay = document.getElementById('xp');
    const inventoryDisplay = document.getElementById('inventory');
    const healthDisplay = document.getElementById('health');
    const statsDisplay = document.getElementById('stats');
    const timerDisplay = document.getElementById('timer'); 

    const playerNameDisplay = document.getElementById('player-name');
    const editNameButton = document.getElementById('edit-name');
    const nameModal = document.getElementById('name-modal');
    const nameInput = document.getElementById('name-input');
    const saveNameButton = document.getElementById('save-name');
    const closeModalButton = document.getElementById('close-name-modal');

    const mainMenu = document.getElementById('main-menu');
    const gameContainer = document.getElementById('game-container');
    const pauseMenu = document.getElementById('pause-menu');

    const startGameButton = document.getElementById('start-game');
    const continueGameButton = document.getElementById('continue-game');
    const instructionsButton = document.getElementById('instructions');

    const resumeGameButton = document.getElementById('resume-game');
    const returnToMenuButton = document.getElementById('return-to-menu');
    const saveGameButton = document.getElementById('pause-save-game');

    const gameState = {
        xp: 0,
        health: 100,
        inventory: [],
        currentScene: 'start',
        isPaused: false,
        playerStats: {
            choicesMade: 0,
            totalXP: 0,
            itemsCollected: 0,
            healthChanges: 0
        }
    };

    const milestones = [
        { type: "xp", value: 50, reward: { type: "item", name: "Health Potion" } },
        { type: "xp", value: 100, reward: { type: "health", amount: 20 } },
        { type: "story", scene: "freedomPath", reward: { type: "xp", amount: 50 } },
        { type: "items", count: 3, reward: { type: "xp", amount: 20 } }
    ];

    const achievements = [
        { id: 'firstChoice', name: 'First Step', description: 'Made your first choice.', condition: () => gameState.playerStats.choicesMade > 0 },
        { id: 'collectItems', name: 'Collector', description: 'Collected 5 items.', condition: () => gameState.playerStats.itemsCollected >= 5 },
        { id: 'maxXP', name: 'XP Master', description: 'Earned 100 XP.', condition: () => gameState.xp >= 100 },
        { id: 'finishGame', name: 'Survivor', description: 'Completed the game.', condition: () => gameState.currentScene === 'victory' }
    ];

    let unlockedAchievements = JSON.parse(localStorage.getItem("achievements")) || [];
    let timerInterval;

    // Functions
    function initializeGame() {
        Object.assign(gameState, {
            xp: 0,
            health: 100,
            inventory: [],
            currentScene: 'start',
            isPaused: false,
            playerStats: {
                choicesMade: 0,
                totalXP: 0,
                itemsCollected: 0,
                healthChanges: 0
            }
        });
    
        updateInventoryDisplay();
        xpDisplay.textContent = gameState.xp;
        healthDisplay.textContent = gameState.health;
        displayStats();
        updateStory(gameState.currentScene);
    }

    function loadPlayerName() {
        const storedName = localStorage.getItem('playerName');
        if (storedName) {
            playerNameDisplay.textContent = storedName;
        } else {
            showNameModal();
        }
    }

    function showNameModal() {
        nameModal.style.display = 'block';
    }

    function savePlayerName() {
        const name = nameInput.value.trim();
        if (name) {
            playerNameDisplay.textContent = name;
            localStorage.setItem('playerName', name);
            nameModal.style.display = 'none';
        } else {
            alert("Player name cannot be empty!");
        }
    }

    function editPlayerName() {
        nameInput.value = playerNameDisplay.textContent;
        showNameModal();
    }

    saveNameButton.addEventListener('click', savePlayerName);
    closeModalButton.addEventListener('click', () => {
        nameModal.style.display = 'none';
    });
    editNameButton.addEventListener('click', editPlayerName);

    function showMainMenu() {
        gameContainer.style.display = 'none';
        mainMenu.style.display = 'flex';
        pauseMenu.style.display = 'none';
    }

    function startGame() {
        localStorage.removeItem('gameState');
        initializeGame();
        mainMenu.style.display = 'none';
        gameContainer.style.display = 'block';
    }

    function continueGame() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            loadGame();
            mainMenu.style.display = 'none';
            gameContainer.style.display = 'block';
        } else {
            alert('No saved game found!');
        }
    }

    function pauseGame() {
        if (gameState.isPaused) return;
        gameState.isPaused = true;
        pauseMenu.style.display = 'flex';
        gameContainer.style.display = 'none';
        clearInterval(timerInterval);
    }

    function resumeGame() {
        if (!gameState.isPaused) return;
        gameState.isPaused = false;
        pauseMenu.style.display = 'none';
        gameContainer.style.display = 'block';
    }

    function returnToMenu() {
        gameState.isPaused = false;
        showMainMenu();
    }

    startGameButton.addEventListener('click', startGame);
    continueGameButton.addEventListener('click', continueGame);
    instructionsButton.addEventListener('click', () => alert('Instructions: Make choices to progress in the story.'));

    resumeGameButton.addEventListener('click', resumeGame);
    returnToMenuButton.addEventListener('click', returnToMenu);
    saveGameButton.addEventListener('click', saveGame);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'p') {
            if (gameState.isPaused) resumeGame();
            else pauseGame();
        }
    });

    // Initialize Game (Start with Main Menu)
    showMainMenu();

    // Load Player Name or Prompt for Input
    function loadPlayerName() {
        const storedName = localStorage.getItem('playerName');
        if (storedName) {
            playerNameDisplay.textContent = storedName;
        } else {
            showNameModal();
        }
    }

    // Show Modal to Input Name
    function showNameModal() {
        nameModal.style.display = 'block';
    }

    // Save Player Name
    function savePlayerName() {
        const name = nameInput.value.trim();
        if (name) {
            playerNameDisplay.textContent = name;
            localStorage.setItem('playerName', name);
            nameModal.style.display = 'none';
        } else {
            alert("Player name cannot be empty!");
        }
    }

    // Edit Player Name
    function editPlayerName() {
        nameInput.value = playerNameDisplay.textContent;
        showNameModal();
    }

    // Event Listeners
    saveNameButton.addEventListener('click', savePlayerName);
    closeModalButton.addEventListener('click', () => {
        nameModal.style.display = 'none';
    });
    editNameButton.addEventListener('click', editPlayerName);

    // Initial Load
    loadPlayerName();

    document.getElementById('save-game').addEventListener('click', saveGame);
    document.getElementById('load-game').addEventListener('click', loadGame);

    // Define the story structure
    const story = {
        start: {
            text: "You wake up in a dense forest, the trees whispering your name. Ahead, a path splits in two. To the left, the forest thickens. To the right, faint light glimmers.",
            choices: {
                "Go Left": { next: "thickForest", xp: 10 },
                "Go Right": { next: "lightPath", xp: 10 }
            }
        },
        thickForest: {
            text: "The forest grows darker as you proceed. You hear rustling in the bushes. Ahead, you see a faint outline of a creature.",
            choices: {
                "Investigate the Creature": { next: "fightBeast", xp: 15 },
                "Hide and Observe": { next: "fleeToCamp", xp: 5 },
            },
        },
        fightBeast: {
            text: "You bravely face the creature and discover it's a wild beast. After a fierce battle, you manage to defeat it and find a glowing amulet among its remains.",
            choices: {
                "Take the Amulet": { next: "amuletFound", xp: 30, items: ["Amulet"] },
            },
        },
        fleeToCamp: {
            text: "You quietly move away from the creature and stumble upon an abandoned camp. You find some useful supplies.",
            choices: {
                "Take the Supplies": { next: "searchCamp", xp: 20, items: ["Torch", "Herb"] },
            },
        },
        healedCamp: {
            text: "You use the herb to heal your wounds. Feeling better, you prepare to explore further.",
            choices: {
                "Follow the Smoke Trail": { next: "smokeTrail", xp: 20 },
                "Go Deeper into the Forest": { next: "thickForest", xp: 15 }
            }
        },
        searchCamp: {
            text: "You find a torch in the camp, its flame weak but functional.",
            choices: {
                "Take the Torch and Continue": { next: "torchAcquired", xp: 15, items: ["Torch"] }
            }
        },
        lightPath: {
            text: "You follow the light to a clearing with a mysterious figure waiting. The figure offers you a key.",
            choices: {
                "Take the Key": { next: "keyAcquired", xp: 20, items: ["Key"] },
                "Refuse and Continue": { next: "forestEdge", xp: 10 }
            }
        },
        keyAcquired: {
            text: "With the key in hand, you feel compelled to find what it unlocks.",
            choices: {
                "Search for a Locked Chest": { next: "chestLocation", xp: 20 },
                "Explore Further": { next: "forestEdge", xp: 15 }
            }
        },
        amuletFound: {
            text: "The amulet hums with power, guiding you towards an ancient tree.",
            choices: {
                "Follow the Amulet's Guidance": { next: "ancientTree", xp: 30 },
                "Ignore the Amulet": { next: "forestEdge", xp: 10 }
            }
        },
        torchAcquired: {
            text: "The torch's light reveals a hidden path leading to a cave.",
            choices: {
                "Enter the Cave": { next: "caveEntrance", xp: 20 },
                "Stay Outside": { next: "forestEdge", xp: 10 }
            }
        },
        caveEntrance: {
            text: "The cave is dark and damp. Inside, you find a chest.",
            choices: {
                "Open the Chest with the Key": { next: "chestOpened", xp: 50, requiredItem: "Key" },
                "Leave the Cave": { next: "forestEdge", xp: 10 }
            },
            timed: true,
            timer: 15, // Timer duration in seconds
            defaultChoice: "Leave the Cave"
        },
        chestOpened: {
            text: "The chest contains an ancient map. It marks a path leading to freedom.",
            choices: {
                "Follow the Map": { next: "freedomPath", xp: 50, items: ["Map"] }
            }
        },
        chestLocation: {
            text: "You find a locked chest hidden under some leaves.",
            choices: {
                "Open the Chest with the Key": { next: "chestOpened", xp: 50, requiredItem: "Key" },
                "Leave the Chest": { next: "forestEdge", xp: 5 }
            }
        },
        ancientTree: {
            text: "The tree whispers secrets of the forest. It reveals a hidden path to escape.",
            choices: {
                "Take the Path": { next: "freedomPath", xp: 50 },
                "Ignore the Path": { next: "forestEdge", xp: 10 }
            }
        },
        smokeTrail: {
            text: "The smoke trail leads to a hidden camp with supplies and a map.",
            choices: {
                "Take the Supplies and Map": { next: "mapAcquired", xp: 30, items: ["Map"] },
                "Leave the Camp": { next: "forestEdge", xp: 10 }
            }
        },
        mapAcquired: {
            text: "The map shows a path to escape the forest.",
            choices: {
                "Follow the Map": { next: "freedomPath", xp: 50 }
            }
        },
        freedomPath: {
            text: "You follow the map through the forest, avoiding dangers. You see a bright light ahead.",
            choices: {
                "Step Into the Light": { next: "victory", xp: 100 },
                "Turn Back": { next: "lostForever", xp: -10 }
            }
        },
        victory: {
            text: "You emerge from the forest, victorious and transformed by your journey.",
            choices: {}
        },
        lostForever: {
            text: "You lose your way and are consumed by the forest. You are never seen again.",
            choices: {}
        },
        forestEdge: {
            text: "The forest thickens. The choices you make now will determine your fate.",
            choices: {
                "Search for Another Path": { next: "thickForest", xp: 15 },
                "Follow the Whispers": { next: "ancientTree", xp: 20 }
            }
        },
        bridgeScene: {
            text: "You reach a rickety bridge swaying over a deep ravine. Crossing it seems risky.",
            skillCheck: {
                type: "roll", // Skill check type: "roll" or "attribute"
                successThreshold: 10, // Minimum roll needed to succeed
                success: { next: "bridgeSuccess", xp: 20 },
                failure: { next: "bridgeFailure", healthChange: -20 }
            },
            choices: {
                "Attempt to Cross": { challenge: true },
                "Find Another Way": { next: "longerPath", xp: 5 }
            }
        },
        bridgeSuccess: {
            text: "You carefully cross the bridge and make it to the other side safely.",
            choices: {
                "Continue": { next: "nextScene", xp: 10 }
            }
        },
        bridgeFailure: {
            text: "The bridge collapses halfway across. You barely hold on and lose health.",
            choices: {
                "Climb Back Up": { next: "nextScene", xp: 5 }
            }
        },
        longerPath: {
            text: "You take a longer route around the ravine, wasting time but staying safe.",
            choices: {
                "Continue": { next: "nextScene", xp: 5 }
            }
        }

    };
    
    function openInventory() {
        const inventoryModal = document.getElementById('inventory-modal');
        const inventoryList = document.getElementById('inventory-list');
        inventoryList.innerHTML = ''; // Clear the list
    
        inventory.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            inventoryList.appendChild(li);
        });
    
        inventoryModal.style.display = 'block';
    }
    
    document.getElementById('close-inventory').onclick = () => {
        document.getElementById('inventory-modal').style.display = 'none';
    };

    function updateProgress(sceneKey) {
        const progressList = document.getElementById('progress-list');
        const li = document.createElement('li');
        li.textContent = sceneKey;
        progressList.appendChild(li);
    }

    function saveProfile() {
        const playerName = document.getElementById('player-name').value || 'Player';
        localStorage.setItem('playerName', playerName);
        document.getElementById('profile-modal').style.display = 'none';
        document.getElementById('game-container').insertAdjacentHTML('afterbegin', `<h2>Welcome, ${playerName}!</h2>`);
    }

    function showAchievementModal(achievement) {
        const modal = document.getElementById('achievement-modal');
        const achievementName = document.getElementById('achievement-name');
        const achievementDescription = document.getElementById('achievement-description');
    
        achievementName.textContent = achievement.name;
        achievementDescription.textContent = achievement.description;
        modal.style.display = 'block';
    
        document.getElementById('close-achievement').onclick = () => {
            modal.style.display = 'none';
        };
    }
    

    function checkMilestones() {
        for (let i = milestones.length - 1; i >= 0; i--) {
            let milestone = milestones[i];
            let milestoneReached = false;
            let milestoneReason = ""; // Store the reason for reaching the milestone
    
            // Check milestone conditions and set the reason
            if (milestone.type === "xp" && gameState.xp >= milestone.value) {
                milestoneReached = true;
                milestoneReason = `Earn ${milestone.value} XP points.`;
            } else if (milestone.type === "story" && gameState.currentScene === milestone.scene) {
                milestoneReached = true;
                milestoneReason = `Reach the story milestone: ${milestone.scene}.`;
            } else if (milestone.type === "items" && gameState.inventory.length >= milestone.count) {
                milestoneReached = true;
                milestoneReason = `Collect ${milestone.count} items.`;
            }
    
            // If milestone is reached, apply reward and show modal
            if (milestoneReached) {
                applyReward(milestone.reward);
    
                // Show milestone modal with milestone type, reason, and reward details
                const rewardDetails = `
                    ${milestoneReason}<br>
                    <strong>Reward:</strong> ${
                        milestone.reward.type === "item"
                            ? milestone.reward.name
                            : `${milestone.reward.amount} ${milestone.reward.type.toUpperCase()}`
                    }
                `;
    
                showModal("milestone", rewardDetails);
    
                // Remove the milestone from the list
                milestones.splice(i, 1); // Safe to splice in reverse loop
            }
        }
    }
    
    
    
    
    

    function updateProgressBars() {
        const xpProgress = document.getElementById('xp-progress');
        const healthProgress = document.getElementById('health-progress');
    
        xpProgress.style.width = `${Math.min((gameState.xp / 200) * 100, 100)}%`;
        healthProgress.style.width = `${gameState.health}%`;
    }

    function checkAchievements() {
        achievements.forEach((achievement) => {
            if (achievement.condition() && !unlockedAchievements.includes(achievement.id)) {
                unlockedAchievements.push(achievement.id);
                localStorage.setItem("achievements", JSON.stringify(unlockedAchievements));
                showAchievementModal(achievement);
            }
        });
    }
    
    
    
    function applyReward(reward) {
        if (reward.type === 'item') {
            gameState.inventory.push(reward.name);
            updateInventoryDisplay();
            showModal("milestone", `You received a new item: ${reward.name}`);
        } else if (reward.type === 'health') {
            gameState.health += reward.amount;
            gameState.health = Math.min(100, gameState.health);
            healthDisplay.textContent = gameState.health;
            updateProgressBars();
            showModal("milestone", `Your health increased by ${reward.amount}!`);
        } else if (reward.type === 'xp') {
            gameState.xp += reward.amount;
            gameState.playerStats.totalXP += reward.amount;
            xpDisplay.textContent = gameState.xp;
            updateProgressBars();
            showModal("milestone", `You gained ${reward.amount} XP!`);
        }
    }
    
    
    
    
    
    function showModal(type, message) {
        const modal = document.getElementById(`${type}-modal`);
        const modalMessage = document.getElementById(`${type}-message`);
    
        if (!modal || !modalMessage) {
            console.error(`Modal or message element not found for type: ${type}`);
            return;
        }
    
        // Use innerHTML to interpret the message as HTML
        modalMessage.innerHTML = message;
        modal.style.display = "block";
    
        document.getElementById(`close-${type}`).onclick = () => {
            modal.style.display = "none";
        };
    }
    
    
    
    
    
    function gameOver() {
        storyText.textContent = "Your health has dropped to zero. Game over.";
        choices.innerHTML = '';
        timerDisplay.textContent = '';
        displayStats();
    }

    // Function to update the story and XP
    function updateStory(sceneKey) {
        clearInterval(timerInterval); // Clear any existing timer
        const scene = story[sceneKey];
        gameState.currentScene = sceneKey; // Update current scene in gameState
    
        storyText.style.opacity = 0;
        setTimeout(() => {
            storyText.textContent = scene.text;
            storyText.style.opacity = 1;
        }, 500);
        choices.innerHTML = '';
        timerDisplay.textContent = ''; // Reset the timer display
    
        if (scene.skillCheck) {
            handleSkillCheck(scene);
            return; // Prevent further rendering since the skill check determines the next scene
        }
    
        for (const [choiceText, choiceDetails] of Object.entries(scene.choices)) {
            const button = document.createElement('button');
            button.textContent = choiceText;
    
            if (choiceDetails.requiredItem && !gameState.inventory.includes(choiceDetails.requiredItem)) {
                button.disabled = true;
                button.title = `You need a ${choiceDetails.requiredItem} to proceed.`;
            } else {
                button.addEventListener('click', () => {
                    clearInterval(timerInterval); // Stop the timer on choice
                    gameState.xp += parseInt(choiceDetails.xp || 0, 10);
                    gameState.playerStats.totalXP += parseInt(choiceDetails.xp || 0, 10); // Correct reference
                    xpDisplay.textContent = gameState.xp;
    
                    if (choiceDetails.healthChange !== undefined) {
                        gameState.health += choiceDetails.healthChange;
                        gameState.health = Math.min(100, gameState.health);
                        gameState.playerStats.healthChanges += choiceDetails.healthChange; // Correct reference
                        healthDisplay.textContent = gameState.health;
    
                        if (gameState.health <= 0) {
                            gameOver();
                            return;
                        }
                    }
    
                    if (choiceDetails.items) {
                        choiceDetails.items.forEach(item => {
                            if (!gameState.inventory.includes(item)) {
                                gameState.inventory.push(item);
                                gameState.playerStats.itemsCollected++; // Correct reference
                            }
                        });
                        updateInventoryDisplay();
                    }
    
                    gameState.playerStats.choicesMade++; // Correct reference
                    displayStats();
                    updateStory(choiceDetails.next);
                    checkAchievements(); 
                    checkMilestones();
                });
            }
    
            choices.appendChild(button);
        }
    
        if (scene.timed) {
            startTimer(scene.timer, scene.defaultChoice);
        }
    }



    function startTimer(duration, defaultChoice) {
        let timeLeft = duration;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;
    
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time left: ${timeLeft}s`;
    
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
    
                // Retrieve the default choice directly
                const defaultDetails = story[currentScene].choices[defaultChoice];
    
                if (defaultDetails) {
                    updateStory(defaultDetails.next);
                } else {
                    console.error(`Default choice "${defaultChoice}" not found in the current scene.`);
                }
            }
        }, 1000);
    }

    function updateInventoryDisplay() {
        inventoryDisplay.textContent = inventory.length > 0
            ? inventory.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(", ")
            : "Empty";
    }

    function updateInventoryDisplay() {
        inventoryDisplay.textContent = inventory.length > 0 
            ? inventory.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(", ") 
            : "Empty";
    }

    function saveGame() {
        const savedState = {
            currentScene: gameState.currentScene,
            xp: gameState.xp,
            health: gameState.health,
            inventory: gameState.inventory,
            playerStats: gameState.playerStats
        };
        localStorage.setItem('gameState', JSON.stringify(savedState));
        alert('Game saved successfully!');
    }
    
    
    function loadGame() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const gameData = JSON.parse(savedState);
            Object.assign(gameState, gameData); // Merge saved state into gameState
    
            updateInventoryDisplay();
            xpDisplay.textContent = gameState.xp;
            healthDisplay.textContent = gameState.health;
            displayStats();
            updateStory(gameState.currentScene);
    
            alert('Game loaded successfully!');
        } else {
            alert('No saved game found.');
        }
    }
    
    

    function displayStats() {
        statsDisplay.innerHTML = `
            <h2>Player Statistics</h2>
            <p>Choices Made: ${gameState.playerStats.choicesMade}</p>
            <p>Total XP Earned: ${gameState.playerStats.totalXP}</p>
            <p>Items Collected: ${gameState.playerStats.itemsCollected}</p>
            <p>Total Health Changes: ${gameState.playerStats.healthChanges}</p>
        `;
    }

    updateStory("start");
    updateInventoryDisplay();
    displayStats();
});
