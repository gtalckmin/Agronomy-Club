import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Quizzes | Agronomy Club",
  description:
    "Interactive quizzes to test your agricultural knowledge in real-time",
};

export default function QuizzesPage() {
  const quizMateUrl =
    process.env.NEXT_PUBLIC_QUIZ_MATE_URL ||
    "https://quiz-mate-q7uvfi4yhq-uc.a.run.app";

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Interactive Quizzes
          </h1>
          <p className="text-lg text-gray-700">
            Challenge your agricultural knowledge with real-time interactive
            quizzes. Test yourself, compete with others, and see where you
            stand on the leaderboard!
          </p>
        </div>

        {/* Main CTA Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-12 border-2 border-green-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-green-800 mb-4">
                Ready to Test Your Knowledge?
              </h2>
              <p className="text-gray-700 mb-6">
                Join live quiz sessions with other members. Answer questions in
                real-time, get instant feedback, and climb the leaderboard!
              </p>
              <a
                href={quizMateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Open Quiz-Mate
                <ArrowRight size={20} />
              </a>
            </div>
            <div className="flex-1 text-center">
              <div className="bg-green-100 rounded-lg p-8">
                <div className="text-5xl mb-4">🎯</div>
                <p className="text-green-800 font-semibold">
                  Live Interactive Quizzes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* For Hosts */}
          <div className="bg-white rounded-lg shadow p-8 border-l-4 border-green-600">
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              For Quiz Hosts
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Create custom quizzes about agriculture</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Host real-time quiz sessions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>View answer statistics and insights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Share QR codes for easy joining</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Add images to questions (host view only)</span>
              </li>
            </ul>
          </div>

          {/* For Players */}
          <div className="bg-white rounded-lg shadow p-8 border-l-4 border-blue-600">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">
              For Quiz Players
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Join quizzes with access code or QR code</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Answer questions in real-time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Get instant feedback on your answers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>See the leaderboard and rankings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Track your score as the quiz progresses</span>
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow p-8 mb-12">
          <h3 className="text-2xl font-bold text-green-800 mb-6">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h4 className="font-bold text-gray-800 mb-2">
                Host Creates Quiz
              </h4>
              <p className="text-gray-600 text-sm">
                Host uploads or creates a quiz with multiple choice questions
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Players Join</h4>
              <p className="text-gray-600 text-sm">
                Players scan QR code or enter code to join the quiz session
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Live Competition</h4>
              <p className="text-gray-600 text-sm">
                Answer questions in real-time and see results on the leaderboard
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-green-50 rounded-lg border-2 border-green-200 p-8">
          <h3 className="text-xl font-bold text-green-800 mb-4">💡 Tips</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              • <strong>For Hosts:</strong> Set a time limit for each question
              to increase engagement
            </li>
            <li>
              • <strong>For Players:</strong> Answer as quickly and accurately
              as possible to win
            </li>
            <li>
              • <strong>Everyone:</strong> Check out the leaderboard to see how
              you compare
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
