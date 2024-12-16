export default function Skeleton({ description }) {
  return (
    <div role="status" className="max-w-sm animate-pulse py-2">
      {Array.from({ length: 3 }).map((arr, arrIdx) => (
        <div key={arrIdx} className="py-4">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-300 w-48"></div>
            <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-300 w-16"></div>
          </div>
          <div className="flex justify-between mt-2 items-center">
            <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-300 w-16"></div>
            <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-300 w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
