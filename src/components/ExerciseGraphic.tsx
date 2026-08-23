import React from 'react';

interface ExerciseGraphicProps {
  exerciseId: string;
  className?: string;
}

export default function ExerciseGraphic({ exerciseId, className = '' }: ExerciseGraphicProps) {
  const images: Record<string, string> = {
    'iron-bridge': './1-iron-bridge.jpg',
    'wall-sit': './2-wall-set.jpg',
    'bear-crawl-hold': './3-bear-crawl.jpg',
    'horse-stance': './4-horse-stance.jpg',
    'hollow-body-hold': './5-hollow-body.jpg',
    'bottom-push-up-hold': './6-bottom-push-up.jpg',
  };

  const imageSrc = images[exerciseId] || './1-iron-bridge.jpg';

  return (
    <div 
      className={`relative bg-gray-900 overflow-hidden flex items-center justify-center ${className}`}
    >
      <img 
        src={imageSrc}
        alt={exerciseId}
        className="absolute inset-0 w-full h-full object-contain transition-transform duration-700"
      />
    </div>
  );
}
