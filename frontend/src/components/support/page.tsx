import { MessageSquare } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Customer Support</h1>

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our support team is available 24/7 to assist you with any questions or issues you may have.
          </p>

          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <MessageSquare className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="font-medium dark:text-white">Email Support</p>
              <p className="text-gray-500 dark:text-gray-400">support@example.com</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div>
              <p className="font-medium dark:text-white">Phone Support</p>
              <p className="text-gray-500 dark:text-gray-400">+1 (800) 123-4567</p>
            </div>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Your email"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="How can we help you?"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

