<template>
    <hr />
    <div class='process-wrapper'>
        <h2 id="processTitle">{{ this.title }}</h2>
        <p>Description placeholder for peace process</p>
        <p>Interact with charts: <b>Hover</b> nodes for more information. <b>Click</b> to show related nodes. Use buttons to expand to full views for more information.</p>
    </div>

    <div class="parent">
        <div class="div1">
            <div class="title">
                <h3 class="top-sub">Key Metrics</h3>
                <h3>Summary</h3>
            </div>
            <div class="title">
            <div class="ppmetrics-container">
                <div class="metrics-wrapper">
                    <p class="metrics-num"> {{ this.agtNum }} </p>
                    <p class="metrics-title">Agreements</p>
                </div>
                <div class="metrics-wrapper">
                    <p class="metrics-num"> {{ this.actorNum -1 }} </p>
                    <p class="metrics-title">Other Actors</p>
                </div>
                <div class="metrics-wrapper">
                    <p class="metrics-num"> {{ this.time }} </p>
                    <p class="metrics-title">Activity Range</p>
                </div>
            </div>
            </div>
        </div>

        <div class="div2">
                <div class="title">
                    <h3 class="top-sub">Legend</h3>
                    <h3>Actors and Signatory Types</h3>
                </div>
                <!-- <el-affix :offset="0"> -->
                    <div class="legend-box">
                    <legends
                        :actorTypeLegendList="actorTypeLegendList"
                        :colorRange="colorRange"
                        :sigColorRange="sigColorRange"
                        :agtColor="agtColor"/>
                    </div>
                <!-- </el-affix> -->
        </div>

        <div class="div3" style="position: relative;">
            <div class="network">
            <div class="title">
                <h3 class="top-sub">Network</h3>
                <h3>Agreement - Actor Network View</h3>
                <p class="chart-description">
                    Network view of all agreements and actors in process, linked by signatory type.
                </p>
            </div>
            <div id="network" style="width: 100%;"></div>
            </div>
            <div class="downloadBadge">
                <vis-badge
                    class="downloadBadgeInner"
                    type="mini"
                    variant="filled"
                    label="Open Data"
                    description="Open data for this chart."
                    actionIcon="Confirmation"
                    actionText="Click for details"
                    color="rgb(46, 125, 50)"
                    icon="Confirmation"
                    @click="openOpenDataTodo('Network')"
                />
                <vis-badge
                    class="downloadBadgeInner"
                    type="mini"
                    variant="filled"
                    label="Download PNG"
                    description="Download the network view as a PNG image."
                    actionIcon="Download"
                    actionText="Click to download"
                    color="rgb(2, 136, 209)"
                    icon="Download"
                    @click="exportNetwork()"
                />
                <vis-badge
                    class="downloadBadgeInner"
                    type="mini"
                    variant="filled"
                    label="Expand"
                    description="Open the network view in full screen."
                    actionIcon="Expand"
                    actionText="Click to expand"
                    color="rgb(2, 136, 209)"
                    icon="Expand"
                    @click="clickNetwork()"
                />
                <vis-badge
                    class="downloadBadgeInner"
                    type="mini"
                    variant="filled"
                    label="Info"
                    description="Network: Hover nodes for more information. Click a node to show related nodes."
                    color="rgb(2, 136, 209)"
                    icon="Interactive"
                />
            </div>
            <el-dialog
                align-center
                v-model="dialogVisible"
                title="Agreement - Actor Network View"
                width="95%"
                class="my-network-dialog"
                >
                <network
                    ref="network"
                    :title="this.title"
                    :actorList="this.actorList"
                    :agreementList="this.agreementList"
                    :actorTypeLegendListNetwork="actorTypeLegendListNetwork"
                    :colorRangeNetwork="colorRangeNetwork"
                    :actorTypeLegendList="actorTypeLegendList"
                    :colorRange="colorRange"
                    :sigColorRange="sigColorRange"
                    :agtColor="agtColor"
                    :country="country"
                    :dataPath="dataPath"
                    />
            </el-dialog>
        </div>

        <div class="div4" style="position: relative;">
            <div class="list">
                <div class="title">
                    <h3 class="top-sub">List</h3>
                    <h3>Agreement - Actors in a List View</h3>
                    <p class="chart-description">
                        Agreements and relevant actors, ordered in a list view by agreement date and actor type.
                    </p>
                </div>
                <div id="list" style=" width:100%;"></div>
            </div>
            <div class="downloadBadge">
                <vis-badge
                    class="downloadBadgeInner"
                    type="mini"
                    variant="filled"
                    label="Open Data"
                    description="Open data for this chart."
                    actionIcon="Confirmation"
                    actionText="Click for details"
                    color="rgb(46, 125, 50)"
                    icon="Confirmation"
                    @click="openOpenDataTodo('List')"
                />
                <vis-badge
                    class="downloadBadgeInner"
                    type="mini"
                    variant="filled"
                    label="Download PNG"
                    description="Download the list view as a PNG image."
                    actionIcon="Download"
                    actionText="Click to download"
                    color="rgb(2, 136, 209)"
                    icon="Download"
                    @click="exportList()"
                />
                <vis-badge
                    class="downloadBadgeInner"
                    type="mini"
                    variant="filled"
                    label="Expand"
                    description="Open the list view in full screen."
                    actionIcon="Expand"
                    actionText="Click to expand"
                    color="rgb(2, 136, 209)"
                    icon="Expand"
                    @click="clickList()"
                />
                <vis-badge
                    class="downloadBadgeInner"
                    type="mini"
                    variant="filled"
                    label="Info"
                    description="List: Scroll to browse agreements and actors. Hover items for details."
                    color="rgb(2, 136, 209)"
                    icon="Interactive"
                />
            </div>

            <el-dialog
            align-center
            v-model="listVisible"
            title="Agreement - Actors in a List View"
            class="dialog-width"
            >
            <list
                ref="list"
                :title="this.title"
                :agtNum="agtNum"
                :maxNum="maxNum"
                :actorTypeLegendList="actorTypeLegendList"
                :colorRange="colorRange"
                :sigColorRange="sigColorRange"
                :agtColor="agtColor"
                :country="country"
                :dataPath="dataPath" />
            </el-dialog>
        </div>


        <div class="div5" id="div5" style="position: relative;">
            <div class="jigsaw">
            <div class="title">
                <h3 class="top-sub">Jigsaw</h3>
                <h3>Agreement - Actor Jigsaw View</h3>
                <p class="chart-description">
                    Agreements ordered by date listed on left column, actors on the right.
                </p>
            </div>
            <div id="jigsaw" style="width: 100%;" ></div>
            </div>
            <div class="downloadBadge">
                <vis-badge
                    class="downloadBadgeInner"
                    type="mini"
                    variant="filled"
                    label="Open Data"
                    description="Open data for this chart."
                    actionIcon="Confirmation"
                    actionText="Click for details"
                    color="rgb(46, 125, 50)"
                    icon="Confirmation"
                    @click="openOpenDataTodo('Jigsaw')"
                />
                <vis-badge
                    class="downloadBadgeInner"
                    type="mini"
                    variant="filled"
                    label="Download PNG"
                    description="Download the jigsaw view as a PNG image."
                    actionIcon="Download"
                    actionText="Click to download"
                    color="rgb(2, 136, 209)"
                    icon="Download"
                    @click="exportJigsaw()"
                />
                <vis-badge
                    class="downloadBadgeInner"
                    type="mini"
                    variant="filled"
                    label="Expand"
                    description="Open the jigsaw view in full screen."
                    actionIcon="Expand"
                    actionText="Click to expand"
                    color="rgb(2, 136, 209)"
                    icon="Expand"
                    @click="clickJigsaw()"
                />
                <vis-badge
                    class="downloadBadgeInner"
                    type="mini"
                    variant="filled"
                    label="Info"
                    description="Jigsaw: Scroll to explore. Hover items for details."
                    color="rgb(2, 136, 209)"
                    icon="Interactive"
                />
            </div>

            <el-dialog
            align-center
            v-model="jigsawVisible"
            title="Agreement - Actor Jigsaw View"
            class="jigsaw-dialog-width"
            >
            <jigsaw
                ref="jigsaw"
                :title="this.title"
                :actorTypeLegendListNetwork="actorTypeLegendListNetwork"
                :colorRangeNetwork="colorRangeNetwork"
                :actorTypeLegendList="actorTypeLegendList"
                :colorRange="colorRange"
                :sigColorRange="sigColorRange"
                :agtColor="agtColor"
                :country="country"
                :dataPath="dataPath" />
            </el-dialog>

        </div>
    </div>


</template>

<script>
import legends from '@/components/legends.vue'
import * as svg from 'save-svg-as-png'
import { ElMessageBox } from 'element-plus'

import network from '../components/network.vue'
import jigsaw from '../components/jigsaw.vue'
import list from '../components/list.vue'


export default {
    components: {legends, network, jigsaw, list},

    props: ["country", "dataPath", "data", "actorTypeLegendList", "colorRange", "actorTypeLegendListNetwork", "colorRangeNetwork", "sigColorRange", "agtColor"],

    data() {
        return {
            title: '',
            agtNum: 0,
            actorNum: 0,
            time: '',
            maxNum: 0,
            actorList: [],
            agreementList: [],
            dialogVisible: false,
            matrixVisible:false,
            jigsawVisible: false,
            listVisible: false
        }
    },

    methods: {
        clickNetwork() {
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.network.render()
            })
        },

        clickJigsaw() {
            this.jigsawVisible = true
            this.$nextTick(() => {
                this.$refs.jigsaw.renderJigsaw()
            })
        },

        clickList() {
            this.listVisible = true
            this.$nextTick(() => {
                this.$refs.list.render()
            })
        },

        exportNetwork() {
            svg.saveSvgAsPng(document.querySelector('.network svg'), "network.png");
        },

        exportList() {
            svg.saveSvgAsPng(document.querySelector('.list svg'), "list.png");
        },

        exportJigsaw() {
            svg.saveSvgAsPng(document.querySelector('.jigsaw svg'), "jigsaw.png");
        }
        ,

        openOpenDataTodo(where) {
            ElMessageBox.alert(`TODO: Open Data action for ${where}.`, 'Open Data', {
                confirmButtonText: 'OK'
            })
        }
    },

    computed:{
		get(){
			return this.data;
		}
	},

	watch:{
		get(val){
            this.title = val.pp
            this.agtNum = val.agtNum
            this.actorNum = val.actorNum
            this.time = val.time
            this.actorList = val.actorList
            this.agreementList = val.actors
            this.maxNum = val.maxNum
		}
	}
}

</script>

<style scoped>
    .network,
    .list,
    .jigsaw {
        position: relative;
    }

    .downloadBadge {
        position: absolute;
        right: 10px;
        bottom: 10px;
        z-index: 10;
        display: inline-flex;
        align-items: center;
        gap: 2px;
    }

    .downloadBadgeInner {
        cursor: pointer;
        user-select: none;
    }
</style>
