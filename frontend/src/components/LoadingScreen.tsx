export default function LoadingScreen() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center text-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>

        <p className="text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
