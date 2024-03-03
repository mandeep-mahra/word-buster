import "./App.css";
import { useEffect, useState } from "react";
import DisplayWord from "./displayWord.js";
import { words } from "./words";
import { useTimer } from 'react-timer-hook';
import { updateData, getScores } from "./firebase";
import heart from "./resources/heart-solid.svg";

var buffer = 5;
const startTime = new Date();

function App() {
  const [word, setWord] = useState("");
  const [displayWord, setDisplayWord] = useState(words[6].toLowerCase());
  const [wrong, setWrong] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [displayScore, setDisplayScore] = useState(false);
  const [scoreBoard, setScoreBoard] = useState([]);
  const [submit, setSubmit] = useState(true);

  const {
    seconds,
    restart,
  } = useTimer({ startTime, onExpire: () => handleTimeout() });

  useEffect(()=>{
    if(localStorage.getItem("page") === "scoreboard")
      setDisplayScore(true);
    else
      setDisplayScore(false);
    getScores().then((res) => {
      var dataArray = [];
      Object.keys(res).map((curr) => {
        dataArray.push([parseInt([res[curr]]),  curr])
      })
      dataArray.sort(function(a, b){return a-b});
      dataArray.reverse();
      console.log(dataArray, typeof(dataArray[0][0]));
      setScoreBoard(dataArray);
    }) 
  }, [submit])

  function handleTimeout(){
    setLives(lives - 1);
    setDisplayWord(words[Math.round(Math.random()*5000)].toLowerCase());
    setWord("");
    if((lives - 1) === 0)
      setDisplayScore(true);
  }
  function restartGame(){
    setWord("");
    setDisplayWord(words[6].toLowerCase());
    setWrong(false);
    setScore(0);
    setLives(3);
  }

  function handleChange(e){
    if(e.key === ' ')
      e.preventDefault()
    if((e.key === 'Enter' || e.key === ' ') && 
        (word.replace(/ /g, "") === displayWord.replace(/ /g, ""))){
      setDisplayWord(words[Math.round(Math.random()*5000)].toLowerCase());
      e.target.value = "";
      setWord("");
      setScore(score + 1);
      const time = new Date();
      time.setSeconds(time.getSeconds() + Math.ceil(buffer));
      restart(time);
      if((score + 1) % 10 == 0)
        setLives(lives + 1);
      buffer -= 0.02;
    }    
    else if(e.key === 'Enter' || e.key === ' '){
      setLives(lives - 1);
      setWrong(true);
      setTimeout(function(){setWrong(false)}, 200)
      setTimeout(function(){e.target.value = ""}, 200)
      if(lives-1 == 0){
        localStorage.setItem("page", "scoreboard");
        setDisplayScore(true);
      }
      const time = new Date();
      time.setSeconds(time.getSeconds() + Math.ceil(buffer));
      restart(time);
    }
  }

  function gotoHome(){
    setSubmit(true);
    setDisplayScore(false);
    localStorage.setItem("page", "home");
    restartGame();
  }

  function handleScoreSubmit(e){
    if(e.key === 'Enter' && submit){
      updateData(e.target.value, score);
      e.target.value = "";
      e.target.placeholder = "Score uploaded";
      setTimeout(function(){setSubmit(false)}, 2000);
    }
    else if(e.key === 'Enter'){
      e.target.value = "";
      e.target.placeholder = "Cannot submit again";
    }
  }

  return (
    <div className="min-vh-100 w-100 d-flex">
      {
        (!displayScore)?
      <>
        <div className="score m-4 w-100 position-absolute">
          Score : {score}
        </div>
        <div className="score m-4 mt-5 w-100 position-absolute">
          Lives :
          {(Array(lives).fill(0)).map((x) => 
            <img className = "heart" src = {heart}></img>
          )}
        </div>
        <div className = "showScore" onClick={() => {
            setDisplayScore(true)
            localStorage.setItem("page", "scoreboard")
            }}>
            Scoreboard
        </div>
        <div className="m-5 w-100 d-flex justify-content-center align-items-center">
          <div className="w-50">
            <DisplayWord word = {displayWord}/>
            {
              (seconds === 0)?
              <div className="timer text-secondary small">Cooldown</div>:
              <div className="timer">{seconds}</div>
            }
            
            {
              
              (wrong === true)?
              <input 
                onKeyDown = {(e)=>handleChange(e)} 
                className="inputBox w-100 annim text-danger"
                onChange={(e)=>(setWord(e.target.value))}  
              />:
              <input 
                onKeyDown = {(e)=>handleChange(e)} 
                className="inputBox w-100"
                onChange={(e)=>(setWord(e.target.value))}  
                autoFocus = "autoFocus"
              />
            }
          </div>
        </div>
      </>:
      <>
        <div 
          className = "w-100 d-flex  flex-column  align-items-center m-5"
        >
            <div className="dispScore">
              Your Score : {score}
            </div>
            <button onClick = {() => gotoHome()} className = "btn btn-primary">Try Again</button>
            <div>
              <input 
                type="text" 
                required 
                placeholder="Enter name to submit score"
                onKeyDown={(e) => handleScoreSubmit(e)}
                className = "form-control mt-4"
              />
            </div>
            <div className = "scoreboard mt-5 w-100 d-flex flex-column align-items-center">
              <div>Scoreboard</div>
              <div className="mt-3 d-flex flex-column w-100 align-items-center">
                <table>
                {
                  scoreBoard.map((curr, index) => (
                    <tr>
                      <td>{(index + 1) + ". " + curr[1]}</td>
                      <td></td>
                      <td>{curr[0]}</td>
                    </tr>                  
                  ))
                }
                </table>
              </div>
            </div>
        </div>
      </>
      }
    </div>
  );
}

export default App;
