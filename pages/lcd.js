import Layout from '../components/Layout';
import LCDControl from '../components/LCDControl';

export default function LCDPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            LCD Control
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View all registered users (live from Firebase)
          </p>
        </div>
        <LCDControl />
      </div>
    </Layout>
  );
} 
