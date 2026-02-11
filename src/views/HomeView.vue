<template>
    <div class="vis-badges-demo">
      <vis-badge
        type="roundcirculartext"
        variant="outlined"
        size="88"
        ringText="Lorem ipsum"
        label="Lorem ipsum"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        color="rgb(2, 136, 209)"
        icon="Info"
      />

      <vis-badge
        type="mono"
        variant="outlined"
        label="Lorem ipsum"
        description="Lorem ipsum dolor sit amet."
        color="rgb(46, 125, 50)"
        icon="Confirmation"
      />

      <vis-badge
        type="mini"
        variant="outlined"
        label="Lorem ipsum"
        description="Lorem ipsum dolor sit amet."
        color="rgb(237, 108, 2)"
        icon="Warning"
      />
    </div>

    <div class="dropdown-container">
      <scrollystory :country="country" class="left-align"/>
      <el-dropdown @command="navigateToCountry">
        <el-button style="margin-right: 1vw;">Change Signatory</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="UN">United Nations</el-dropdown-item>
            <el-dropdown-item command="CHN">China</el-dropdown-item>
            <el-dropdown-item command="RUS">Russia</el-dropdown-item>
            <el-dropdown-item command="UKG">United Kingdom</el-dropdown-item>
            <el-dropdown-item command="QAT">Qatar</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  
    <div class="top-layout">
    <el-container>
      <el-aside class="top-side">
        <countrytitle :country="country" />
        <peaceprocess
          :country="country"
          :dataPath="dataPath"
          :countryData="countryData" 
          v-on:sendData="getData" 
          :ppArr="ppArr" 
          :timespanArr="timespanArr"
          :actorTypeLegendList="actorTypeLegendList" 
          :colorRange="colorRange"
          :actorTypeLegendListNetwork="actorTypeLegendListNetwork"
          :colorRangeNetwork="colorRangeNetwork"
          :sigColorRange="sigColorRange"
          :agtColor="agtColor"
          :countryTimeline="countryTimeline"
          />
        <!-- <scrollystory :country="country" /> -->
      </el-aside>

      <el-main class="top-main">
        <countrymetrics :processNum="processNum" :agtNum="agtNum" :actorNum="actorNum" :timespan="timespan" />
        <timeline :data="data" :agtColor="agtColor" :timespan="timespan"/>
      </el-main>
    </el-container>
  </div>

  <div class="process-layout">
    <ppdashbord 
      :country="country"
      :dataPath="dataPath"
      :data="data"
      :actorTypeLegendList="actorTypeLegendList" 
      :colorRange="colorRange"
      :actorTypeLegendListNetwork="actorTypeLegendListNetwork"
      :colorRangeNetwork="colorRangeNetwork"
      :sigColorRange="sigColorRange"
      :agtColor="agtColor"
      />
  </div>

</template>

<style scoped>
  .vis-badges-demo {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    padding: 10px 0 6px 0;
  }
</style>

<script>

  import peaceprocess from '../components/peaceprocess.vue'
  import countrytitle from '../components/countrytitle.vue'
  import timeline from '../components/timeline.vue'
  import countrymetrics from '../components/countrymetrics.vue'
  import ppdashbord from '../components/ppdashboard.vue'
  import scrollystory from '../components/scrollystory.vue'

  import countryCodeData from '../data/country_code.json';

  export default {
    components: {peaceprocess, countrytitle,scrollystory, timeline, countrymetrics, ppdashbord},

    data() {
      return {
        ppTitle: '',
        agtNum: 0,
        actorNum: 0,
        agtTime: '',
        data: {},
        countryData: {},
        country: '',
        dataPath: '',
        ppArr: [],
        processNum: 0,
        actorTypeLegendList: [],
        actorTypeLegendListNetwork: [],
        colorRange: ["#198038", "#2980B9", "#FF7F0E", "#03A9F4", "#D62728", "#9467BD", "#BCBD22", "#F1C40F", "#E377C2", "#44E4DB"],
        sigColorRange: ["#657585", "#657585"],
        colorRangeNetwork: [],
        agtColor: "#34495E",
        timespan: '',
        timespanArr: [],
        countryTimeline: 0
      }
    },
    

    methods: {
      getData(data) {
        this.data = data
      },

      async fetchData(countryCode) {
        console.log("run fetch data")
        this.country = countryCode;
        // const csvData = await d3.csv('../data/source/country_files.csv');
        // const countryMapping = csvData.reduce((map, row) => {
        //   map[row.abbr] = row.country;
        //   return map;
        // }, {});
        // this.country = countryMapping[countryCode];
        const countryMapping = countryCodeData.reduce((map, item) => {
          map[item.abbr] = item;
          return map;
        }, {});

        const countryItem = countryMapping[countryCode];
        this.country = countryItem.country;
        this.countryTimeline = countryItem.timeline;

        console.log("homeview data", countryItem)

        this.dataPath = `${countryCode}_agt.json`; 
        console.log(`../data/${this.dataPath}`)
        try {
          const module = await import(`../data/${this.dataPath}`);
          this.countryData = module.default;
          this.processData(this.countryData);
        } catch (error) {
          console.error('Failed to load country data:', error);
          this.countryData = {};
        }
      },

      processData(countryData) {
        for (let i=0; i<countryData.length; i++) {
            var peaceProcess = countryData[i]["PPName"];
            if (this.ppArr.includes(peaceProcess) == false) {
                this.ppArr.push(peaceProcess);
                i++
            } else {
                i++
            }
        }
        console.log(this.ppArr)
        this.processNum = this.ppArr.length
        var agtArr = []
        var agtTimeArr = []
        var actorArr = []

        for (let i=0; i<countryData.length; i++) {
          var agt = countryData[i]["AgtId"]
          var actorType = countryData[i]["actor_type"]

          var date = countryData[i].date;
          
          var dateParts = date.split("/");
          var agtYear = dateParts[2];

          // count all actors
          var actorName = countryData[i]["actor_name"]
          if (actorArr.includes(actorName) == false) {
            actorArr.push(actorName);
          }
          this.actorNum = actorArr.length

          // count all agreements and time range
          if (agtArr.includes(agt) == false) {
              agtArr.push(agt);
              agtTimeArr.push(new Date(agtYear))
              this.agtNum++;
          }

          // get all actor types, pass it to "peaceprocess", "ppdashboard", "legends"
          if (this.actorTypeLegendList.includes(actorType) == false) {
            this.actorTypeLegendList.push(actorType)
          }
        }
        
        // for network, jigsaw rendering
        this.actorTypeLegendListNetwork = this.actorTypeLegendList.slice()
        this.actorTypeLegendListNetwork.unshift("Peace Agreement");
        this.colorRangeNetwork = this.colorRange.slice()
        this.colorRangeNetwork.unshift(this.agtColor);

        var maxDate = new Date(Math.max.apply(null, agtTimeArr))
        var maxYear = maxDate.getFullYear()
        var minDate = new Date(Math.min.apply(null, agtTimeArr))
        var minYear = minDate.getFullYear()
        this.timespan = `${minYear} - ${maxYear}`

        // let timespanArr = [];

        for (let year = minYear; year <= maxYear; year++) {
            this.timespanArr.push({"year": year});
        }

        console.log(this.timespanArr);
        },

      navigateToCountry(countryAbbr) {
        if (countryAbbr) {
          // Use the router so GitHub Pages hash mode works (no full page reload).
          this.$router.push({ path: `/country/${countryAbbr}` });
          // console.log(`..${__webpack_public_path__}country/${countryAbbr}`)
        }
      }
    },

  //   watch: {
  //   '$route'(to, from) {
  //     this.fetchData(to.params.country);
  //   }
  // },

    created() {
      this.fetchData(this.$route.params.country);
    },

    

    // setup() {

    //   var ppArr = [];
    //   for (let i=0; i<countryData.length; i++) {
    //       var peaceProcess = countryData[i]["PPName"];
    //       if (ppArr.includes(peaceProcess) == false) {
    //           ppArr.push(peaceProcess);
    //           i++
    //       } else {
    //           i++
    //       }
    //   }
    //   let processNum = ppArr.length

    //   var agtArr = []
    //   var agtTimeArr = []
    //   var agtNum = 0
    //   var actorArr = []
    //   var actorTypeLegendList = []

    //   for (let i=0; i<countryData.length; i++) {
    //     var agt = countryData[i]["AgtId"]
    //     var actorType = countryData[i]["actor_type"]

    //     var date = countryData[i].date;
    //     var dateParts = date.split("/");
    //     var agtYear = dateParts[2];

    //     // count all actors
    //     var actorName = countryData[i]["actor_name"]
    //     if (actorArr.includes(actorName) == false) {
    //       actorArr.push(actorName);
    //     }
    //     var actorNum = actorArr.length

    //     // count all agreements and time range
    //     if (agtArr.includes(agt) == false) {
    //         agtArr.push(agt);
    //         agtTimeArr.push(new Date(agtYear))
    //         agtNum++;
    //     }

    //     // get all actor types, pass it to "peaceprocess", "ppdashboard", "legends"
    //     if (actorTypeLegendList.includes(actorType) == false) {
    //       actorTypeLegendList.push(actorType)
    //     }
    //   }

    //   var colorRange = [
    //               "#198038", "#2980B9", "#FF7F0E",
    //               "#03A9F4", "#D62728", "#9467BD",
    //               "#BCBD22", "#F1C40F", "#E377C2",
    //               "#44E4DB"
    //               ]
    //   var sigColorRange = ["#657585", "#F4A425"]
    //   var agtColor = "#34495E"
      
    //   // for network, jigsaw rendering
    //   var actorTypeLegendListNetwork = actorTypeLegendList.slice()
    //   actorTypeLegendListNetwork.unshift("Peace Agreement");
    //   var colorRangeNetwork = colorRange.slice()
    //   colorRangeNetwork.unshift(agtColor);

    //   var maxDate = new Date(Math.max.apply(null, agtTimeArr))
    //   var maxYear = maxDate.getFullYear()
    //   var minDate = new Date(Math.min.apply(null, agtTimeArr))
    //   var minYear = minDate.getFullYear()
    //   timespan = `${minYear} - ${maxYear}`

    //   let timespanArr = [];

    //   for (let year = minYear; year <= maxYear; year++) {
    //       timespanArr.push({"year": year});
    //   }

    //   console.log(timespanArr);

    //   return {
    //     ppArr, processNum, agtNum, actorNum, timespan, actorTypeLegendList, colorRange, actorTypeLegendListNetwork, colorRangeNetwork, sigColorRange, agtColor, timespanArr
    //   }

    // }
  }

</script>