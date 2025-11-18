import { FormRelative, ApiRelative } from "@/types/testimonies";

const RELATIONSHIP_TYPE_MAP: Record<string, number> = {
  brother: 1,
  sister: 2,
  father: 3,
  mother: 4,
  son: 5,
  daughter: 6,
  uncle: 7,
  aunt: 8,
  cousin: 9,
  grandfather: 10,
  grandmother: 11,
  nephew: 12,
  niece: 13,
  neighbor: 14,
  other: 15,
};

const REVERSE_RELATIONSHIP_MAP: Record<number, string> = Object.fromEntries(
  Object.entries(RELATIONSHIP_TYPE_MAP).map(([key, value]) => [value, key])
);

export function transformRelativesToApi(
  formRelatives: FormRelative[]
): ApiRelative[] {
  const transformed: ApiRelative[] = [];

  formRelatives.forEach((rel) => {
    const value = rel?.value?.trim();
    const name = rel?.name?.trim();

    if (!value || !name) {
      return;
    }

    const relativeTypeId =
      RELATIONSHIP_TYPE_MAP[value] ?? RELATIONSHIP_TYPE_MAP.other;

    transformed.push({
      relativeTypeId,
      personName: name,
      order: transformed.length,
    });
  });

  return transformed;   
}

export function transformRelativesFromApi(
  apiRelatives: ApiRelative[]
): FormRelative[] {
  return apiRelatives.map((rel) => ({
    value: REVERSE_RELATIONSHIP_MAP[rel.relativeTypeId] || "other",
    name: rel.personName,
    notes: rel.notes,
  }));
}
