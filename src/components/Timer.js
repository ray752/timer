import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [workoutTime, setWorkoutTime] = useState(20);
  const [restTime, setRestTime] = useState(10);
  const [exercises, setExercises] = useState(4);
  const [rounds, setRounds] = useState(2);
  const [restBetweenRounds, setRestBetweenRounds] = useState(30);
  const [currentExercise, setCurrentExercise] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState('getReady'); // 'getReady', 'workout', 'rest', 'restBetweenRounds'
  const [timeLeft, setTimeLeft] = useState(5); // Start with 5 seconds for 'get ready'
  const [isRunning, setIsRunning] = useState(false);
  const [setupView, setSetupView] = useState(true);
  const totalWorkoutTime = exercises * rounds * (workoutTime + restTime) + (rounds - 1) * restBetweenRounds;
  const [totalDuration, setTotalDuration] = useState(totalWorkoutTime);
  const workoutProgress = ((totalWorkoutTime - totalDuration) / totalWorkoutTime) * 100;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
}

useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);

        if (phase !== 'getReady') {
          setTotalDuration(prevDuration => prevDuration > 0 ? prevDuration - 1 : 0);
        }

        if (timeLeft > 0) {
            setTimeLeft(prevTime => Math.max(prevTime - 1, 0));
          } else {
            // When timeLeft is 0, check for phase transitions
            if (phase === 'getReady') {
              setPhase('workout');
              setTimeLeft(workoutTime);
            } else if (phase === 'workout') {
              if (currentExercise < exercises) {
                setPhase('rest');
                setTimeLeft(restTime);
                setCurrentExercise(prevExercise => prevExercise + 1);
              } else if (currentRound < rounds) {
                setPhase(restBetweenRounds > 0 ? 'restBetweenRounds' : 'workout');
                setTimeLeft(restBetweenRounds > 0 ? restBetweenRounds : workoutTime);
                setCurrentExercise(1);
                setCurrentRound(prevRound => prevRound + 1);
              } else {
                setPhase('rest');
                setTimeLeft(restTime);
              }
            } else if ((phase === 'rest' || phase === 'restBetweenRounds') && currentExercise === exercises && currentRound === rounds) {
              // Check if the workout has come to an end
              setIsRunning(false);
              setSetupView(true);
              setTimeout(() => alert('Workout Complete!'), 1000); // Delay the alert to ensure it shows after the state updates
            }
          }
          
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, phase, currentExercise, currentRound, workoutTime, restTime, exercises, rounds, restBetweenRounds, totalDuration]);
  
  const startTimer = () => {
    setIsRunning(true);
    setSetupView(false);
    setPhase('getReady');
    setTimeLeft(5); // Start with 'get ready' phase
    const calculatedTotalTime = exercises * rounds * (workoutTime + restTime) + (rounds - 1) * restBetweenRounds;
    setTotalDuration(calculatedTotalTime); // Initialize total duration of the workout
    // Reset or initialize other state variables as necessary
  };
  

  const pauseResumeHandler = () => {
    setIsRunning(!isRunning);
  };

  const backToSetup = () => {
    setIsRunning(false);
    setSetupView(true);
    // Optionally reset state variables to initial values if needed
  };

  return (
    <div>
      <h2>{setupView ? 'Setup Your Tabata Timer' : 'Tabata Timer'}</h2>
      {setupView ? (
        <div>
          <div>
            <label>Workout Time (seconds): </label>
            <input type="number" value={workoutTime} onChange={(e) => setWorkoutTime(Math.round(e.target.value / 5) * 5)} step="5" />
          </div>
          <div>
            <label>Rest Time (seconds): </label>
            <input type="number" value={restTime} onChange={(e) => setRestTime(Math.round(e.target.value / 5) * 5)} step="5" />
          </div>
          <div>
            <label>Number of Exercises: </label>
            <input type="number" value={exercises} onChange={(e) => setExercises(parseInt(e.target.value, 10))} />
          </div>
          <div>
            <label>Number of Rounds: </label>
            <input type="number" value={rounds} onChange={(e) => setRounds(parseInt(e.target.value, 10))} />
          </div>
          <div>
            <label>Rest Between Rounds (seconds): </label>
            <input type="number" value={restBetweenRounds} onChange={(e) => setRestBetweenRounds(Math.round(e.target.value / 5) * 5)} step="5" />
          </div>
          <div>Total Workout Time: {totalWorkoutTime} seconds</div>
          <button onClick={startTimer}>Start Timer</button>
        </div>
      ) : (
        <div>
            {/* Timer display and control buttons */}
          <div>Phase: {phase}</div>
          <div>Time Left: {timeLeft}</div>
          <div>Exercise: {currentExercise} of {exercises}</div>
          <div>Round: {currentRound} of {rounds}</div>
          <button onClick={pauseResumeHandler}>
            {isRunning ? 'Pause' : 'Resume'}
          </button>
          <button onClick={backToSetup}>Back</button>
          <div>Remaining Time: {formatTime(totalDuration)} </div>
          <div>Progress: 
            <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '8px' }}>
            <div style={{
                width: `${workoutProgress}%`,
                backgroundColor: 'black',
                height: '20px',
                borderRadius: '8px'
            }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;

