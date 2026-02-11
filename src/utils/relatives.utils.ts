import { FormRelative, ApiRelative } from "@/types/testimonies";

const RELATIONSHIP_TYPE_MAP: Record<string, number> = {
  survivor: 1,
  child: 3,
  sibling: 4,
  spouse: 5,
  grandparent: 6,
  uncle_aunt: 7,
  cousin: 8,
  friend: 9,
  neighbor: 10,
  other: 11,
  mother: 12,
  father: 13,
  grandmother: 14,
  grandfather: 15,
  brother: 16,
  sister: 17,
  uncle: 18,
  aunt: 19,
};

const REVERSE_RELATIONSHIP_MAP: Record<number, string> = Object.fromEntries(
  Object.entries(RELATIONSHIP_TYPE_MAP).map(([key, value]) => [value, key]),
);

export function transformRelativesToApi(
  formRelatives: FormRelative[],
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
  apiRelatives: ApiRelative[],
): FormRelative[] {
  return apiRelatives.map((rel) => ({
    value: REVERSE_RELATIONSHIP_MAP[rel.relativeTypeId] || "other",
    name: rel.personName,
    notes: rel.notes,
  }));
}
