<template>
    <div>
        <div style="position:relative;height:600px;width:100%;">
            <iframe v-if="isIframeVisible" id="TPKCBIMIFRAME" src="https://cat-demo.fetnet.net/ems/tpkc-bim/web/" />
            <div id="olcsMap"/>
        </div>

        <button v-if="isIframeVisible" @click="isIframeVisible= false">close the iframe</button>
        <div>
            <input type="radio" id="2d" name="2d" :checked="is2D()" @input="ol3dIns.setEnabled(false)">
            <label for="2d">2D</label>
        </div>
        <div>
            <input type="radio" id="3d" name="3d" :checked="!is2D()" @input="ol3dIns.setEnabled(true)">
            <label for="3d">3D</label>
        </div>
    </div>
</template>

<script>

import OLCesium from 'ol-cesium'

import olView from 'ol/View.js'
import olSourceOSM from 'ol/source/OSM.js'
import olLayerTile from 'ol/layer/Tile.js'
import olMap from 'ol/Map.js'
import {OLCS_ION_TOKEN} from '@/utils/constant'
import * as Cesium from 'cesium'
window.Cesium = Cesium

export default {
    name:"Map",
    data:()=>({
        ol2dIns:null,
        ol3dIns:null,
        isIframeVisible:false
    }),
    mounted(){

        Cesium.Ion.defaultAccessToken = OLCS_ION_TOKEN

        this.ol2dIns = new olMap({
            layers: [
                new olLayerTile({
                    source: new olSourceOSM()
                })
            ],
            target: 'olcsMap',
            view: new olView({
                center: [13520524.84, 2875568.71],
                zoom: 15
            })
        })

        this.ol3dIns = new OLCesium({
            map: this.ol2dIns,
            time() {
                return Cesium.JulianDate.now()
            }
        })

        this.ol3dIns.setEnabled(true)

        this.createModel(require("@/assets/GroundVehicle.glb"))

    },
    methods:{
        is2D(){
            if(!this.ol3dIns){
                return false
            }
            return !this.ol3dIns.getEnabled()
        },
        createModel(url) {
            // console.log("[this.ol3dIns]", this.ol3dIns)
            
            const {scene_:scene} = this.ol3dIns

            const {
                entities
            } = this.ol3dIns.getDataSourceDisplay().defaultDataSource
           
            const entity = entities.add({
                position: Cesium.Cartesian3.fromDegrees(121.45693, 24.99873),
                model: {
                    uri: url,
                    scale: 10
                },
                label: {
                    text : 'TPKC',
                    font : '14pt',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth : 1,
                    verticalOrigin : Cesium.VerticalOrigin.TOP,
                    pixelOffset : new Cesium.Cartesian2(0, 14)
                }
            })

            console.log("entity" , entity)

            const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
            handler.setInputAction(({position})=>{
                
                const pickedObject = scene.pick(position)
                console.log("[pickedObject]",pickedObject)

                if(pickedObject){
                    this.isIframeVisible = true
                }

            }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
               
        }
    }
}
</script>

<style scoped>
#olcsMap{
    position: absolute;
    top: 0;
    left: 0;
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
}

#TPKCBIMIFRAME{
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    bottom: 0;
}
   
</style>