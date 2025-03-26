import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  RigidBody,
  CapsuleCollider,
  vec3,
  CollisionEnterPayload,
} from "@react-three/rapier";
import { Vector3, Euler, Quaternion } from "three";
import Player from "./Player";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { CameraController } from "./CameraController";
import { endGame } from "../store/gameSlice";
import EndGameScreen from "./UI/EndGameScreen";

/**
 * A player controller component that manages player movement and rotation.
 * It uses the Keyboard API to listen for key presses and determine the player's movement.
 * It also uses the RigidBody component from react-three/rapier to apply forces to the player's rigid body.
 * The component also renders a Player component to display the player mesh.
 *
 * @returns {React.Element} A RigidBody component with a CapsuleCollider and a Player component
 */
const PlayerController: React.FC = () => {
  const isGameStarted = useSelector(
    (state: RootState) => state.game.isGameStarted
  );
  const isGameFinished = useSelector(
    (state: RootState) => state.game.isGameFinished
  );
  const isGamePaused = useSelector(
    (state: RootState) => state.game.isGamePaused
  );
  const dispatch = useDispatch();
  const rigidBodyRef = useRef<React.ElementRef<typeof RigidBody>>(null);
  const [isWalking, setIsWalking] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isGrounded, setIsGrounded] = useState(true);
  const [isTurningLeft, setIsTurningLeft] = useState(false);
  const [isTurningRight, setIsTurningRight] = useState(false);
  const [rotationY, setRotationY] = useState(0);

  const walkSpeed = 2;
  const runSpeed = 5;
  const jumpForce = 15;
  const rotationSpeed = 0.01;

  const keys = useRef<{ [key: string]: boolean }>({
    w: false,
    a: false,
    d: false,
    shift: false,
    space: false,
  });

  useEffect(() => {
    if (!isGameStarted || isGamePaused) return;
    /**
     * ✅Handles keydown events. Sets the corresponding key in the keys ref to true.
     * @param {KeyboardEvent} event - The keydown event.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === " ") {
        keys.current.space = true;
      } else {
        keys.current[event.key.toLowerCase()] = true;
      }
    };

    /**
     * ✅Handles keyup events. Sets the corresponding key in the keys ref to false.
     * @param {KeyboardEvent} event - The keyup event.
     */
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === " ") {
        keys.current.space = false;
      } else {
        keys.current[event.key.toLowerCase()] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isGameStarted, isGamePaused]);

  /**
   * ✅Handles collision enter events for the player.
   * This function is triggered when the player's collider enters
   * into contact with another collider. If the other object is the
   * ground, it sets the player's state to grounded and not jumping.
   *
   * @param {CollisionEnterPayload} event - The collision event data.
   */
  const handleCollisionEnter = (event: CollisionEnterPayload) => {
    const otherObjectName = event.other?.colliderObject?.name;

    if (otherObjectName === "ground") {
      setIsGrounded(true);
      setIsJumping(false);
    }
  };

  const handleCollisionExit = () => {
    setIsGrounded(false);
  };

  useFrame(() => {
    if (!rigidBodyRef.current || isGameFinished) return;

    //Checking pressed keys inside useFrame to prevent race conditions
    const walking = keys.current.w;
    const running = walking && keys.current.shift;
    const jumpPressed = keys.current.space;
    const turningLeft = keys.current.a;
    const turningRight = keys.current.d;

    setIsWalking(walking);
    setIsRunning(running);
    setIsTurningLeft(turningLeft);
    setIsTurningRight(turningRight);

    //Applies jump instantly when 'S' is pressed (while grounded)
    if (jumpPressed && isGrounded) {
      console.log("Jumping! Applying impulse.");
      rigidBodyRef.current.applyImpulse(
        vec3({ x: 0, y: jumpForce, z: 0 }),
        true
      );
      setIsJumping(true);
      setIsGrounded(false); //Prevents repeated jumps mid-air
    }

    if (turningLeft) {
      setRotationY((prev) => prev + rotationSpeed);
    }
    if (turningRight) {
      setRotationY((prev) => prev - rotationSpeed);
    }

    const quaternion = new Quaternion().setFromEuler(
      new Euler(0, rotationY, 0)
    );
    rigidBodyRef.current.setRotation(quaternion, true);

    const movementSpeed = isRunning ? runSpeed : walkSpeed;
    const velocity = rigidBodyRef.current.linvel();

    if (isJumping && !isWalking) {
      rigidBodyRef.current.setLinvel(
        vec3({ x: velocity.x, y: velocity.y, z: velocity.z }),
        true
      );
    } else if (isWalking || isJumping) {
      const forward = new Vector3(0, velocity.y, movementSpeed).applyQuaternion(
        quaternion
      );
      rigidBodyRef.current.setLinvel(vec3(forward), true);
    } else {
      //Stops movement if not walking or jumping (this prevents the player from sliding)
      rigidBodyRef.current.setLinvel(vec3({ x: 0, y: velocity.y, z: 0 }), true);
    }

    // Check if the player falls below the ground level (Y position less than -10 for example)
    const playerPosition = rigidBodyRef.current.translation();
    if (playerPosition.y < -10) {
      dispatch(endGame()); // Dispatch the action to end the game
    }
  });

  if (isGameFinished) {
    return <EndGameScreen />;
  }

  return (
    <>
      <CameraController playerRef={rigidBodyRef} />
      <RigidBody
        ref={rigidBodyRef}
        type="dynamic"
        position={[0, 3, 0]}
        gravityScale={2}
        colliders={false}
        mass={1}
        angularDamping={5}
        linearDamping={0}
        lockRotations={true}
        onCollisionEnter={handleCollisionEnter}
        onCollisionExit={handleCollisionExit}
      >
        <CapsuleCollider args={[0.5, 0.5]} />
        <Player
          isWalking={isWalking}
          isRunning={isRunning}
          isJumping={isJumping}
          isTurningLeft={isTurningLeft}
          isTurningRight={isTurningRight}
        />
      </RigidBody>
    </>
  );
};

export default PlayerController;
