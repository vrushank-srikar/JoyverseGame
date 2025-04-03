import React, { useState, useEffect } from 'react';
import './Game.css';
import videoFile from './assets/video.mp4';
import backgroundImage from './assets/photo.png';
import dogImage from './assets/dog.png';
import catImage from './assets/cat.png';
import tigerImage from './assets/tiger.png';
import zebraImage from './assets/zebra.png';
import monkeyImage from './assets/monkey.png';
import horseImage from './assets/horse.png';

const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState([]);

  const words = [
    { correct: 'dog', jumbled: 'gdo', image: dogImage },
    { correct: 'cat', jumbled: 'tac', image: catImage },
    { correct: 'tiger', jumbled: 'ietgr', image: tigerImage },
    { correct: 'zebra', jumbled: 'abezr', image: zebraImage },
    { correct: 'monkey', jumbled: 'mkyoen', image: monkeyImage },
    { correct: 'horse', jumbled: 'soehr', image: horseImage },
  ];

  useEffect(() => {
    setShuffledWords([...words].sort(() => Math.random() - 0.5)); // Shuffle once at start
  }, []);

  useEffect(() => {
    if (shuffledWords.length > 0) {
      setCurrentWord(shuffledWords[wordIndex]);
      setLetters(shuffledWords[wordIndex].jumbled.split(''));
      setDropZones(Array(shuffledWords[wordIndex].correct.length).fill(null));
    }
  }, [wordIndex, shuffledWords]);

  const [currentWord, setCurrentWord] = useState(words[0]);
  const [letters, setLetters] = useState(currentWord.jumbled.split(''));
  const [dropZones, setDropZones] = useState(Array(currentWord.correct.length).fill(null));
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const handleDragStart = (e, letter) => {
    e.dataTransfer.setData('text/plain', letter);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const letter = e.dataTransfer.getData('text/plain');
    const newDropZones = [...dropZones];
    newDropZones[index] = letter;
    setDropZones(newDropZones);

    if (newDropZones.every(zone => zone !== null)) {
      const arrangedWord = newDropZones.join('');
      if (arrangedWord === currentWord.correct) {
        setFeedback('Correct!');
        const newScore = score + 1;
        setScore(newScore);

        if (newScore >= words.length) {
          setGameCompleted(true);
        } else {
          setTimeout(() => {
            setWordIndex(prevIndex => prevIndex + 1); // Move to the next word
            setFeedback(null);
          }, 1000);
        }
      } else {
        setFeedback('Try Again!');
        setTimeout(() => {
          setDropZones(Array(currentWord.correct.length).fill(null));
          setFeedback(null);
        }, 1000);
      }
    }
  };

  return (
    <div className={`game-container ${gameStarted ? 'image-background' : ''}`}>
      {!gameStarted ? (
        <video autoPlay loop muted className="background-video">
          <source src={videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img src={backgroundImage} alt="Background" className="background-image" />
      )}

      <div className="content">
        {!gameStarted ? (
          <>
            <h1>Welcome to the Game</h1>
            <button onClick={() => setGameStarted(true)} className="start-button">
              Start Game
            </button>
          </>
        ) : !gameCompleted ? (
          <div className="game-content">
            <h1>What is this animal?</h1>
            <img src={currentWord.image} alt="Animal" className="animal-image" />

            <div className="letters-container">
              {letters.map((letter, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, letter)}
                  className="draggable-letter"
                >
                  {letter}
                </div>
              ))}
            </div>

            <div className="dropzones-container">
              {dropZones.map((zone, index) => (
                <div
                  key={index}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`dropzone ${zone ? 'filled' : ''}`}
                >
                  {zone || '_'}
                </div>
              ))}
            </div>

            {feedback && <p className={`feedback ${feedback === 'Correct!' ? 'correct' : 'wrong'}`}>{feedback}</p>}
            <p className="score">Score: {score}</p>
          </div>
        ) : (
          <div className="game-content">
            <h2>Congratulations! You Won!</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
