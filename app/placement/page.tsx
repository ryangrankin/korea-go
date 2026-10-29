import SkillCheckHub from "../../components/challenge/SkillCheckHub";

// Right after sign-up: instead of one placement test, learners check
// the topics they already know, one by one.
export default function PlacementPage() {
  return <SkillCheckHub fromOnboarding />;
}
