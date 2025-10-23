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
    <div className="h-full bg-neutral-800 rounded-lg flex flex-col overflow-clip">
      <div className="bg-neutral-700 px-4 py-3 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Event Info</h1>
        <div className="flex gap-2">
          <button className="primary-button">Save</button>
          <button className="primary-button">Export As...</button>
        </div>
      </div>

      {/* Class Count */}
      <div className="m-5 bg-neutral-700 rounded-lg p-4">
        <div className="text-gray-400 text-sm mb-3">Class Count</div>
        <div className="space-y-2">
          {[
            {
              label: "Seniors",
              class: ClassName.Senior,
              color: "bg-blue-600",
            },
            {
              label: "Juniors",
              class: ClassName.Junior,
              color: "bg-blue-500",
            },
            {
              label: "Sophomores",
              class: ClassName.Sophomore,
              color: "bg-blue-400",
            },
            {
              label: "Freshmen",
              class: ClassName.Freshman,
              color: "bg-blue-300",
            },
            {
              label: "Unknown",
              class: ClassName.Unknown,
              color: "bg-gray-500",
            },
          ].map(({ label, class: className, color }) => {
            const count = GetClassCount(students, className);
            const maxCount = Math.max(
              GetClassCount(students, ClassName.Senior),
              GetClassCount(students, ClassName.Junior),
              GetClassCount(students, ClassName.Sophomore),
              GetClassCount(students, ClassName.Freshman),
              GetClassCount(students, ClassName.Unknown),
              1 // Avoid division by zero
            );
            const percentage = (count / maxCount) * 100;
            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium">
                    {label}
                  </span>
                  <span className="text-gray-300 text-sm">{count}</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div
                    className={`${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
