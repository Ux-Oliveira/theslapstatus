import { useState } from 'react'
import "./SlapStatus.css"
import GeneratorModal from "./components/GeneratorModal"

export default function SlapStatus() {

    const [modal, setModal] = useState(null)
    const [generator, setGenerator] = useState(false)
    const [showSupportModal, setShowSupportModal] = useState(false)

    return(
     <div className="page">

      <img
       src="/slapnav.png"
       className="nav"
       onClick={()=>window.open("https://ricksexperiment.vercel.app", "_blank")}
      />

       <div className="bg-wrapper">
        <img src="/body.png" className="bg-img" />
       </div>

         <div className="center-wrap">
      <div className="center">

        <img src="/slapback.png" className="body"/>

        <div className="segments">
            {[1,2,3,4,5,6,7,8,9].map(i=>(
              <img
               key={i}
               src={`/segment${i}.png`}
               className={`segment seg${i} ${
                 i===8
                   ? "pulse"
                   : i===9
                   ? "pulse-slower"
                   : "pulse-slow"
               }`}
               onClick={(e)=>{
                 e.stopPropagation()

                 if(i===8){
                   setGenerator(true)
                 } else if(i===9){
                   setShowSupportModal(true)
                 } else {
                   setModal(`/example${i}.png`)
                 }
               }}
              />
            ))} 
        </div>
    </div>

     </div>

     {modal && (
      <div className="overlay" onClick={()=>setModal(null)}>
       <img 
         src={modal} 
         className="example"
         onClick={(e)=>e.stopPropagation()}
       />
      </div>
     )}

     {generator && (
       <div className="overlay" onClick={()=>setGenerator(false)}>
        <div onClick={(e)=>e.stopPropagation()}>
          <GeneratorModal close={()=>setGenerator(false)}/>
        </div>
       </div>
     )}

     {showSupportModal && (

      <div
        className="overlay"
        onClick={() => setShowSupportModal(false)}
      >

        <div
          className="modal"
          onClick={(e) => e.stopPropagation()}
          style={{
            textAlign: "center"
          }}
        >

          <h1
            style={{
              marginBottom: "10px"
            }}
          >
            Hey, there!
          </h1>

          <h3
            style={{
              fontSize: "15px",
              fontWeight: "normal",
              lineHeight: "1.6",
              marginBottom: "25px"
            }}
          >
            I'm Rick, I created this page. This video generator uses ffmpeg to add text and images on top a video and generate a new one. Meaning this is done with no AI whatsoever, just basic programming, really!<br /><br />
            Dude, it took me a long time to figure out how to do this, and I hope you liked it.<br /><br />
            PLEASE subscribe to my Youtube channel as I intend on making one crazy website after another! I love you for trying this out!
          </h3>

          <button
            onClick={() =>
              window.open(
                "https://youtube.com/@ricksahuman/",
                "_blank"
              )
            }
          >
            Rick's a Human on YT!
          </button>

          <button
            onClick={() => setShowSupportModal(false)}
          >
            Maybe later?
          </button>

        </div>

      </div>

     )}

     </div>
    )
}
