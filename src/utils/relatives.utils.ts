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
  const transformed = formRelatives
    .filter((rel) => rel && (rel.value || rel.name)) 
    .map((rel, index) => {
      const result = {
        relativeTypeId: RELATIONSHIP_TYPE_MAP[rel.value || ""] || 15,
        personName: rel.name || "",
        notes: "",
        order: index,
      };
      return result;
    });
  return transformed;
}

export function transformRelativesFromApi(
  apiRelatives: ApiRelative[]
): FormRelative[] {
  return apiRelatives.map((rel) => ({
    value: REVERSE_RELATIONSHIP_MAP[rel.relativeTypeId] || "other",
    name: rel.personName,
  }));
}
