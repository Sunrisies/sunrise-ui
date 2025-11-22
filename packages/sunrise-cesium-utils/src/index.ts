import { Cartesian3, Cartographic, HeadingPitchRoll, Matrix4, Model, sampleTerrain, Transforms, Viewer, Math, Rectangle } from "cesium"
import { calculateLocationType, findModelByIdType } from "./types"
/**
 * @Date: 2024-02-27 11:30:59
 * @Author: 朝阳
 * @function: 计算位置矩阵，根据传入的数据去获取新的位置数据
 * @return {Matrix4} 返回结果
 * @param {number} longitude
 * @param {number} latitude
 * @param {number} heading
 * @param {CesiumTerrainProvider} terrainProvider
 */
export const calculateLocationMatrix = async ({
    longitude,
    latitude,
    heading = 0,
    terrainProvider
}: calculateLocationType): Promise<Matrix4> => {
    try {
        const positions = [Cartographic.fromDegrees(longitude, latitude)]
        const result = await sampleTerrain(terrainProvider, 11, positions)
        const height = result[0].height
        console.log(height)
        const origin = Cartesian3.fromDegrees(longitude, latitude, 2)
        const hpr = HeadingPitchRoll.fromDegrees(heading, 0, 0)
        const matrix = Transforms.headingPitchRollToFixedFrame(origin, hpr)
        return matrix
    } catch (error) {
        console.error('An error occurred while calculating the location matrix:', error)
        throw error
    }
}


/**
 * @Date: 2024-02-27 17:17:49
 * @Author: 朝阳
 * @description: 根据模型ID在场景中查找对应的模型实例
 * @param {findModelByIdType} params - 包含查找模型所需参数的对象
 * @param {Viewer} params.viewer - 场景查看器实例，用于访问场景中的模型
 * @param {string} params.id - 要查找的模型的唯一标识符
 * @returns {Model | null} - 如果找到匹配的模型，则返回该模型实例；否则返回null
 */
export function findModelById({ viewer, id }: findModelByIdType): Model | null {
    const primitives = viewer.scene.primitives
    for (let i = 0; i < primitives.length; ++i) {
        const primitive = primitives.get(i)
        if (primitive instanceof Model && primitive.id === id) {
            return primitive
        }
    }
    return null
}

/**
 * @Date: 2023-03-06 13:55:29
 * @Author: 朝阳
 * @function: 跳转
 * @param: root 当前组件的根实例
 * @param: params 要跳转的位置,一般是经纬度,都是已经通过cesium转换过的坐标
 */
// 跳转
export function flyTo(map: Viewer, position: Cartesian3 | Rectangle) {
    console.log(position, map)
    map.camera.flyTo({
        destination: position,
        orientation: {
            heading: Math.toRadians(0),
            pitch: Math.toRadians(-90),
            roll: 0.0
        }
    })
}