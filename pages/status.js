import Layout from '../components/Layout';
import FirebaseStatus from '../components/FirebaseStatus';

export default function StatusPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Firebase Status
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor Firebase connection and troubleshoot issues
          </p>
        </div>

        {/* Firebase Status */}
        <FirebaseStatus />
      </div>
    </Layout>
  );
} 