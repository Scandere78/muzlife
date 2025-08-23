
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [isRotating, setIsRotating] = React.useState(false)

  const toggleTheme = () => {
    setIsRotating(true)
    
    // Toggle entre light et dark seulement
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    
    // Reset l'animation après 300ms
    setTimeout(() => setIsRotating(false), 300)
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      className="group relative w-10 h-10 rounded-full border border-white/20 !bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:!bg-white/20 transition-all duration-300 hover:scale-110"
    >
      <Sun className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
        theme === "dark" 
          ? "rotate-90 scale-0 opacity-0" 
          : "rotate-0 scale-100 opacity-100"
      } ${isRotating ? "animate-spin" : ""}`} />
      
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
        theme === "dark" 
          ? "rotate-0 scale-100 opacity-100" 
          : "-rotate-90 scale-0 opacity-0"
      } ${isRotating ? "animate-spin" : ""}`} />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}