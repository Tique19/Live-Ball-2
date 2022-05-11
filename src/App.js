import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from "react";
const socket = io.connect("http://localhost:3006");


function App() {

  const [scores, setScores] = useState(
    {
      Team1: 0,
      Team2: 0
    }
  );

  const translate = (message) => {
    let res = {}
    let arr = message.split(" ");
    arr.forEach(element => {
      let data = element.split(":");
      res[data[0]]=data[1];
    });
    return res;
  }

  useEffect(()=>{
    socket.on("score_update", (data)=>{
      setScores(translate(data.game));
    })
  }, [socket])



  return (
    <div className="App">
      <h1>Test</h1>
      <p>Team 1: {scores.Team1}</p>
      <p>Team 2: {scores.Team2}</p>
    </div>
  );
}

export default App;
