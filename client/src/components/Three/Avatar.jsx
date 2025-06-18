import React, { useMemo, useRef } from 'react';
import { useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations, Text } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import useMovement from '../../hooks/useMovement';
import useCharacterAnimation from '../../hooks/useCharacterAnimation';

export function Model({
  hairColor = "green",
  topColor = "pink",
  bottomColor = "brown",
  pseudo = '',
  position = [0, 0, 0],
  rotation = 0,
  isCurrentPlayer = false,
  socket = null,
  characterId = null,
  ...props
}) {
  const group = useRef();
  const { scene, animations, materials } = useGLTF('/assets/models/Animated Woman.glb');
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  // Mouvement : hook seulement pour le joueur courant
  const movementData = isCurrentPlayer
    ? useMovement(socket, characterId, position)
    : {
        position,
        keysPressed: {},
        rotation,
        animation: (() => {
          // Pour les autres joueurs, on déduit l'animation à partir de keysPressed
          // Si char.keysPressed existe et qu'une touche de déplacement est true, on met "Run"
          // Sinon "Idle"
          if (props.keysPressed) {
            const moving = Object.keys(props.keysPressed).some(
              (key) => props.keysPressed[key]
            );
            return moving ? "CharacterArmature|Run" : "CharacterArmature|Idle";
          }
          return "CharacterArmature|Idle";
        })(),
      };

  // Joue l'animation courante
  useCharacterAnimation(actions, movementData.animation);

  return (
    <group
      ref={group}
      position={movementData.position}
      rotation-y={movementData.rotation}
      {...props}
      dispose={null}
    >
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="CharacterArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <primitive object={nodes.Root} />
          </group>
          <group
            name="Casual_Body"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              name="Casual_Body_1"
              geometry={nodes.Casual_Body_1.geometry}
              material={materials.White}
              skeleton={nodes.Casual_Body_1.skeleton}
            >
              <meshStandardMaterial color={topColor} />
            </skinnedMesh>
            <skinnedMesh
              name="Casual_Body_2"
              geometry={nodes.Casual_Body_2.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Body_2.skeleton}
            />
          </group>
          <group
            name="Casual_Feet"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              name="Casual_Feet_1"
              geometry={nodes.Casual_Feet_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Feet_1.skeleton}
            />
            <skinnedMesh
              name="Casual_Feet_2"
              geometry={nodes.Casual_Feet_2.geometry}
              material={materials.Grey}
              skeleton={nodes.Casual_Feet_2.skeleton}
            />
          </group>
          <group
            name="Casual_Head"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              name="Casual_Head_1"
              geometry={nodes.Casual_Head_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Head_1.skeleton}
            />
            <skinnedMesh
              name="Casual_Head_2"
              geometry={nodes.Casual_Head_2.geometry}
              material={materials.Hair_Blond}
              skeleton={nodes.Casual_Head_2.skeleton}
            >
              <meshStandardMaterial color={hairColor} />
            </skinnedMesh>
            <skinnedMesh
              name="Casual_Head_3"
              geometry={nodes.Casual_Head_3.geometry}
              material={materials.Hair_Brown}
              skeleton={nodes.Casual_Head_3.skeleton}
            >
              <meshStandardMaterial color={hairColor} />
            </skinnedMesh>
            <skinnedMesh
              name="Casual_Head_4"
              geometry={nodes.Casual_Head_4.geometry}
              material={materials.Brown}
              skeleton={nodes.Casual_Head_4.skeleton}
            />
          </group>
          <skinnedMesh
            name="Casual_Legs"
            geometry={nodes.Casual_Legs.geometry}
            material={materials.Orange}
            skeleton={nodes.Casual_Legs.skeleton}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <meshStandardMaterial color={bottomColor} />
          </skinnedMesh>
        </group>
      </group>
      <Text position={[0, 2.2, 0]} fontSize={0.3} color="black" anchorX="center" anchorY="middle">
        {pseudo}
      </Text>
    </group>
  );
}