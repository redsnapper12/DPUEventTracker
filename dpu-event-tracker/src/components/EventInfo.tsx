import { ClassName, GetClassCount } from "../main/helpers/helpers";
import { Student } from "../types/electron";

interface EventInfoColumnProps {
  checkedInCount: number;
  students: Student[];
}

export default function EventInfo({
  checkedInCount,
  students,
}: EventInfoColumnProps) {
  return (
    <div className="h-full bg-neutral-700 rounded-lg flex flex-col overflow-hidden">
      <div className="bg-neutral-600 px-4 py-3 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Event Info</h1>
        <div className="flex gap-2">
          <button className="primary-button">Save</button>
          <button className="primary-button">Export As...</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-2">
          {/* Checked In */}
          <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-4">
            <div className="text-purple-300 text-sm">Checked In</div>
            <div className="text-white text-3xl font-bold">
              {checkedInCount}
            </div>
          </div>

          {/* Class Count*/}
          <div className="bg-neutral-600 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Class Count</div>
            <ul className="text-white text-lg">
              <li>Seniors: {GetClassCount(students, ClassName.Senior)}</li>
              <li>Juniors: {GetClassCount(students, ClassName.Junior)}</li>
              <li>Sophomores: {GetClassCount(students, ClassName.Sophomore)}</li>
              <li>Freshmen: {GetClassCount(students, ClassName.Freshman)}</li>
            </ul>
          </div>

          {/* Current Time */}
          <div className="bg-neutral-600 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Current Time</div>
            <div className="text-white text-lg">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
