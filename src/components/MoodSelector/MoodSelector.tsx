import {
  BiDizzy,
  BiConfused,
  BiMehBlank,
  BiSmile,
  BiHappyBeaming,
} from "react-icons/bi";

const moods = [
  {
    key: 1,
    icon: BiDizzy,
  },
  {
    key: 2,
    icon: BiConfused,
  },
  {
    key: 3,
    icon: BiMehBlank,
  },
  {
    key: 4,
    icon: BiSmile,
  },
  {
    key: 5,
    icon: BiHappyBeaming,
  },
];

interface MoodSelectorProps {
  onSelect: (key: number) => void;
  selectedMood?: number;
}

export default function MoodSelector({
  selectedMood,
  onSelect,
}: MoodSelectorProps) {
  return (
    <>
      {moods.map((mood) => (
        <button
          type="button"
          onClick={() => onSelect(mood.key)}
          key={mood.key}
          className="btn btn-ghost group"
        >
          <mood.icon
            size={36}
            className={`group-hover:animate-bounce ${
              mood.key === selectedMood ? "text-violet-500" : ""
            }`}
          />
        </button>
      ))}
    </>
  );
}
