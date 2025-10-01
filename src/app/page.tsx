export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Agronomy Club
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Promoting agricultural science and sustainable farming practices
          </p>
          <button className="bg-primary-600 hover:bg-primary-700 px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
            Learn More
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Our Club</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The Agronomy Club is dedicated to advancing agricultural science, 
              promoting sustainable farming practices, and connecting agricultural 
              professionals and students.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-2">Research</h3>
              <p className="text-gray-600">
                Advancing agricultural research and innovation for sustainable food production.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Building connections between farmers, researchers, and agricultural professionals.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Education</h3>
              <p className="text-gray-600">
                Providing educational resources and training for modern agricultural practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Get Involved</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our community of agricultural professionals and enthusiasts
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <button className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Become a Member
            </button>
            <button className="bg-white hover:bg-gray-50 text-secondary-700 border border-secondary-600 px-6 py-3 rounded-lg font-semibold transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2025 Agronomy Club. All rights reserved.</p>
          <p className="text-gray-400 mt-2">agronomyclub.org</p>
        </div>
      </footer>
    </div>
  )
}