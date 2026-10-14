import { Profile, CompatibilityResult, AvailabilityOption } from '../types';

export function calculateCompatibility(userA: Profile, userB: Profile): CompatibilityResult {
  // 1. Shared interests (60% weight)
  const interestsA = userA.interests || [];
  const interestsB = userB.interests || [];
  
  const sharedInterests = interestsA.filter(interest => 
    interestsB.some(i => i.toLowerCase().trim() === interest.toLowerCase().trim())
  );

  // Calculate percentage out of 60
  // Base logic: max score when sharing 4 or more interests, scaled proportionally
  let interestsScore = 0;
  if (sharedInterests.length >= 4) {
    interestsScore = 60;
  } else if (sharedInterests.length === 3) {
    interestsScore = 48;
  } else if (sharedInterests.length === 2) {
    interestsScore = 36;
  } else if (sharedInterests.length === 1) {
    interestsScore = 20;
  } else {
    interestsScore = 5; // Minimal base score for discovery
  }

  // 2. Favorite activities similarity (20% weight)
  const activitiesA = userA.favorite_activities || [];
  const activitiesB = userB.favorite_activities || [];
  
  const sharedActivities: string[] = [];
  activitiesA.forEach(actA => {
    activitiesB.forEach(actB => {
      // Check substring or exact match
      const wordsA = actA.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const match = wordsA.some(w => actB.toLowerCase().includes(w));
      if (match || actA.toLowerCase() === actB.toLowerCase()) {
        if (!sharedActivities.includes(actA)) {
          sharedActivities.push(actA);
        }
      }
    });
  });

  let activitiesScore = 0;
  if (sharedActivities.length >= 2) {
    activitiesScore = 20;
  } else if (sharedActivities.length === 1) {
    activitiesScore = 14;
  } else {
    // Check general keyword overlap in bio
    const bioOverlap = interestsA.some(i => userB.bio.toLowerCase().includes(i.toLowerCase()));
    activitiesScore = bioOverlap ? 10 : 6;
  }

  // 3. Shared availability (20% weight)
  const availA = userA.availability || [];
  const availB = userB.availability || [];
  
  const sharedAvailability = availA.filter(a => availB.includes(a as AvailabilityOption));
  
  let availabilityScore = 0;
  if (sharedAvailability.length >= 3) {
    availabilityScore = 20;
  } else if (sharedAvailability.length === 2) {
    availabilityScore = 15;
  } else if (sharedAvailability.length === 1) {
    availabilityScore = 10;
  } else {
    availabilityScore = 5;
  }

  const overallScore = Math.min(99, Math.max(25, interestsScore + activitiesScore + availabilityScore));

  // Determine non-exact distance description
  let approxDistanceStr = 'En tu misma zona';
  const areaLower = userB.area.toLowerCase();
  if (areaLower.includes('1 km') || areaLower.includes('menos')) {
    approxDistanceStr = 'A menos de 1 km';
  } else if (areaLower.includes('2 km')) {
    approxDistanceStr = 'A 2 km de distancia';
  } else if (areaLower.includes('3 km')) {
    approxDistanceStr = 'A 3 km de distancia';
  } else if (areaLower.includes('4 km') || areaLower.includes('5 km')) {
    approxDistanceStr = 'A 5 km de distancia';
  } else {
    approxDistanceStr = 'En tu misma zona';
  }

  return {
    overallScore,
    interestsScore,
    activitiesScore,
    availabilityScore,
    sharedInterests,
    sharedActivities,
    sharedAvailability,
    approxDistanceStr
  };
}
