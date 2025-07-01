// Brazilian Jiu-Jitsu belt system utilities

export const kidsBelts = [
  'Branca',
  'Cinza-Branca',
  'Cinza', 
  'Cinza-Preta',
  'Amarela-Branca',
  'Amarela',
  'Amarela-Preta',
  'Laranja-Branca',
  'Laranja',
  'Laranja-Preta',
  'Verde-Branca',
  'Verde',
  'Verde-Preta'
];

export const adultsBelts = [
  'Branca',
  'Azul',
  'Roxa',
  'Marrom',
  'Preta',
  'Coral',
  'Vermelha'
];

export const relationshipOptions = [
  'Pai', 'Mãe', 'Avô', 'Avó', 'Tio', 'Tia', 'Irmão', 'Irmã', 'Responsável', 'Outro'
];

export type AgeGroup = 'kids' | 'adults';

export const getBeltOptions = (ageGroup: AgeGroup): string[] => {
  return ageGroup === 'kids' ? kidsBelts : adultsBelts;
};

export const getMaxDegree = (belt: string, ageGroup: AgeGroup): number => {
  if (ageGroup === 'kids') {
    return 1; // Kids belts typically don't have degrees
  }
  
  // Adult belt degrees
  switch (belt) {
    case 'Branca':
      return 4;
    case 'Azul':
    case 'Roxa':
    case 'Marrom':
      return 4;
    case 'Preta':
      return 10;
    default:
      return 1;
  }
};

export const determineAgeGroup = (birthDate: string): AgeGroup => {
  if (!birthDate) return 'adults';
  
  const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
  return age < 16 ? 'kids' : 'adults';
}; 