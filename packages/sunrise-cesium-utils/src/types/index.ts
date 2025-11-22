import { CesiumTerrainProvider, Viewer } from "cesium";

export type calculateLocationType = {
    longitude: number;
    latitude: number;
    heading: number;
    terrainProvider: CesiumTerrainProvider;
}

export type findModelByIdType = {
    viewer: Viewer
    id: string
}