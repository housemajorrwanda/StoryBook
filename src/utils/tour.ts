// Helper function to get tour type display name
export const getTourTypeDisplay = (tourType: string) => {
  switch (tourType) {
    case '360_image':
      return '360° Image';
    case '360_video':
      return '360° Video';
    case '3d_model':
      return '3D Model';
    case 'embed':
      return 'Embedded Tour';
    default:
      return 'Virtual Tour';
  }
};