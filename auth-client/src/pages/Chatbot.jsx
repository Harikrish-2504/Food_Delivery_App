import {React,useState} from "react"


const Chatbot = () => {

    const [displayChatbot, setDisplayChatbot] = useState(false)
    const Chatbot = (e) => {
        setDisplayChatbot(!displayChatbot)
    }

    return (
        <div style={{position:"fixed",float:"left",bottom:"14%  ",right:10,zIndex:10}}>
            
            {displayChatbot ?
                <div >
                    <button onClick={Chatbot} className="bg-red-400 active:scale-90 transition duration-500 transform hover:shadow-xl shadow-md rounded-full px-4 py-2 text-xl font-medium text-white">X</button>
                    <iframe  width="340" height="430" allow="microphone;" src="https://console.dialogflow.com/api-client/demo/embedded/1442b678-ddbd-4f9e-87e8-ca01e39deabb"></iframe>
                </div> : <button onClick={Chatbot} className="bg-green-400 active:scale-90 transition duration-500 transform hover:shadow-xl shadow-md rounded-full px-4 py-2 text-xl font-medium text-white">Chatbot</button>
                
            }
           
            
        </div>
    )
}

export default Chatbot