import Layout from '../components/Layout';
import LedControl from '../components/LedControl';

export default function Home() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            LED Control Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Control your ESP32 LED remotely
          </p>
        </div>

        {/* LED Control */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <LedControl />
          </div>
        </div>
      </div>
    </Layout>
  );
}
