import { useState, useEffect } from "react";
import type { Student } from "./types/electron";
import "./styles/globals.css";
import CheckIn from "./components/CheckIn";
import StudentDirectory from "./components/StudentDirectory";
import EventInfo from "./components/EventInfo";

function App() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [checkedInStudents, setCheckedInStudents] = useState<Student[]>([]);

  useEffect(() => {
    loadStudentsIfConfigured();
  }, []);

  const loadStudentsIfConfigured = async () => {
    const result = await window.electronAPI.db.isConfigured();
    if (result.success && result.data) {
      await loadStudents();
    }
  };

  const loadStudents = async () => {
    const result = await window.electronAPI.db.getAllStudents();
    if (result.success && result.data) {
      setAllStudents(result.data);
    }
  };

  const handleLoadDatabase = async () => {
    const result = await window.electronAPI.db.promptForFile();
    if (result.success) {
      await loadStudents();
    }
  };

  const handleCheckIn = (student: Student) => {
    setCheckedInStudents([...checkedInStudents, student]);
  };

  const handleCheckOut = (studentId: number) => {
    setCheckedInStudents(checkedInStudents.filter((s) => s.id !== studentId));
  };

  // Filter out checked-in students from available list
  const availableStudents = allStudents.filter(
    (student) => !checkedInStudents.find((s) => s.id === student.id)
  );

  return (
    <div className="bg-neutral-900 grid grid-cols-2 h-screen w-screen p-3 gap-3">
      <div className="flex flex-col gap-3 min-h-0">
        <div className="flex-1 min-h-0">
          <CheckIn
            students={checkedInStudents}
            onCheckOut={handleCheckOut}
          />
        </div>
        <div className="flex-1 min-h-0">
          <EventInfo
            students={checkedInStudents}
            checkedInCount={checkedInStudents.length}
          />
        </div>
      </div>
      <div className="min-h-0">
        <StudentDirectory
          students={availableStudents}
          onCheckIn={handleCheckIn}
          onLoadDatabase={handleLoadDatabase}
          hasDatabase={allStudents.length > 0}
        />
      </div>
    </div>
  );
}

export default App;
