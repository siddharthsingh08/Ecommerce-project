export default function LoadingScreen() {

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">

      <div className="text-center">

        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>

        <p className="text-lg">Loading...</p>

      </div>

    </div>
  );

}