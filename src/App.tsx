import { useState } from "react"
import { MobileFrame } from "@/components/mobile-frame"
import { HomeScreen } from "@/components/home-screen"
import { ChatScreen } from "@/components/chat-screen"

type View = "home" | "chat"

function App() {
  const [view, setView] = useState<View>("home")

  return (
    <MobileFrame>
      {view === "home" ? (
        <HomeScreen onStart={() => setView("chat")} />
      ) : (
        <ChatScreen onQuit={() => setView("home")} />
      )}
    </MobileFrame>
  )
}

export default App
