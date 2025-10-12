interface EventInfoColumnProps {
  checkedInCount: number;
}

export default function EventInfo({ checkedInCount }: EventInfoColumnProps) {
  return (
    <div className="h-full bg-neutral-700 rounded-lg p-4 flex flex-col">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <h1 className="text-white text-2xl font-bold mb-4"> Event Info </h1>
        <button className="primary-button">Save</button>
        <button className="primary-button">Export As...</button>
      </div>
      <div className="h-full grid grid-cols-3 gap-2 overflow-y-hidden">
        {/* Checked In */}
        <div className=" bg-purple-900/30 border border-purple-600 rounded-lg p-4">
          <div className="text-purple-300 text-sm">Checked In</div>
          <div className="text-white text-3xl font-bold">{checkedInCount}</div>
        </div>

        {/* Class Count*/}
        <div className="bg-neutral-600 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Class Count</div>
          <div className="text-white text-lg">
            {new Date().toLocaleTimeString()}
          </div>
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
  );
}
