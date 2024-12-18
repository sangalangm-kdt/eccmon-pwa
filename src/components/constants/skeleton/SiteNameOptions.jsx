export default function SiteNameOptionsSkeleton() {
    return (
        <div className="animate-pulse">
            {Array.from({ length: 3 }).map((arr, arrIdx) => (
                <div key={arrIdx} className="mb-8">
                    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-300 w-16"></div>

                    <div className="mt-4 ms-4 flex gap-2 flex-col">
                        <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-300 w-48"></div>
                        <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-300 w-64"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
