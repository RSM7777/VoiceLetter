import { useState } from 'react';
import LoadingAnimation from '@/components/LoadingAnimation';
import { VoiceLetter } from '@/components/VoiceLetter';
function Index() {
  // State to manage whether the loading animation is showing
  const [isLoading, setIsLoading] = useState(true);

  // This function will be passed to the animation component
  // It sets isLoading to false, which will make the app show your main component
  const handleAnimationComplete = () => {
    setIsLoading(false);
  };

  // Conditionally render the animation or your main app content
  if (isLoading) {
    return <LoadingAnimation onComplete={handleAnimationComplete} />;
  }

  return (
    <VoiceLetter />
  );
}

export default Index;