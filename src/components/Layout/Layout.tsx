import { useWorkoutFormStore } from "../../store/WorkoutFormStore";
import WorkoutForm from "../Workout/WorkoutForm";
import Logo from "./Logo";
import Navigation from "./Navigation/Navigation";
import ThemeSwitcher from "./ThemeSwitcher";
import ToastMessage from "./ToastMessage";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const { state: workoutFromState } = useWorkoutFormStore();
  return (
    <div>
      <ToastMessage />
      <Navigation />

      {workoutFromState && <WorkoutForm />}

      <main className={`px-5 sm:px-8 md:ml-[320px]`}>
        <div className="flex w-full justify-between py-5 md:justify-end">
          <div className="md:hidden">
            <Logo />
          </div>
          <ThemeSwitcher />
        </div>
        {children}
      </main>
    </div>
  );
}
