import React, { useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import ModalPseudo from '../UI/ModalPseudo'

export default function MapModel(props) {
  const { nodes, materials } = useGLTF('/assets/models/toulouseMap.glb')
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [pseudo, setPseudo] = useState('')

  const handleIslandClick = () => {
    navigate('/island')
  }
  const handleValidate = (pseudo) => {
    setModalOpen(false)
    setPseudo(pseudo)
    navigate('/island', { state: { pseudo } })
  }

  return (
    <>
      <ModalPseudo open={modalOpen} onValidate={handleValidate} />
      <group {...props} dispose={null}>
        <group name="Scene">
          <mesh
            name="Island"
            castShadow
            receiveShadow
            geometry={nodes.Island.geometry}
            material={materials.Mat}
            onClick={handleIslandClick}
            onPointerOver={e => { document.body.style.cursor = 'pointer' }}
            onPointerOut={e => { document.body.style.cursor = 'default' }}
          />
          <group name="map_3osm_buildings">
            <mesh
              name="map_3osm_buildings_1"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_buildings_1.geometry}
              material={materials.wall}
            />
            <mesh
              name="map_3osm_buildings_2"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_buildings_2.geometry}
              material={materials.roof}
            />
            <mesh
              name="map_3osm_buildings_3"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_buildings_3.geometry}
              material={materials.brown}
            />
            <mesh
              name="map_3osm_buildings_4"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_buildings_4.geometry}
              material={materials.grey}
            />
            <mesh
              name="map_3osm_buildings_5"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_buildings_5.geometry}
              material={materials.beige}
            />
            <mesh
              name="map_3osm_buildings_6"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_buildings_6.geometry}
              material={materials.white}
            />
            <mesh
              name="map_3osm_buildings_7"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_buildings_7.geometry}
              material={materials.gray}
            />
            <mesh
              name="map_3osm_buildings_8"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_buildings_8.geometry}
              material={materials.ffad84}
            />
          </group>
          <mesh
            name="map_3osm_water"
            castShadow
            receiveShadow
            geometry={nodes.map_3osm_water.geometry}
            material={materials.water}
          />
          <group name="map_3osm_roads_tertiary">
            <mesh
              name="map_3osm_roads_tertiary_1"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_roads_tertiary_1.geometry}
              material={materials['Material.001']}
            />
            <mesh
              name="map_3osm_roads_tertiary_2"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_roads_tertiary_2.geometry}
              material={materials.areas_pedestrian}
            />
            <mesh
              name="map_3osm_roads_tertiary_3"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_roads_tertiary_3.geometry}
              material={materials.areas_footway}
            />
            <mesh
              name="map_3osm_roads_tertiary_4"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_roads_tertiary_4.geometry}
              material={materials.roads_service}
            />
            <mesh
              name="map_3osm_roads_tertiary_5"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_roads_tertiary_5.geometry}
              material={materials.roads_secondary}
            />
            <mesh
              name="map_3osm_roads_tertiary_6"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_roads_tertiary_6.geometry}
              material={materials.roads_pedestrian}
            />
            <mesh
              name="map_3osm_roads_tertiary_7"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_roads_tertiary_7.geometry}
              material={materials.paths_cycleway}
            />
            <mesh
              name="map_3osm_roads_tertiary_8"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_roads_tertiary_8.geometry}
              material={materials.paths_steps}
            />
          </group>
          <group name="map_3osm_forest">
            <mesh
              name="map_3osm_forest_1"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_forest_1.geometry}
              material={materials.forest}
            />
            <mesh
              name="map_3osm_forest_2"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_forest_2.geometry}
              material={materials.vegetation}
            />
          </group>
          <group name="chateau_d'eau">
            <mesh
              name="map_3osm_buildings001"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_buildings001.geometry}
              material={materials.wall}
            />
            <mesh
              name="map_3osm_buildings001_1"
              castShadow
              receiveShadow
              geometry={nodes.map_3osm_buildings001_1.geometry}
              material={materials.roof}
            />
          </group>
          <mesh
            name="stone"
            castShadow
            receiveShadow
            geometry={nodes.stone.geometry}
            material={materials.stone}
          />
        </group>
      </group>
    </>
  )
}

useGLTF.preload('public/Models/toulouseMap.glb')
