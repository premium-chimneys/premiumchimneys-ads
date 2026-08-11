import LegacyTracking from '@/components/tracking/LegacyTracking'

// The bare site root renders no content, but it did load the third-party stack
// back when that stack lived in the root layout. Keep that true.
export default function Page() {
  return <LegacyTracking />;
}
