import React, { useContext, useState, useEffect, useRef } from "react";
import styles from "./startExercise.module.css";
import {
  ExercisesContext,
  StartWorkoutContext,
  CurrentExerciseContext,
} from "@/app/workouts/[slug]/start/context";
import { Button } from "../ui/button";
import { FaCheck, FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { updateExercises } from "@/lib/actions";
import { useLocalStorage, useSessionStorage } from "@/lib/utils";
import AutosizeInput from "react-input-autosize";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function StartExercise({ set }) {
  const [exercisesContext, setExercisesContext] = useContext(ExercisesContext);
  const [startWorkoutContext, setStartWorkoutContext] =
    useContext(StartWorkoutContext);
  const [currentExerciseContext, setCurrentExerciseContext] = useContext(
    CurrentExerciseContext
  );
  const [editToggle, setEditToggle] = useState(false);
  const [weight, setWeight] = useState(set.weight);
  const [previousWeight, setPreviousWeight] = useState(set.weight);
  const [previousReps, setPreviousReps] = useState(set.reps);
  const [reps, setReps] = useState(set.reps);
  const [showDialog, setShowDialog] = useState(false);

  const {
    setItem: setStartWorkoutItem,
    getItem: getStartWorkoutItem,
    removeItem: removeStartWorkoutItem,
  } = useSessionStorage("StartWorkout");

  useEffect(() => {
    setStartWorkoutItem(startWorkoutContext);
  }, [startWorkoutContext]);

  const completeRep = () => {
    let currentExercise = currentExerciseContext[set.id];
    let exerciseID = set.id;
    let setID = set.set;
    setCurrentExerciseContext({
      ...currentExerciseContext,
      [set.id]: currentExercise + 1,
    });
    setStartWorkoutContext({
      ...startWorkoutContext,
      [exerciseID]: {
        ...startWorkoutContext[exerciseID],
        [setID]: {
          ...startWorkoutContext[exerciseID][setID],
          completed: true,
        },
      },
    });
  };

  const confirmEditSubmit = (e) => {
    e.preventDefault();
    setEditToggle(!editToggle);
    let exerciseID = set.id;
    let setID = set.set;
    setStartWorkoutContext({
      ...startWorkoutContext,
      [exerciseID]: {
        ...startWorkoutContext[exerciseID],
        [setID]: {
          ...startWorkoutContext[exerciseID][setID],
          reps: reps,
          weight: weight,
        },
      },
    });
    setPreviousWeight(weight);
    setPreviousReps(reps);
  };

  const confirmEditClick = () => {
    setEditToggle(!editToggle);
    let exerciseID = set.id;
    let setID = set.set;
    setStartWorkoutContext({
      ...startWorkoutContext,
      [exerciseID]: {
        ...startWorkoutContext[exerciseID],
        [setID]: {
          ...startWorkoutContext[exerciseID][setID],
          reps: reps,
          weight: weight,
        },
      },
    });
    setPreviousWeight(weight);
    setPreviousReps(reps);
    if (weight > set.weight) {
      setShowDialog(true);
    }
  };

  const cancelEdit = () => {
    setEditToggle(!editToggle);
    setWeight(previousWeight);
    setReps(previousReps);
  };

  return (
    <div className="flex flex-auto flex-col gap-5">
      <div
        className={`text-xl w-full ${
          currentExerciseContext[set.id] == set.set
            ? ` ${styles.currentExercise}`
            : ` ${styles.workouts} opacity-40 pointer-events-none`
        }`}
      >
        {!editToggle ? (
          <>
            <AlertDialog open={showDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowDialog(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <h1 className={styles.stats}>{set.reps}</h1>
            <h1 className={styles.stats}>{set.weight}</h1>
            <div className={`${styles.edit} flex gap-3`}>
              <Button
                className={`bg-greenConfirm hover:bg-greenConfirm-foreground hover:text-foreground rounded-full md:h-11 md:w-11 ${
                  editToggle ? "opacity-40 pointer-events-none" : ""
                }`}
                onClick={() => completeRep()}
                size="icon"
              >
                <FaCheck />
              </Button>
              <Button
                className={`bg-main hover:bg-main-foreground hover:text-foreground md:h-11 md:w-11`}
                onClick={() => setEditToggle(!editToggle)}
                size="icon"
              >
                <FaEdit />
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className={styles.stats}>
              <form className="text-center" onSubmit={confirmEditSubmit}>
                <AutosizeInput
                  type="number"
                  name="reps"
                  id=""
                  onChange={(e) => {
                    setReps(e.target.value);
                  }}
                  placeholder="Reps"
                  value={reps}
                  inputStyle={{
                    textAlign: "center",
                    background: "transparent",
                    borderBottom: "2px solid white",
                    marginBottom: "-2px",
                  }}
                  style={{ background: "transparent" }}
                />
              </form>
            </h1>
            <h1 className={styles.stats}>
              <form className="text-center" onSubmit={confirmEditSubmit}>
                <AutosizeInput
                  type="number"
                  name="weight"
                  id=""
                  onChange={(e) => {
                    setWeight(e.target.value);
                  }}
                  placeholder="Weight"
                  value={weight}
                  inputStyle={{
                    textAlign: "center",
                    background: "transparent",
                    borderBottom: "2px solid white",
                    marginBottom: "-2px",
                  }}
                  style={{ background: "transparent" }}
                />
              </form>
            </h1>
            <div className={`${styles.edit} flex gap-3`}>
              <Button
                className={`bg-destructive hover:bg-destructive-foreground hover:text-foreground md:h-11 md:w-11`}
                onClick={() => cancelEdit()}
                size="icon"
              >
                <ImCross />
              </Button>
              <Button
                className={`${styles.edit} bg-greenConfirm hover:bg-greenConfirm-foreground hover:text-foreground md:h-11 md:w-11`}
                onClick={confirmEditClick}
                size="icon"
              >
                <FaCheck />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StartExercise;
