<template>
    <div class="component-container">
        <div class="title">
            <h3 class="top-sub">Timeline</h3>
            <h3>All Agreements Signed {{timespan}}</h3>
            <p class="chart-description">
                Hover to see agreement name.
            </p>
        </div>
        <svg id="timeline_legend"></svg>
        <div class="timeline">
            <div id="timeline" style="width: 100%; " ></div>
            <div class="downloadBadge">
                <vis-badge
                    class="downloadBadgeInner"
                    v-bind="BADGES.openDataMini"
                    @click="openOpenDataTodo()"
                />
                <vis-badge
                    class="downloadBadgeInner"
                    v-bind="BADGES.downloadPngTimeline"
                    @click="exportTimeline()"
                />
                <vis-badge
                    class="downloadBadgeInner"
                    v-bind="BADGES.infoTimeline"
                />
            </div>
        </div>
    </div>

</template>


<script>
import * as svg from 'save-svg-as-png';
import * as d3 from "d3";
import { ElMessageBox } from 'element-plus';
import { BADGES } from '@/badges'

export default ({
    props: ["data", "agtColor", "timespan"],

    data() {
        return {
            legendList: ['other agreements'],
            processName: '',
            BADGES
        }

    },

    methods: {
        exportTimeline() {
            svg.saveSvgAsPng(document.querySelector('.timeline svg'), "timeline.png");
        },

        openOpenDataTodo() {
            ElMessageBox.alert(`TODO: Open Data action for Timeline.`, 'Open Data', {
                confirmButtonText: 'OK'
            })
        },

        renderTimelineLegend() {
            // var agtColor = JSON.stringify(this.agtColor)

            let timelineList = [`Agreement in ${this.processName}`, "All other agreements"];
            let timelineColors = [this.agtColor, "#D9D9D9"];
            var timelineColorScale = d3.scaleOrdinal()
                                        .domain(timelineList)
                                        .range(timelineColors)

            var timelineSvg = d3.select("#timeline_legend")
                                    .attr("width", 800)
                                    .attr("height", 50)

            timelineSvg.selectAll("rect")
                        .data(timelineList)
                        .enter()
                        .append('rect')
                            .attr("x", 20)
                            .attr("y", (d,i) => (i*25))
                            .attr("width", 18)
                            .attr("height", 18)
                            .style("fill", d => timelineColorScale(d));

            timelineSvg.selectAll("labels")
                        .data(timelineList)
                        .enter()
                        .append('text')
                            .attr("class", "legend-labels")
                            .attr("x", 50)
                            .attr("y", (d,i) => (i*25 + 15))
                            .style("fill", "black")
                            .text(d => d);
        }
    },

    mounted() {
        this.renderTimelineLegend()
    },

    computed:{
		get(){
			return this.data;
		}
	},

	watch:{
		get(val){
            this.processName = val.pp
		},

        processName(newValue, oldValue) {
            const svgElement = document.getElementById('timeline_legend')
            while (svgElement.childNodes.length > 0) {
                svgElement.removeChild(svgElement.childNodes[0])
            }
            this.renderTimelineLegend()

        }
	}
})
</script>


<style scoped>
.timeline {
    height: 300px;
    background-color: white;
    position: relative;
}

.downloadBadge {
    position: absolute;
    right: 10px;
    bottom: 2px;
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
