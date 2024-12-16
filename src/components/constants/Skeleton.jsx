export default function Skeleton({ description }) {
    return (
        <div role="status" class="max-w-sm animate-pulse py-2">
            {Array.from({ length: 3 }).map((arr, arrIdx) => (
                <div key={arrIdx} className="py-4">
                    <div className="flex justify-between items-center">
                        <div class="h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-48"></div>
                        <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16"></div>
                    </div>
                    <div className="flex justify-between mt-2 items-center">
                        <div class="h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-16"></div>
                        <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-24"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
