import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const storedTheme = localStorage.getItem("quecomer-theme");
if (storedTheme === "dark") document.documentElement.classList.add("dark");
if (storedTheme === "premium") document.documentElement.classList.add("premium");

createRoot(document.getElementById("root")!).render(<App />);
