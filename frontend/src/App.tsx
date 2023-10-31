import {useState} from "react"
import "./App.css";

function App() {
  const [format,setFormat] = useState("png");

  function handleFileExplorerOpen (){
    document.getElementById("image_picker")?.click()
  }

  function handleFormatSelect(e: any){
    setFormat(e.target.value)
  }

  function sendFilesToConversion(){
    fetch("/upload", {
      method: "POST",
      body: JSON.stringify({
        format
      })
    }).then(e => e.json()).then(e => console.log(e))
  }

  return (
    <div className="App">
      <header className="header">
        <h1 className="title">WARHOL</h1>
      </header>
      <div className="content">
        <select name="image_format" onChange={handleFormatSelect} value={format}>
          <option value="webp">WEBP</option>
          <option value="png">PNG</option>
          <option value="jpg">JPEG</option>
          <option value="gif">GIF</option>
        </select>
        <input type="file" name="Image" id="image_picker" accept="image/png, image/jpeg. image/webp"/>
        <button className="uploadBtn" onClick={handleFileExplorerOpen}>Add images</button>
        <button className="sendBtn" onClick={sendFilesToConversion}>Convert images</button>
      </div>
    </div>
  );
}

export default App;
