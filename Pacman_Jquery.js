	import { globalShowDialog } from './Pacman';

	//// GLOHAL CONSTANTS
	// Speeds
	const INTERVAL_MOVE = 130;//65; // milliseconds
	
	// Durations
	const INTERVAL_DURATION_GHOST_EVASIVE = 10000;
	const INTERVAL_DURATION_GHOST_BLINKING = 6000;
	const INTERVAL_DURATION_GHOST_SPAWNING = 6000;
	const INTERVAL_DURATION_FRUIT_IS_ON = 7000;
	
	// Limits
	const LIMIT_SWITCH_BEHAVIOUR = 50;
	
	// Scoring
	var TOTAL_LIVES = 2;
	var TOTAL_DOTS = 234;
	var COUNT_FRUIT_1 = 70;
	var COUNT_FRUIT_2 = 170;
	var POINTS_FOR_DOT = 10;
	var POINTS_FOR_PILL = 50;
	var POINTS_FOR_GHOST = [];
	POINTS_FOR_GHOST[1] = 200;
	POINTS_FOR_GHOST[2] = 400;
	POINTS_FOR_GHOST[3] = 800;
	POINTS_FOR_GHOST[4] = 1600;
	var POINTS_TO_BONUS_LIFE = 10000;
	
	var DISTANCE_INCREMENT = 15;
	var WALL_INCREMENT = 15;
	
	var KEY_DOWN  = 40;
	var KEY_UP    = 38;
	var KEY_LEFT  = 37;
	var KEY_RIGHT = 39;
		
	var KEY_NUMBER_TO_WORD = [];
	KEY_NUMBER_TO_WORD[40] = 'down';
	KEY_NUMBER_TO_WORD[38] = 'up';
	KEY_NUMBER_TO_WORD[37] = 'left';
	KEY_NUMBER_TO_WORD[39] = 'right';
	
	var GHOST_BEHAVIOUR_AGGRESSIVE = 'aggressive';
	var GHOST_BEHAVIOUR_AMBUSH     = 'ambush';
	var GHOST_BEHAVIOUR_EVASIVE    = 'evasive';
	var GHOST_BEHAVIOUR_RANDOM     = 'random';
	var GHOST_BEHAVIOUR_HOMING     = 'homing';
	var GHOST_BEHAVIOUR_BLINKING   = 'blinking';
	var GHOST_BEHAVIOUR_SPAWNING   = 'spawning';
		
	var STEPS_RATIO_RANDOM = 1;
	var STEPS_RATIO_EVASIVE = 2;
	
	var ID_READY_TEXT_DIV = 'dotDiv_175px_250px';
	
	//// GLOBAL VARIABLES
	window.gameIsPaused = false;
	var gameIsRunning = false;
	var gCurrentMoveInterval = 0;
	var gEvasiveGhostTimeout;
    var gBlinkingGhostTimeout;
	var gFruitDivOffTimeout;
	var gEatenDotCount = 0;
	var gEatenGhostsCount = 0;
	
	// Live variables
	var gStage = 0;
	var gScore = 0;
	var gLives = 0;
	var gInterval = null;
	var gGhostsOutOfHouse = [];
	var gframeCount = 0;
	var gJabbaArray = [];
	var gFruitIsOn = false;
	var gNextBonusLifeFlag = POINTS_TO_BONUS_LIFE;
	var sprites	= [];
    
	var ARRAY_GHOST_IDS = ['ghostred', 'ghostblue', 'ghostpink', 'ghostorange'];
	var ARRAY_FRUIT = [	
		{ 
			fruit: 'cherry',
			points: 100
		},
		{
			fruit:'strawberry', 
			points: 300
			
		},
		{
			fruit:'orange', 
			points: 500
			
		},
		{
			fruit:'apple', 
			points: 700	
		},
		{
			fruit:'melon', 
			points: 1000	
		}
	];
	
        
	// 1 = wall
	// 0 = pathway with normal dot
	// 2 = pathway with magic pill
	// -1 = pathway with no dot or pill
	
							  
	var wallArray          = [[ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // 0
							  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // 1
							  [ 0,  1,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  1,  0], // 2
							  [ 0,  2,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  2,  0], // 3
							  [ 0,  1,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  1,  0], // 4
							  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // 5
							  [ 0,  1,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  1,  0], // 6
							  [ 0,  1,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  1,  0], // 7
 							  [ 0,  1,  1,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  1,  1,  0], // 8
							  [ 0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0, -1,  0,  0, -1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 9
							  [ 0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0, -1,  0,  0, -1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 10
							  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 11
							  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1,  0,  0,  0, -3, -3,  0,  0,  0, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 12
							  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1,  0, -2, -2, -2, -2, -2, -2,  0, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 13
							  [-1, -1, -1, -1, -1, -1,  1, -1, -1, -1,  0, -2, -2, -2, -2, -2, -2,  0, -1, -1, -1,  1, -1, -1, -1, -1, -1, -1], // 14
							  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1,  0, -2, -2, -2, -2, -2, -2,  0, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 15
							  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1,  0,  0,  0,  0,  0,  0,  0,  0, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 16
							  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 17					  
							  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1,  0,  0,  0,  0,  0,  0,  0,  0, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 18
							  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1,  0,  0,  0,  0,  0,  0,  0,  0, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 19
							  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // 20
							  [ 0,  1,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  1,  0], // 21
							  [ 0,  1,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  1,  0], // 22
							  [ 0,  2,  1,  1,  0,  0,  1,  1,  1,  1, -1, -1, -1, -1, -1, -1, -1, -1,  1,  1,  1,  1,  0,  0,  1,  1,  2,  0], // 23
							  [ 0,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  0], // 24
							  [ 0,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  0], // 25
							  [ 0,  1,  1,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  1,  1,  0], // 26
							  [ 0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0], // 27
							  [ 0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0], // 28
							  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // 29
							  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]]; //30
	var LIMIT_WALL_RIGHT = wallArray.length - 1;
	var LIMIT_WALL_DOWN = wallArray[wallArray.length-1].length - 1;
	
	
	// Top only    [1,0,0,0] 8
	// Bottom only [0,0,1,0] 2
	// Left only   [0,0,0,1] 1
	// Right only  [0,1,0,0] 4
	// Top, right               [1,1,0,0] 12
	// Top, right, bottom       [1,1,1,0] 14
	// Top, right, bottom, left [1,1,1,1] 15
	// Top, bottom              [1,0,1,0] 10
	// Top, left                [1,0,0,1] 9
	// Top, right, left         [1,1,0,1] 13
	// Top, bottom, left        [1,0,1,1] 11
	// Bottom, right, left      [0,1,1,1] 7
	// Bottom, right            [0,1,1,0] 6
	// Bottom, left             [0,0,1,1] 3
	// Left, right              [0,1,0,1] 5
	// Placeholder for ghost box gif - 99
	
	
	var directionArray = 
		             // 0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27
					 [[ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // 0 
					  [ 0,  6,  5,  5,  5,  5,  7,  5,  5,  5,  5,  5,  3,  0,  0,  6,  5,  5,  5,  5,  5,  7,  5,  5,  5,  5,  3,  0], // 1
					  [ 0, 10,  0,  0,  0,  0, 10,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0, 10,  0,  0,  0,  0, 10,  0], // 2
					  [ 0, 10,  0,  0,  0,  0, 10,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0, 10,  0,  0,  0,  0, 10,  0], // 3
					  [ 0, 10,  0,  0,  0,  0, 10,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0, 10,  0,  0,  0,  0, 10,  0], // 4
					  [ 0, 14,  5,  5,  5,  5, 15,  5,  5,  7,  5,  5, 13,  5,  5, 13,  5,  5,  5,  5,  5, 15,  5,  5,  5,  5, 11,  0], // 5
					  [ 0, 10,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0, 10,  0], // 6
					  [ 0, 10,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0, 10,  0], // 7
					  [ 0, 12,  5,  5,  5,  5, 11,  0,  0, 12,  5,  5,  3,  0,  0,  6,  5,  5,  9,  0,  0, 14,  5,  5,  5,  5,  9,  0], // 8
					  [ 0,  0,  0,  0,  0,  0, 10,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0, 10,  0,  0,  0,  0,  0,  0], // 9
  					  [ 0,  0,  0,  0,  0,  0, 10,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0, 10,  0,  0,  0,  0,  0,  0], // 10
					  [ 0,  0,  0,  0,  0,  0, 10,  0,  0,  6,  5,  5, 13,  5,  5, 13,  5,  5,  3,  0,  0, 10,  0,  0,  0,  0,  0,  0], // 11
					  [ 0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  8,  8,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0], // 12
					  [ 0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  4,  4,  8,  8,  1,  1,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0], // 13
					  [ 5,  5,  5,  5,  5,  5, 15,  5,  5, 11,  0,  4,  4,  8,  8,  1,  1,  0, 14,  5,  5, 15,  5,  5,  5,  5,  5,  5], // 14
					  [ 0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  4,  4,  8,  8,  1,  1,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0], // 15
					  [ 0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0], // 16
					  [ 0,  0,  0,  0,  0,  0, 10,  0,  0, 14,  5,  5,  5,  5,  5,  5,  5,  5, 11,  0,  0, 10,  0,  0,  0,  0,  0,  0], // 17
					  [ 0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0], // 18
					  [ 0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0], // 19							  
					  [ 0,  6,  5,  5,  5,  5, 15,  5,  5, 13,  5,  5,  3,  0,  0,  6,  5,  5, 13,  5,  5, 15,  5,  5,  5,  5,  3,  0], // 20
					  [ 0, 10,  0,  0,  0,  0, 10,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0, 10,  0,  0,  0,  0, 10,  0], // 21
					  [ 0, 10,  0,  0,  0,  0, 10,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0, 10,  0,  0,  0,  0, 10,  0], // 22
					  [ 0, 12,  5,  3,  0,  0, 14,  5,  5,  7,  5,  5,  5,  5,  5,  5,  5,  5,  7,  5,  5, 11,  0,  0,  6,  5,  9,  0], // 23
					  [ 0,  0,  0, 10,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0, 10,  0,  0,  0], // 24
					  [ 0,  0,  0, 10,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0, 10,  0,  0,  0], // 25
					  [ 0,  6,  5, 13,  5,  5,  9,  0,  0, 12,  5,  5,  3,  0,  0,  6,  5,  5,  9,  0,  0, 12,  5,  5, 13,  5,  3,  0], // 26
					  [ 0, 10,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 10,  0], // 27
					  [ 0, 10,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 10,  0,  0, 10,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 10,  0], // 28
					  [ 0, 12,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5, 13,  5,  5, 13,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  9,  0], // 29
					  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]];// 30
	
	
	var foodArray =  [[ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // 0
					  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // 1
					  [ 0,  1,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  1,  0], // 2
					  [ 0,  2,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  2,  0], // 3
					  [ 0,  1,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  1,  0], // 4
					  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // 5
					  [ 0,  1,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  1,  0], // 6
					  [ 0,  1,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  1,  0], // 7
					  [ 0,  1,  1,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  1,  1,  0], // 8
					  [ 0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0, -1,  0,  0, -1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 9
					  [ 0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0, -1,  0,  0, -1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 10
					  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 11
					  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1,  0,  0,  0, -3, -3,  0,  0,  0, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 12
					  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1,  0, -2, -2, -2, -2, -2, -2,  0, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 13
					  [-1, -1, -1, -1, -1, -1,  1, -1, -1, -1,  0, -2, -2, -2, -2, -2, -2,  0, -1, -1, -1,  1, -1, -1, -1, -1, -1, -1], // 14
					  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1,  0, -2, -2, -2, -2, -2, -2,  0, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 15
					  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1,  0,  0,  0,  0,  0,  0,  0,  0, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 16
					  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 17					  
					  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1,  0,  0,  0,  0,  0,  0,  0,  0, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 18
					  [ 0,  0,  0,  0,  0,  0,  1,  0,  0, -1,  0,  0,  0,  0,  0,  0,  0,  0, -1,  0,  0,  1,  0,  0,  0,  0,  0,  0], // 19
					  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // 20
					  [ 0,  1,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  1,  0], // 21
					  [ 0,  1,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  1,  0], // 22
					  [ 0,  2,  1,  1,  0,  0,  1,  1,  1,  1, -1, -1, -1, -1, -1, -1, -1, -1,  1,  1,  1,  1,  0,  0,  1,  1,  2,  0], // 23
					  [ 0,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  0], // 24
					  [ 0,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  0], // 25
					  [ 0,  1,  1,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  0,  0,  1,  1,  1,  1,  1,  1,  0], // 26
					  [ 0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0], // 27
					  [ 0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0], // 28
					  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // 29
					  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]]; //30
							 
	
function initialiseSprites(){
	sprites = {
		pacman:{
			isMoving: false,
			id:"pacmanDiv",
			stepsRatio: STEPS_RATIO_RANDOM,
			previousDirection: "",
			currentDirection: "",
			liveDirection: "",
			intervalMover:"",
			row: 23, //15,
			column: 14, //9,
			x:210,
			y:345,
			steps: 0
		},
		ghostred:{
			isMoving:false,
			id:"ghostRedDiv",
			selfkey: "ghostred",
			stepsRatio: STEPS_RATIO_RANDOM,
			startTimeout: null,
			previousDirection: "",
			currentDirection: "",
			intervalMover:"",
			row:12, //8,
			column:13, //9,
			x:195, //180,
			y:180, //160,
			behaviour:GHOST_BEHAVIOUR_RANDOM,
			personality: GHOST_BEHAVIOUR_AGGRESSIVE,
			steps: 0
		},
		ghostblue:{
			isMoving:false,
			id:"ghostBlueDiv",
			selfkey: "ghostblue",
			stepsRatio: STEPS_RATIO_RANDOM,
			startTimeout: null,
			previousDirection: "",
			currentDirection: "",
			intervalMover:"",
			row:12,
			column:13,
			x:195,
			y:180,
			behaviour:GHOST_BEHAVIOUR_RANDOM,
			personality: GHOST_BEHAVIOUR_RANDOM,
			steps: 0
		},
		ghostpink:{
			isMoving:false,
			id:"ghostPinkDiv",
			selfkey: "ghostpink",
			stepsRatio: STEPS_RATIO_RANDOM,
			startTimeout: null,
			previousDirection: "",
			currentDirection: "",
			intervalMover:"",
			row:12,
			column:13,
			x:195,
			y:180,
			behaviour:GHOST_BEHAVIOUR_RANDOM,
			personality: GHOST_BEHAVIOUR_RANDOM,
			steps: 0
		},
		ghostorange:{
			isMoving:false,
			id:"ghostOrangeDiv",
			selfkey: "ghostorange",
			stepsRatio: STEPS_RATIO_RANDOM,
			startTimeout: null,
			previousDirection: "",
			currentDirection: "",
			intervalMover:"",
			row:12,
			column:13,
			x:195,
			y:180,
			behaviour:GHOST_BEHAVIOUR_RANDOM,
			personality: GHOST_BEHAVIOUR_RANDOM,
			steps: 0
		}
	}
	// Set initial behaviour of each ghost to personality
	sprites['ghostred'].behaviour = sprites['ghostred'].personality;
	sprites['ghostpink'].behaviour = sprites['ghostpink'].personality;
	sprites['ghostblue'].behaviour = sprites['ghostblue'].personality;
	sprites['ghostorange'].behaviour = sprites['ghostorange'].personality;
	
	// Set pacman to default stationary image
	setPacmanDivClassName('stationary-left');
	
	// Put pacman back to starting point
	var pacmanEl = document.getElementById('pacmanDiv');
	pacmanEl.style.left = sprites.pacman.column*WALL_INCREMENT+"px";
	pacmanEl.style.top = sprites.pacman.row*WALL_INCREMENT+"px";
	
	// Hide ghosts
	hideGhost('ghostRedDiv');
	hideGhost('ghostBlueDiv');
	hideGhost('ghostOrangeDiv');
	hideGhost('ghostPinkDiv');
	
	// Set the box back to three ghosts
	document.getElementById("dotDiv_175px_205px").className = "ghostBoxDiv3";
}


export function kickStartJqueryPacmanGame(){
	buildWalls();
	insertGhostBox();
	
	reloadGame();
}

export function removeJqueryPacmanEventListeners(){
	document.removeEventListener('click', pauseGame);
	document.removeEventListener('keydown', handleKeyDown);
}

export function kickStartJqueryPacmanGameWithBehaviour(behaviours){
	kickStartJqueryPacmanGame();
	
	sprites['ghostred'].personality = behaviours[0].toLowerCase();
	sprites['ghostpink'].personality = behaviours[1].toLowerCase();
	sprites['ghostblue'].personality = behaviours[2].toLowerCase();
	sprites['ghostorange'].personality = behaviours[3].toLowerCase();
}

if(document.activeElement.toString() == '[object HTMLButtonElement]'){ document.activeElement.blur();} 

function attachKeydown(){
	document.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(event){
	// ## This block is clunky simplify it!
	// As soon as player hits a key the game starts
	if (window.gameIsPaused){
		window.gameIsPaused = false;
		gameIsRunning = true;
		
		for (var i=0; i<gGhostsOutOfHouse.length; i++){
			var curGhostObj = sprites[gGhostsOutOfHouse[i]];
			// Make the ghost div visible if it was hidden by pause
			document.getElementById(curGhostObj.id).style.display = "block";
		}
		
		hideReadyText();
		
		attachClick();
	}else{
		// This is a new game
		startGame();
	}
	
	sprites.pacman.currentDirection = event.keyCode;
	sprites.pacman.liveDirection = event.keyCode;
	
	// If the game is running but pacman is not moving then set the interval otherwise don't keep on resetting the interval
	if (!sprites.pacman.isMoving && gameIsRunning) {
		// Just clear any interval to be on the safe side
		clearInterval(gInterval);
		
		sprites.pacman.isMoving = true;
		
		gInterval = setInterval(updateGameArea, INTERVAL_MOVE);
	}
}
	
	function startGame(){
		if (gameIsRunning) {
			return;
		}
		
		gameIsRunning = true;
		
		hideReadyText();
		
		startGhost(sprites.ghostred);
		sprites.ghostpink.startTimeout = setTimeout(function(){startGhost(sprites.ghostpink);}, 6000);
		sprites.ghostblue.startTimeout = setTimeout(function(){startGhost(sprites.ghostblue);}, 12000);
		sprites.ghostorange.startTimeout = setTimeout(function(){startGhost(sprites.ghostorange);}, 18000);
	}
	
	function startGhost(ghostObj) {
		// If pacman is dead already with some ghosts still unreleased just exit
		if (!gameIsRunning) return;
		
		// Initialise the ghost variables
		ghostObj.currentDirection = KEY_LEFT;
		ghostObj.isMoving = true;
		
		// Make the ghost div visible
		document.getElementById(ghostObj.id).style.display = "block";
		
		// Add ghost to update stack
		gGhostsOutOfHouse.push(ghostObj.selfkey);
		
		updateGhostBox(ghostObj.id);
	}
	
	/******************************************************
	 * This is the most important function of the game
	 * It controls everything that happens in the map at every 'move'
	 *****************************************************/
	function updateGameArea(){
		gframeCount++;
		
		// ## fix bug we can't return the whole thing - just don't want stuff to move but changing should still occur?
		//if (everyInterval(2)) return;
		
		// Update pacman position
		movePacmanOneStep();
		
		// Update ghost position
		for (var i=0; i<gGhostsOutOfHouse.length; i++){
			var curGhostObj = sprites[gGhostsOutOfHouse[i]];
			
			if (everyInterval(curGhostObj.stepsRatio)){
				moveGhostOneStep(curGhostObj);
			}
			
			if ( (Math.abs(curGhostObj.x-sprites.pacman.x) <= DISTANCE_INCREMENT) && (curGhostObj.y==sprites.pacman.y) ||
			 (Math.abs(curGhostObj.y-sprites.pacman.y) <= DISTANCE_INCREMENT) && (curGhostObj.x==sprites.pacman.x) ){
				// If pacman ate a ghost
				if (curGhostObj.behaviour==GHOST_BEHAVIOUR_EVASIVE || curGhostObj.behaviour==GHOST_BEHAVIOUR_BLINKING){
					// Temporarily pause the game
					clearInterval(gInterval);
					
					// Update score
					gEatenGhostsCount++;
					updateScore(POINTS_FOR_GHOST[gEatenGhostsCount]);
					
					// Hide pacman and ghost when eaten
					setPacmanDivClassName('invisible');
					setEatenSpriteScore(curGhostObj.id, POINTS_FOR_GHOST[gEatenGhostsCount]);
					
					// Resume game after 2 second pause
					curGhostObj.startTimeout = 
						setTimeout( function(ghostObj){ 								
							var closureFn = function(){ 
								// Precaution: clear any previous interval
								clearInterval(gInterval);
								
								// Resume game
								gInterval = setInterval(updateGameArea, INTERVAL_MOVE); 
								
								// Change ghost to homing mode
								enterHomingGhostMode(ghostObj);
								
								// Set pacman to visible
								setPacmanDivClassName(KEY_NUMBER_TO_WORD[sprites.pacman.currentDirection]);
							}; 
							return closureFn;
						}(curGhostObj), 1000);
						
				}else if(curGhostObj.behaviour==GHOST_BEHAVIOUR_HOMING){
					// do nothing
				}else{
					// Pacman died
					stopGame();
					
					doPacmanDyingSequence();
				}
			}
		}
		
		// Detect if pacman has eaten a fruit
		if (sprites.pacman.row==17 && sprites.pacman.column==13 && gFruitIsOn){
			// Reset fruit flag
			gFruitIsOn = false;
			
			// Temporarily pause the game
			clearInterval(gInterval);
			
			updateScore(ARRAY_FRUIT[gStage].points);
			
			// Hide pacman when eating cherry
			setPacmanDivClassName('invisible');
			setEatenSpriteScore(ID_READY_TEXT_DIV, ARRAY_FRUIT[gStage].points);
			
			// Resume game after 2 second pause
			// ## Test: What if a ghost has just been eaten?
			
			// Precaution: clear any previous interval
			setTimeout( function(){
				clearInterval(gInterval);
			
				// Resume game
				gInterval = setInterval(updateGameArea, INTERVAL_MOVE);
				
				// Clear score from div
				setEatenSpriteScore(ID_READY_TEXT_DIV, '');
			}, 500);
		}
	}
	
	
	function buildWalls(){
		var mapDiv = document.getElementById('mapDiv');
		mapDiv.innerHTML = '';
		
		var builtDiv;
		var borderMargin = 5; var borderRadius = 7;
		for (var row = 0; row < directionArray.length; row++){
			var marginTop = 0, marginBottom = 0, marginRight = 0, marginLeft = 0;
			var borderTopLeftRadius  = 0, borderTopRightRadius  = 0, borderBottomLeftRadius  = 0, borderBottomRightRadius  = 0;
			for (var i = 0; i < directionArray[row].length; i++) {
				if (wallArray[row][i]==0){
					// Build wall at this position
					
					marginTop = marginBottom = marginRight = marginLeft = 0;
					borderTopLeftRadius  = borderTopRightRadius  = borderBottomLeftRadius  = borderBottomRightRadius  = 0;
					//// Calculate corners
					if (row>0 && wallArray[row-1][i]!=0){
						marginTop = borderMargin; 
						if (i>0 && wallArray[row][i-1]!=0){
							borderTopLeftRadius  = borderRadius;
						}else if (i<wallArray[row].length-1 && wallArray[row][i+1]!=0){
							borderTopRightRadius  = borderRadius;
						}
					}
					if (row<wallArray.length-1 && wallArray[row+1][i]!=0){
						marginBottom = borderMargin;
						if (i>0 && wallArray[row][i-1]!=0){
							borderBottomLeftRadius  = borderRadius;
						}else if (i<wallArray[row].length-1 && wallArray[row][i+1]!=0){
							borderBottomRightRadius  = borderRadius;
						}
					}
					if (i>0 && wallArray[row][i-1]!=0){
						marginLeft = borderMargin;
					}
					if (i<wallArray[row].length-1 && wallArray[row][i+1]!=0){
						marginRight = borderMargin;
					}
					
					
					builtDiv = document.createElement("DIV");
					builtDiv.style.width = WALL_INCREMENT - marginLeft - marginRight +"px";
					builtDiv.style.height = WALL_INCREMENT - marginTop - marginBottom +"px";
					builtDiv.style.position = "absolute";
					builtDiv.style.backgroundColor = "blue";
					builtDiv.style.left = i*WALL_INCREMENT+"px";
					builtDiv.style.top  = row*WALL_INCREMENT+"px";
					builtDiv.style.marginTop    = marginTop+"px";
					builtDiv.style.marginBottom = marginBottom+"px";
					builtDiv.style.marginLeft   = marginLeft+"px";
					builtDiv.style.marginRight  = marginRight+"px";
					builtDiv.style.borderTopLeftRadius     = borderTopLeftRadius+"px";
					builtDiv.style.borderTopRightRadius    = borderTopRightRadius+"px";
					builtDiv.style.borderBottomLeftRadius  = borderBottomLeftRadius+"px";
					builtDiv.style.borderBottomRightRadius = borderBottomRightRadius+"px";
					builtDiv.className = "wallDiv"; 
				}else{
					var onTop = false;
					borderTopLeftRadius  = borderTopRightRadius  = borderBottomLeftRadius  = borderBottomRightRadius  = 0;
					//// Calculate corners
					if (row>0 && wallArray[row-1][i]!=1){
						if (i>0 && wallArray[row][i-1]!=1){
							borderTopLeftRadius  = borderRadius;
							onTop = true;
						}else if (i<wallArray[row].length-1 && wallArray[row][i+1]!=1){
							borderTopRightRadius  = borderRadius;
							onTop = true;
						}
					}
					if (row<wallArray.length-1 && wallArray[row+1][i]!=1){
						if (i>0 && wallArray[row][i-1]!=1){
							borderBottomLeftRadius  = borderRadius;
							onTop = true;
						}else if (i<wallArray[row].length-1 && wallArray[row][i+1]!=1){
							borderBottomRightRadius  = borderRadius;
							onTop = true;
						}
					}
					
					// Build dot at this position
					builtDiv = document.createElement("DIV");
					builtDiv.style.width = WALL_INCREMENT+10+"px";
					builtDiv.style.height = WALL_INCREMENT+10+"px";
					builtDiv.style.position = "absolute";
					builtDiv.style.backgroundColor = "black";
					builtDiv.style.left = i*WALL_INCREMENT-5+"px";
					builtDiv.style.top  = row*WALL_INCREMENT-5+"px";
					builtDiv.style.zIndex = (onTop) ? 1001 : 1;
					builtDiv.style.borderTopLeftRadius     = borderTopLeftRadius+"px";
					builtDiv.style.borderTopRightRadius    = borderTopRightRadius+"px";
					builtDiv.style.borderBottomLeftRadius  = borderBottomLeftRadius+"px";
					builtDiv.style.borderBottomRightRadius = borderBottomRightRadius+"px";
					builtDiv.id = "dotDiv_"+builtDiv.style.left+"_"+builtDiv.style.top;
					switch (wallArray[row][i]){
						case 1:
							builtDiv.className = "dotDiv";
							break;
						case 2:
							builtDiv.className = "magicPillDiv";
							break;
						case -1:
							break;
					}
				}
				mapDiv.appendChild(builtDiv);
			}
		}
	}
	
	function insertGhostBox(){
		var ghostBox1 = document.getElementById("dotDiv_175px_205px");
		ghostBox1.style.width = "70px";
		ghostBox1.style.height = "30px";
		ghostBox1.className = "ghostBoxDiv3";
		ghostBox1.style.zIndex = "1002";
	}
		
	function movePacmanOneStep(){
	
		// ## In a previous iteration we might have switched current (actual executed) direction to a previous direction if the user was pressing a key in the direction of an obstacle, so we need
		// to switch back to the direction that is actually being pressed
		sprites.pacman.currentDirection = sprites.pacman.liveDirection;
		
		var currentRow = sprites.pacman.row;
		var currentColumn = sprites.pacman.column;
		var currentX = sprites.pacman.x;
		var currentY = sprites.pacman.y;
	
		// Enter tunnel
		if ((currentRow==14 && currentColumn==0 && sprites.pacman.currentDirection==KEY_LEFT) || (currentRow==14 && currentColumn==27 && sprites.pacman.currentDirection==KEY_RIGHT)) { 
			if (currentRow==14 && currentColumn==0){ 
				currentColumn = 27;
			}else if (currentRow==14 && currentColumn==27){
				currentColumn = 0;
			}
			currentX = currentColumn*DISTANCE_INCREMENT;
			
			sprites.pacman.x = currentX;
			sprites.pacman.column = currentColumn;
			
			var pacmanEl = document.getElementById(sprites.pacman.id);
			pacmanEl.style.left = currentX+"px";
			return;
		}
	
		var movementObj = getMovementObject(sprites.pacman.currentDirection, currentRow, currentColumn, currentX, currentY);
		
		if (movementObj.canMove){
			// We have moved in this direction so we can't move in the previous direction, forget about it
			sprites.pacman.isMoving = true;
			sprites.pacman.previousDirection = sprites.pacman.currentDirection;
			
			// Change the gif of the pacman based on which direction its moving in
			setPacmanDivClassName(KEY_NUMBER_TO_WORD[sprites.pacman.currentDirection]);
			
		}else{
			// If we can't move in the specified direction ie. because of a wall in the way 
			// then check to see whether we can continue moving in the previous direction
			if (sprites.pacman.previousDirection!=sprites.pacman.currentDirection){
				sprites.pacman.currentDirection = sprites.pacman.previousDirection;
			
				movementObj = getMovementObject(sprites.pacman.currentDirection, currentRow, currentColumn, currentX, currentY);
			}else{
				// Stop pacman
				showStationaryPacman();
			}
		}
		
			
		// Update actual html element and update sprite object properties
		sprites.pacman.isMoving = movementObj.canMove;
		if (sprites.pacman.isMoving){
			var spriteEl = document.getElementById(sprites.pacman.id);
			spriteEl.style[movementObj.cssPos] = movementObj.cssPosVal+"px";
			sprites.pacman.row = movementObj.row;
			sprites.pacman.column = movementObj.column;
			sprites.pacman.x = movementObj.x;
			sprites.pacman.y = movementObj.y;
			
			// Update dot div because it is eaten
			var posX = sprites.pacman.column*DISTANCE_INCREMENT-5;
			var posY = sprites.pacman.row*DISTANCE_INCREMENT-5;
			var currentDotDiv = document.getElementById("dotDiv_"+posX+"px_"+posY+"px");
			// If pacman has just eaten a dot
			if (movementObj.hasDot){
				gEatenDotCount++;
				updateScore(POINTS_FOR_DOT);
				
				// Check if pacman has eaten all the dots
				if (gEatenDotCount==TOTAL_DOTS){
					// Game completed!
					stopGame();
					
					doCompletedGraphicsSequence();
					
					return;
				}else if(gEatenDotCount==COUNT_FRUIT_1){
					setFruitDiv();
				}else if(gEatenDotCount==COUNT_FRUIT_2){
					setFruitDiv();
				}
			}
			
			// Check if it is a special pill then enter evasive ghost mode
			if (currentDotDiv.className=="magicPillDiv"){
				enterEvasiveGhostMode();
				updateScore(POINTS_FOR_PILL);
			}
			currentDotDiv.className = "";
			
			
			// Clear the next square of food
			gJabbaArray[movementObj.row][movementObj.column] = 0;
		}
	}
	
	function getMovementObject(dir, row, col, x, y){
		// Returns movement object
		var movementObj = {
			canMove: true,
			cssPosVal: 0,
			cssPos: "lala",
			row: 0,
			column: 0,
			x: 0,
			y: 0
		}

		movementObj.y = y;
		movementObj.x = x;
		movementObj.row = row;
		movementObj.column = col;
		
		gCurrentMoveInterval = INTERVAL_MOVE;
			
		switch (dir){
			case KEY_DOWN:
				movementObj.cssPos = "top";
				
				if (directionArray[row+1][col]==0) {
					// There's a wall in this direction
					movementObj.cssPosVal = row * WALL_INCREMENT;
					movementObj.canMove = false;
				}else{
					// If the next square has food Pacman moves at normal speed
					if (gJabbaArray[row+1][col]==1){
						gCurrentMoveInterval = INTERVAL_MOVE;
						// Tell the main caller that pacman is about to eat a dot so that the count can be updated to win the game
						movementObj.hasDot = true;
					}
					
					movementObj.cssPosVal = y + DISTANCE_INCREMENT;
					movementObj.row = row+1;
					movementObj.column = col;
				}
				movementObj.y = movementObj.cssPosVal;
				break;
			case KEY_UP:
				movementObj.cssPos = "top";
				
				if (directionArray[row-1][col]==0) { 
					// There's a wall in this direction
					movementObj.cssPosVal = row * WALL_INCREMENT;
					movementObj.canMove = false;
				}else{
					// If the next square has food Pacman moves at normal speed
					if (gJabbaArray[row-1][col]==1){
						gCurrentMoveInterval = INTERVAL_MOVE;
						// Tell the main caller that pacman is about to eat a dot so that the count can be updated to win the game
						movementObj.hasDot = true;
					}
					
					movementObj.cssPosVal = y - DISTANCE_INCREMENT;
					movementObj.row = row-1;
					movementObj.column = col;
				}
				movementObj.y = movementObj.cssPosVal;
				break;
			case KEY_LEFT:
				movementObj.cssPos = "left";
				
				if (directionArray[row][col-1]==0) {
					// There's a wall in this direction
					movementObj.cssPosVal = col * WALL_INCREMENT;
					movementObj.canMove = false;
				}else{
					// If the next square has food Pacman moves at normal speed
					if (gJabbaArray[row][col-1]==1){
						gCurrentMoveInterval = INTERVAL_MOVE;
						// Tell the main caller that pacman is about to eat a dot so that the count can be updated to win the game
						movementObj.hasDot = true;
					}
					
					movementObj.cssPosVal = x - DISTANCE_INCREMENT;
					movementObj.row = row;
					movementObj.column = col-1;
				}
				movementObj.x = movementObj.cssPosVal;
				break;
			case KEY_RIGHT:
				movementObj.cssPos = "left";
				
				if (directionArray[row][col+1]==0) {
					// There's a wall in this direction
					movementObj.cssPosVal = col * WALL_INCREMENT;
					movementObj.canMove = false;
				}else{
					// If the next square has food Pacman moves at normal speed
					if (gJabbaArray[row][col+1]==1){
						gCurrentMoveInterval = INTERVAL_MOVE;
						// Tell the main caller that pacman is about to eat a dot so that the count can be updated to win the game
						movementObj.hasDot = true;
					}
					
					movementObj.cssPosVal = x + DISTANCE_INCREMENT;
					movementObj.row = row;
					movementObj.column = col+1;
				}
				movementObj.x = movementObj.cssPosVal;
				break;
			default:
				// do nothing
				break;
		}
			
		return movementObj;
	}
	
	
	function enterHomingGhostMode(ghostObj){
		ghostObj.behaviour = GHOST_BEHAVIOUR_HOMING;
		
		ghostObj.stepsRatio = STEPS_RATIO_RANDOM;
		
		// CSS of homing ghost
		setEatenSpriteScore(ghostObj.id, '');
	}
	
	function enterEvasiveGhostMode(){
		// Reset eaten ghost count everytime a new pill is eaten
		gEatenGhostsCount = 0;
		
		for (var i=0; i<ARRAY_GHOST_IDS.length; i++){
			var currentGhost = sprites[ ARRAY_GHOST_IDS[i] ];
			// If the ghost are a pair of eyes travelling home don't change it into a scared ghost again
			if (currentGhost.behaviour==GHOST_BEHAVIOUR_HOMING || currentGhost.behaviour==GHOST_BEHAVIOUR_SPAWNING){
				continue;
			}
			// If the ghost is trying to leave house (random) but still in the house then don't change behaviour to evasive as this
			// could cause an infinite loop
			//if (currentGhost.x)
			
			// Slow down the travel speed of the ghosts 
			currentGhost.stepsRatio = STEPS_RATIO_EVASIVE;
			
			// If ghost is anything other than homing eyes change the behaviour mode
			currentGhost.behaviour = GHOST_BEHAVIOUR_EVASIVE;
		}				
		
		clearTimeout(gBlinkingGhostTimeout);
		gBlinkingGhostTimeout = setTimeout(changeToBlinkingGhostCss, INTERVAL_DURATION_GHOST_BLINKING);
		
		clearTimeout(gEvasiveGhostTimeout);
		gEvasiveGhostTimeout = setTimeout(exitEvasiveGhostMode, INTERVAL_DURATION_GHOST_EVASIVE);
	}
	
	function changeToBlinkingGhostCss(){
		if (!gameIsRunning) return;
		
		for (var i=0; i<ARRAY_GHOST_IDS.length; i++){
			var currentGhost = sprites[ ARRAY_GHOST_IDS[i] ];
		
			if ( currentGhost.behaviour == GHOST_BEHAVIOUR_EVASIVE ){
				currentGhost.behaviour = GHOST_BEHAVIOUR_BLINKING;
			}
		}
	}
	
	function exitEvasiveGhostMode(ghostObj){
		if (!gameIsRunning) return;
		
		// Check if there is an argument to specify any one ghost
		var ghostIds = (arguments.length==1) ? [ ghostObj.selfkey ] : ARRAY_GHOST_IDS;
		
		for (var i=0; i<ghostIds.length; i++){
			var currentGhost = sprites[ ghostIds[i] ];
			
			// If the ghost are a pair of eyes travelling home don't change it into a ghost 
			if (currentGhost.behaviour == GHOST_BEHAVIOUR_HOMING || currentGhost.behaviour == GHOST_BEHAVIOUR_SPAWNING){
				continue;
			}
			
			// Set behaviour and travel speed to random mode
			currentGhost.behaviour =  GHOST_BEHAVIOUR_RANDOM;
			currentGhost.stepsRatio = STEPS_RATIO_RANDOM;
			
			// Reset ghost appearance to default
			setGhostDivBehaviourClassName(currentGhost.id, "");
		}
	}
	
	function moveGhostOneStep(spriteObj) {  
		var newDirection;
		switch (spriteObj.behaviour){
			case GHOST_BEHAVIOUR_AGGRESSIVE:
				newDirection = getAggressiveDirection(spriteObj);
				break;
			case GHOST_BEHAVIOUR_AMBUSH:
				newDirection = getAmbushDirection(spriteObj);
				break;
			case GHOST_BEHAVIOUR_EVASIVE:
			case GHOST_BEHAVIOUR_BLINKING:
				newDirection = getEvasiveDirection(spriteObj);
				break;
			case GHOST_BEHAVIOUR_HOMING:
				newDirection = getHomingDirection(spriteObj);
				break;
			case GHOST_BEHAVIOUR_SPAWNING:
				newDirection = getSpawningDirection(spriteObj);
				break;
			case GHOST_BEHAVIOUR_RANDOM:
			default:
				newDirection = getRandomDirection(spriteObj);
				break;
		}
		spriteObj.currentDirection = newDirection;
		spriteObj.previousDirection = spriteObj.currentDirection;
		
		var cssPos;
		var cssPosVal;
		var currentRow = spriteObj.row;
		var currentColumn = spriteObj.column;
		var currentX = spriteObj.x;
		var currentY = spriteObj.y;
		
		// Enter tunnel
		if ((currentRow==14 && currentColumn==0 && spriteObj.currentDirection==KEY_LEFT) || (currentRow==14 && currentColumn==27 && spriteObj.currentDirection==KEY_RIGHT)) { 
			if (currentRow==14 && currentColumn==0){ 
				currentColumn = 27;
			}else if (currentRow==14 && currentColumn==27){
				currentColumn = 0;
			}
			currentX = currentColumn*DISTANCE_INCREMENT;
			
			spriteObj.x = currentX;
			spriteObj.column = currentColumn;
			
			var spriteEl = document.getElementById(spriteObj.id);
			spriteEl.left = currentX + 'px';
			return;
		}
		
		// Normal map
		switch (spriteObj.currentDirection){
			case KEY_DOWN:
				cssPos = "top";
				cssPosVal = currentY + DISTANCE_INCREMENT;
				spriteObj.row = currentRow+1;
				spriteObj.column = currentColumn;
				spriteObj.y = cssPosVal;
				break;
			case KEY_UP:
				cssPos = "top";
				cssPosVal = currentY - DISTANCE_INCREMENT;
				spriteObj.row = currentRow-1;
				spriteObj.column = currentColumn;
				spriteObj.y = cssPosVal;
				break;
			case KEY_LEFT:
				cssPos = "left";
				cssPosVal = currentX - DISTANCE_INCREMENT;
				spriteObj.row = currentRow;
				spriteObj.column = currentColumn-1;
				spriteObj.x = cssPosVal;
				break;
			case KEY_RIGHT:
				cssPos = "left";
				cssPosVal = currentX + DISTANCE_INCREMENT;
				spriteObj.row = currentRow;
				spriteObj.column = currentColumn+1;
				spriteObj.x = cssPosVal;
				break;
		}
			
		// Move ghost div
		var spriteEl = document.getElementById(spriteObj.id);
		spriteEl.style[cssPos] = cssPosVal + 'px';
		// Remove all direction classes and add current direction class to move eyes
		spriteEl.className = "ghost " + spriteObj.behaviour + " " + KEY_NUMBER_TO_WORD[spriteObj.currentDirection];
		
	}
		
	function getAggressiveDirection(ghostObj){
		//// Determine shortest way to get to pacman
		// Decide whether to go up/down and right/left based on where pacman is
		var xDirection = (sprites.pacman.column - ghostObj.column > 0) ? KEY_RIGHT : KEY_LEFT;
		var yDirection = (sprites.pacman.row - ghostObj.row > 0) ? KEY_DOWN : KEY_UP;
		
		// Choose longest path to pacman
		var altDirection, newDirection;
		if (xDirection > yDirection) {
			newDirection = xDirection;
			altDirection = yDirection;
		}else{
			newDirection = yDirection;
			altDirection = xDirection;
		}
		if (!canMoveInDirection(newDirection, ghostObj.row, ghostObj.column, ghostObj.currentDirection)){
			// Then chase after pacman using other direction
			newDirection = altDirection;
			while (!canMoveInDirection(newDirection, ghostObj.row, ghostObj.column, ghostObj.currentDirection)){
				// If there is an obstruction in the vertical direction just pick a random direction
				newDirection =  Math.floor(Math.random() * 4) + KEY_LEFT;
			}
		}
		
		return newDirection;
	}
	
	function getAmbushDirection(ghostObj){
		//// Determine shortest way to get to two squares in front of pacman
		var predictedCol, predictedRow;
		switch (sprites.pacman.currentDirection){
			case KEY_LEFT:
				predictedCol = (sprites.pacman.column - 2 <= 1) ? 1 : sprites.pacman.column - 2;
				predictedRow = sprites.pacman.row;
				break;
			case KEY_RIGHT:
				predictedCol = (sprites.pacman.column + 2 >= LIMIT_WALL_RIGHT) ? LIMIT_WALL_RIGHT : sprites.pacman.column + 2;
				predictedRow = sprites.pacman.row;
				break;
			case KEY_UP:
				predictedRow = (sprites.pacman.row - 2 <= 1) ? 1 : sprites.pacman.row - 2;
				predictedCol = sprites.pacman.column;
				break;
			case KEY_DOWN:
				predictedRow = (sprites.pacman.row + 2 <= LIMIT_WALL_DOWN) ? 1 : sprites.pacman.row - 2;
				predictedCol = sprites.pacman.column;
				break;
			
		}
		
		// Decide whether to go up/down and right/left based on where pacman will be in two moves
		sprites.pacman.currentDirection
		var xDirection = (predictedCol - ghostObj.column > 0) ? KEY_RIGHT : KEY_LEFT;
		var yDirection = (predictedRow - ghostObj.row > 0) ? KEY_DOWN : KEY_UP;
		
		// Choose shortest predicted path to pacman
		var altDirection, newDirection;
		if (xDirection < yDirection) {
			newDirection = xDirection;
			altDirection = yDirection;
		}else{
			newDirection = yDirection;
			altDirection = xDirection;
		}
		if (!canMoveInDirection(newDirection, ghostObj.row, ghostObj.column, ghostObj.currentDirection)){
			// Then chase after pacman using other direction
			newDirection = altDirection;
			while (!canMoveInDirection(newDirection, ghostObj.row, ghostObj.column, ghostObj.currentDirection)){
				// If there is an obstruction in the vertical direction just pick a random direction
				newDirection =  Math.floor(Math.random() * 4) + KEY_LEFT;
			}
		}
		
		return newDirection;
	}
		
	function getRandomDirection(ghostObj){
		// Catch error
		if (ghostObj.behaviour!=GHOST_BEHAVIOUR_RANDOM){
			alert('Evasive:validationfail for '+ ghostObj.id + ': newdirection='+ KEY_NUMBER_TO_WORD[newDirection] + ', (' + ghostObj.row + ', ' + ghostObj.column + '), currentdirection=' + KEY_NUMBER_TO_WORD[ghostObj.currentDirection] + ', ' + ghostObj.behaviour);
		}
		
		var newDirection = Math.floor(Math.random() * 4) + KEY_LEFT;
		var loopCounter = 0;
		while (!canMoveInDirection(newDirection, ghostObj.row, ghostObj.column, ghostObj.currentDirection)){
			newDirection =  Math.floor(Math.random() * 4) + KEY_LEFT;
			
			loopCounter++;
			if (loopCounter>=50){
				alert('Random:looping too many times to find direction for '+ ghostObj.id + ': newdirection='+ KEY_NUMBER_TO_WORD[newDirection] + ', (' + ghostObj.row + ', ' + ghostObj.column + '), currentdirection=' + KEY_NUMBER_TO_WORD[ghostObj.currentDirection] + ', ' + ghostObj.behaviour);
			}
		}
		return newDirection;
	}
	
	function getEvasiveDirection(ghostObj){
		// Run away from pacman horizontally if possible
		var newDirection = (sprites.pacman.column - ghostObj.column > 0) ? KEY_LEFT : KEY_RIGHT;
		// If there is an obstruction in the horizontal direction 
		if (!canMoveInDirection(newDirection, ghostObj.row, ghostObj.column, ghostObj.currentDirection)){
			// Then run away from pacman vertically
			newDirection = (sprites.pacman.row - ghostObj.row > 0) ? KEY_UP : KEY_DOWN;
			var loopCounter = 0;
			while (!canMoveInDirection(newDirection, ghostObj.row, ghostObj.column, ghostObj.currentDirection)){
				loopCounter++;
				// If there is an obstruction in the vertical direction just pick a random direction
				newDirection =  Math.floor(Math.random() * 4) + KEY_LEFT;
				
				if (loopCounter>=50){
					alert('Evasive:looping too many times to find direction for '+ ghostObj.id + ': newdirection='+ KEY_NUMBER_TO_WORD[newDirection] + ', (' + ghostObj.row + ', ' + ghostObj.column + '), currentdirection=' + KEY_NUMBER_TO_WORD[ghostObj.currentDirection] + ', ' + ghostObj.behaviour);
				}
			}
		}
		return newDirection;
	}
	
	function getHomingDirection(ghostObj){
		if (ghostObj.column==13){
			switch (ghostObj.row){
				case 11:
				case 12:
				case 13:
					// If we are in front of door just go inside
					return KEY_DOWN;
				case 14:
					// If we have entered the house change behaviour to spawning
					ghostObj.behaviour = GHOST_BEHAVIOUR_SPAWNING;
					
					// Set timeout for ghost to spawn
					ghostObj.startTimeout = setTimeout(
					function(frozenGhostSelfKey){
						var closureFn = function()
						{
							// Set it back to a normal ghost and launch it
							sprites[frozenGhostSelfKey].behaviour = sprites[frozenGhostSelfKey].personality;
							// Place ghost at the front of the door otherwise eating another pill and going into evasive mode while ghost is
							// in the house will cause an infinite loop
							sprites[frozenGhostSelfKey].row = 12;
							sprites[frozenGhostSelfKey].column = 13;
							sprites[frozenGhostSelfKey].x = 195; 
							sprites[frozenGhostSelfKey].y = 180;
						}
						return closureFn;
					}(ghostObj.selfkey), 5000);
					
					return KEY_RIGHT;
					break;
			}
		}else if (ghostObj.column==9 && (ghostObj.row==17 || ghostObj.row==14)){
			return KEY_UP;
		}else if ((ghostObj.column==9 || ghostObj.column==12) && ghostObj.row==11){
			return KEY_RIGHT;
		}else if ((ghostObj.column==15 || ghostObj.column==18) && ghostObj.row==11){
			return KEY_LEFT;
		}else if (ghostObj.column==18 && ghostObj.row==17){
			return KEY_LEFT;
		}
		
		var newDirection;
		if (Math.abs(14 - ghostObj.column) > Math.abs(15 - ghostObj.row)){
			// If we are further away horizontally then try to go horizontal
			newDirection = (14 - ghostObj.column > 0) ? KEY_RIGHT : KEY_LEFT;
		}else{
			// We are further away vertically so try to go vertical
			newDirection = (15 - ghostObj.row > 0) ? KEY_DOWN : KEY_UP;
		}
		var loopCounter = 0;
		while (!canMoveInDirection(newDirection, ghostObj.row, ghostObj.column, ghostObj.currentDirection)){
			// If there is an obstruction in the vertical direction just pick a random direction
			newDirection =  Math.floor(Math.random() * 4) + KEY_LEFT;
			
			loopCounter++;
			if (loopCounter>=30){
				alert('Homing:looping too many times to find direction for '+ ghostObj.id + ': newdirection='+ KEY_NUMBER_TO_WORD[newDirection] + ', (' + ghostObj.row + ', ' + ghostObj.column + '), currentdirection=' + KEY_NUMBER_TO_WORD[ghostObj.currentDirection] + ', ' + ghostObj.behaviour);
			}
		}
		return newDirection;
	}
	
	function getSpawningDirection(ghostObj){
		if (ghostObj.column==11){
			return KEY_RIGHT;
		}else if (ghostObj.column>11 && ghostObj.column<16){
			if (ghostObj.currentDirection==KEY_RIGHT || ghostObj.currentDirection==KEY_LEFT){
				return ghostObj.currentDirection;
			}else{
				return KEY_RIGHT;
			}
		}else if (ghostObj.column==16){
			return KEY_LEFT;
		}else{
			// catch error
		}
	}
	
	function updateGhostBox(ghostId){
		// Change the gif of the ghost box based on how many ghosts have left the box
		var ghostBoxClassName;
		switch (ghostId){
			case "ghostRedDiv":
				ghostBoxClassName = "ghostBoxDiv3";
				break;
			case "ghostPinkDiv":
				ghostBoxClassName = "ghostBoxDiv2";
				break;
			case "ghostBlueDiv":
				ghostBoxClassName = "ghostBoxDiv1";
				break;
			case "ghostOrangeDiv":
				ghostBoxClassName = "";
				break;
		}
		document.getElementById("dotDiv_175px_205px").className = ghostBoxClassName;
	}
		
	function stopGame(){
		clearInterval(gInterval);
		
		gameIsRunning = false;
		sprites.pacman.isMoving = false;
		
		if (!window.gameIsPaused){
			document.removeEventListener('keydown', handleKeyDown);
		}
		document.removeEventListener('click', pauseGame);
		
		//// Clear all time outs
		// If last three ghosts haven't come out yet then kill timeout
		clearTimeout(sprites.ghostpink.startTimeout);
		clearTimeout(sprites.ghostblue.startTimeout);
		clearTimeout(sprites.ghostorange.startTimeout);
		// If fruit was on
		clearTimeout(gFruitDivOffTimeout);
	}
	
	// When user opens a new window
	function reloadGame(){
		// Assign fresh live variables
		gameIsRunning = false;
		window.gameIsPaused = false;
		gJabbaArray = repopulateFoodArray();
		gLives = TOTAL_LIVES;
		gScore = 0;
		gEatenDotCount = 0;
		gStage = 0;
		
		// If we had jsAngular/React we could skip having to update ui explicitly
		updateLives(gLives);
		updateStage(gStage);
		updateScore(gScore);
		
		resetGame();
	}
	
	function repopulateFoodArray(){
		var newFoodArray = [];
		// Assign fresh live variables
		newFoodArray = foodArray.map(function(arr) {
			// Copy two dimensional array
			return arr.slice();
		});
		
		return newFoodArray;
	}
	
	// Player just died, set everything back to original position
	function resetGame(){
		if (gLives>0){
			gGhostsOutOfHouse = [];
			
			initialiseSprites();
		
			// We have to reattach keydown because we temporarily remove it when pacman dies
			attachKeydown();
			attachClick();
		
			setReadyText();
		}
	}
	
	function areOppositeDirections(dir1, dir2) {
		if (dir1%2 == dir2%2) {
			//37 and 39 are LEFT and RIGHT, 38 and 40 are UP and DOWN
			return true;
		}else{
			return false;
		}
	}
		
	function canMoveInDirection(proposedDirection, currentRow, currentColumn, currentDirection) {
		var bitValue = directionArray[currentRow][currentColumn];
		
		// Get bit value of proposed direction
		var bitDirection = convertKeyToBit(proposedDirection);
		
		// Switch off opposite direction
		// ## Ghosts are not allowed to reverse direction unless frightened, so deduct the direction opposite to the current direction from the bit value
		var oppositeBitDirection = convertKeyToBit(getOppositeDirection(currentDirection));
		if (bitValue & oppositeBitDirection) {
			bitValue -= oppositeBitDirection;
		}
		
		return bitValue & bitDirection;
	}
		
	function convertKeyToBit(direction) {
		 switch (direction){
			case KEY_UP:
				return 8;
			case KEY_RIGHT:
				return 4;
			case KEY_DOWN:
				return 2;
			case KEY_LEFT:
				return 1;
		}
		return 0;
	}
		
	function getOppositeDirection(direction) {
		switch (direction){
			case KEY_UP:
				return KEY_DOWN;
			case KEY_RIGHT:
				return KEY_LEFT;
			case KEY_DOWN:
			   return KEY_UP;
			case KEY_LEFT:
				return KEY_RIGHT;
		}
		return 0;
	}
		
	function getDirectionName(direction){
		switch (direction){
			case KEY_UP:
				return "KEY_UP";
			case KEY_RIGHT:
				return "KEY_RIGHT";
			case KEY_DOWN:
				return "KEY_DOWN";
			case KEY_LEFT:
				return "KEY_LEFT";
		}
		return "KEY";
	}
	

function setPacmanDivClassName(className){
	var pacmanDiv = document.getElementById("pacmanDiv");
	pacmanDiv.className = className;
}

function setGhostDivBehaviourClassName(ghostId, className){
	var ghostDiv = document.getElementById(ghostId);
	if (ghostDiv){
		var classes = ghostDiv.className.split(" ");
		var newClassString = classes[0] + " " + className + " " + classes[2];
		ghostDiv.className = newClassString;
	}
}

function setEatenSpriteScore(ghostId, score){
	var ghostDiv = document.getElementById(ghostId);
	if (ghostDiv){
		ghostDiv.innerHTML = score;
		
		 setGhostDivBehaviourClassName(ghostId, 'eaten');
	}
	
}


function setReadyText(text){
	// TODO: if cherry was on when pacman died we need to readjust ready text div left
	 var readyText = (text) ? text : 'READY !';
	 
	 var captionElement = getReadyTextDivElement();
	 captionElement.innerHTML = readyText; 
	 captionElement.style.width = "89px";
	 captionElement.style.left = (text=='COMPLETED!') ? "177px" : "190px";
	 captionElement.setAttribute("title","Press arrow keys to resume game");
	 captionElement.className = "readyDiv";

	 setWidthOfAdjacentDivsToReadyText(0);
}

function hideReadyText(){
	 var captionElement = getReadyTextDivElement();
	 captionElement.innerHTML = ''; 
	 captionElement.className = "";
	 
	 setWidthOfAdjacentDivsToReadyText(15);
}

function setFruitDiv(){
	var fruitDiv = getReadyTextDivElement();
	fruitDiv.className = ARRAY_FRUIT[gStage].fruit+' fruit readyDiv';
	fruitDiv.style.width = "15px";
	fruitDiv.style.left = "205px";
	
	setWidthOfAdjacentDivsToReadyText(0);
	
	gFruitIsOn = true;
	
	gFruitDivOffTimeout = setTimeout( function(){
		setFruitDivOff();
	}, INTERVAL_DURATION_FRUIT_IS_ON);
}

function setFruitDivOff(){
	gFruitIsOn = false;
	   
	var fruitDivTimeout = getReadyTextDivElement();
	fruitDivTimeout.className = (fruitDivTimeout.className==ARRAY_FRUIT[gStage].fruit+' fruit readyDiv') ? '' : fruitDivTimeout.className;
}

function setGameOverText(){
	const gameOverText = 'GAME OVER';
	
	var gameOverDiv = getReadyTextDivElement();
	gameOverDiv.innerHTML = gameOverText; 
	gameOverDiv.style.width = "89px";
	gameOverDiv.style.left = "178px";
	gameOverDiv.setAttribute("title","Click to start a new game");
	gameOverDiv.className = "readyDiv";
	 
	setWidthOfAdjacentDivsToReadyText(0);
}

function getReadyTextDivElement(){
	var el = document.getElementById(ID_READY_TEXT_DIV);
	if (el) {
		return el;
	}
	return false;
}

function setWidthOfAdjacentDivsToReadyText(width){
	document.getElementById('dotDiv_190px_250px').style.width = width+"px";
	document.getElementById('dotDiv_205px_250px').style.width = width+"px";
	document.getElementById('dotDiv_220px_250px').style.width = width+"px";
	document.getElementById('dotDiv_235px_250px').style.width = width+"px";
}

function updateScore(addPoints){
	gScore+=addPoints;
	
	var scoreEl = document.getElementById('scoreValue');
	scoreEl.innerHTML = gScore;
	
	if (gScore >= gNextBonusLifeFlag){
		// Set bonus life flag to 10,000 points more
		gNextBonusLifeFlag += POINTS_TO_BONUS_LIFE;
		updateLives(++gLives);
	}
}

function updateLives(lives){
	var livesEl = document.getElementById('livesValue');
	livesEl.innerHTML = lives;
}

function doPacmanDyingSequence(){
	showStationaryPacman();
	
	setTimeout(hideAllGhosts, 1000);
	
	setTimeout(function(){ setPacmanDivClassName('dying') }, 1000);
	
	updateLives(--gLives);
	
	if (gLives>0){
		setTimeout(resetGame, 4500);
	}else{
		setTimeout(function(){ setPacmanDivClassName('invisible') }, 4500); 
		
		setTimeout(setGameOverText, 4500);
		setTimeout(globalShowDialog, 7500);
	}
}

function showStationaryPacman(){
	var pacmanEl = document.getElementById('pacmanDiv');
	var pacmanClass = pacmanEl.className;
	if (pacmanClass.substring(0,11)!='stationary-'){
		setPacmanDivClassName('stationary-'+pacmanClass);
	}
}

function doCompletedGraphicsSequence(){
	setPacmanDivClassName('completed');
	
	hideAllGhosts();
	setFruitDivOff();
	
	setTimeout(function(){ setWallColour('white'); }, 0);
	setTimeout(function(){ setWallColour('blue'); }, 500);
	setTimeout(function(){ setWallColour('white'); }, 1000);
	setTimeout(function(){ setWallColour('blue'); }, 1500);
	setTimeout(function(){ setWallColour('white'); }, 2000);
	
	setTimeout(loadNextStage, 4000);
}

function loadNextStage(){
	gStage++;
	
	if (gStage >= ARRAY_FRUIT.length){
		setReadyText('COMPLETED!');
	}else{
		buildWalls();
		insertGhostBox();
		
		gJabbaArray = repopulateFoodArray();
		
		gEatenDotCount = 0;
		
		updateStage(gStage);
		
		resetGame();
	}
}

function updateStage(stage){
	document.getElementById('stageValue').innerHTML = 'Stage ' + (stage+1);
	document.getElementById('stageIcon').className = 'statusIcon ' + ARRAY_FRUIT[stage].fruit;
}

function setWallColour(colourString){
	var wallDivs = document.getElementsByClassName('wallDiv')
	for (var i=0; i<wallDivs.length; i++){
		wallDivs[i].style.backgroundColor = colourString;
	}
}


function hideAllGhosts(){
	// Hide all ghosts
	hideGhost('ghostRedDiv');
	hideGhost('ghostBlueDiv');
	hideGhost('ghostOrangeDiv');
	hideGhost('ghostPinkDiv');
	
	// Including those at home
	document.getElementById("dotDiv_175px_205px").className = '';
}

function hideGhost(elementId){
	var ghostEl = document.getElementById(elementId);
	ghostEl.style.left = sprites.ghostred.column*WALL_INCREMENT+"px";
	ghostEl.style.top = sprites.ghostred.row*WALL_INCREMENT+"px";
	ghostEl.style.display = "none";
}

function everyInterval(n) {
	if ((gframeCount / n) % 1 == 0) {return true;}
	return false;
}

function attachClick(){
	document.addEventListener("click", pauseGame);
}

function pauseGame(){
	if (gameIsRunning){
		window.gameIsPaused = true;
		stopGame();
		setReadyText('&nbsp; PAUSE');
	}
}

//// 1. BUG: Ghosts don't come out
// Repro: Move Pacman. Change one ghost behaviour from dropdown. Start new game.