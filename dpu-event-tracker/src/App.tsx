import './styles/globals.css'
import CheckInColumn from './components/CheckInColumn'
import StudentColumn from './components/StudentColumn'
import UtilityColumn from './components/UtilityColumn'

function App() {
  return (
    <div className="bg-neutral-800 flex h-screen w-screen p-3">
      <CheckInColumn/>
      <StudentColumn/>
      <UtilityColumn/>
    </div>
  )
}

export default App
