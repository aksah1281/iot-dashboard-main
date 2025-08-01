import Layout from '../components/Layout';
import SpeakerControl from '../components/SpeakerControl';

export default function SpeakerPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Speaker Control Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enable or disable your ESP32 speaker remotely
          </p>
        </div>

        {/* Speaker Control */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <SpeakerControl />
          </div>
        </div>
      </div>
    </Layout>
  );
} 
