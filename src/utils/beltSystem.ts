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
  'Pai/Mãe', 'Avô/Avó', 'Tio/Tia', 'Irmão/Irmã', 'Responsável', 'Cônjuge', 'Outro'
];

export type AgeGroup = 'Infantil' | 'Adulto';

export const getBeltOptions = (ageGroup: AgeGroup): string[] => {
  return ageGroup === 'Infantil' ? kidsBelts : adultsBelts;
};

export const getMaxDegree = (belt: string, ageGroup: AgeGroup): number => {
  if (ageGroup === 'Infantil') {
    return 4;
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
      return 0;
  }
};

export const determineAgeGroup = (birthDate: string): AgeGroup => {
  if (!birthDate) return 'Adulto';
  
  const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
  return age < 16 ? 'Infantil' : 'Adulto';
}; 