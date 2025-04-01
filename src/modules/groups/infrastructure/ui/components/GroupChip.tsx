import useLiveGroups from "../../directus/useLiveGroups";
import { useSearchParams } from "react-router";

const upperWords = ["I", "II", "III", "IV", "V", "NIC", "NIF"];

const GroupChip = ({ groupId }: { groupId?: string }) => {
  const { data } = useLiveGroups();
  const [params] = useSearchParams();
  const aula = params.get("aula");
  const group = data().find((g) => g.id === groupId);

  if (!group) {
    return <></>;
  }
  return (
    <section className="flex flex-row items-center justify-end max-md:justify-center gap-4 max-w-fit text-[clamp(0.75rem,1rem+1dvw,1.25rem)]">
      {aula && <span>{aula}</span>}
      {aula && <span>-</span>}
      <span>
        {group.course.name
          .toLocaleLowerCase("es-ES")
          .split(" ")
          .map((word) => {
            if (upperWords.includes(word.toUpperCase())) {
              return word.toUpperCase();
            }
            if (word.length <= 3) {
              return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(" ")}
      </span>
    </section>
  );
};

export default GroupChip;
