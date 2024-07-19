import React, { useContext } from "react";
import StartExercise from "../startExercise/startExercise";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CurrentExerciseContext } from "@/app/workouts/[slug]/start/context";

function StartExerciseContainer({ exercise, id }) {
  const [currentExerciseContext, setCurrentExerciseContext] = useContext(
    CurrentExerciseContext
  );
  return (
    <>
      <h1 className="text-3xl text-center mb-4">{exercise[1].name}</h1>
      {currentExerciseContext[id] > Object.keys(exercise).length ? (
        <h1>Exercise is Completed!</h1>
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-scroll no-scrollbar">
        {Object.keys(exercise).map((set) => (
          <StartExercise set={exercise[set]} key={set} />
        ))}
      </div>
    </>
  );
}

export default StartExerciseContainer;
