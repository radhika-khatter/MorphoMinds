export default function FAQsPage() {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
  
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 dark:text-white">How do I reset my password?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              You can reset your password by clicking on the "Forgot Password" link on the login page. You will receive an
              email with instructions to reset your password.
            </p>
          </div>
  
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 dark:text-white">How can I update my profile information?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              You can update your profile information by going to the Settings page and clicking on the "Edit Profile"
              option.
            </p>
          </div>
  
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Is my personal information secure?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yes, we take security very seriously. All your personal information is encrypted and stored securely. We
              never share your information with third parties without your consent.
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  