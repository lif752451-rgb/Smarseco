<template>
  <div class="calendar-container">
    <div class="calendar-content">
      <img :src="util.getAssetsImages('other/whole_gt.svg')" class="prev-week" @click="prevWeek" />
      <div>
        <div 
          class="calendar-box" 
          v-for="(item,key) in currentWeek" 
          @click="$emit('open',item.current)"
          :key="key">
          <div class="calendar-head">
            <span class="current">{{item.current.split('-').slice(1).join('-')}}</span>
            <span class="week">{{item.week}}</span>
          </div>
          <div class="calendar-text" >
            <span :class="getClass()" class="lead">{{item.leadCommander}}</span>
            <span :class="getClass()" class="day">{{item.dayShiftLeadCommander}}</span>
            <span :class="getClass()" class="night">{{item.nightShiftLeadCommander}}</span>
          </div>
        </div>
      </div>
      <img :src="util.getAssetsImages('other/whole_gt.svg')" class="next-week"  style="transform: rotate(180deg);" @click="nextWeek" />
    </div>  
  </div>
</template>
<script>
import { getWeekDate, getAllDate ,curDate} from '/@/utils/old/index'
import util from '/@/utils';
import lodash from 'lodash-es'
export default {
  props:{
    open:Function,
    calendarArr:{
      type:Array,
      default:[]
    },
  },
  watch:{
    calendarArr(newVal, oldVal){
      if(newVal != oldVal && this.calendarList){
        this.calendarList = this.calendarArr.sort((a,b)=>a.time - b.time)
        let newDate = new Date().format('yyyy-MM-dd')
        if(lodash.find(this.calendarList, {current: newDate})){
          this.setWeekData(newDate)
        }else{
          if(this.calendarList.length > 7){
            this.currentWeek = this.calendarList.slice(0, 7);
          }else{
            this.setWeekData(this.calendarList[0].current)
          }
        }
      }
    }
  },
  data() {
    return {
      util,
      calendarList: [],
      currentWeek: [],
      dutyColor: ["orange online","red online","green online","blue online"]
    }
  },
  methods:{
    prevWeek(){
      let newDate = new Date(this.currentWeek[0].current);
      newDate = new Date(newDate.setDate(newDate.getDate() -1));
      this.setWeekData(newDate)
    },
    nextWeek(){
      let newDate = new Date(this.currentWeek[this.currentWeek.length-1].current);
      newDate = new Date(newDate.setDate(newDate.getDate() + 1));
      this.setWeekData(newDate)
    },
    setWeekData(newDate){
      let [startDate,endDate] = getWeekDate(newDate);
      let weekList = getAllDate(startDate,endDate)
      this.currentWeek = [];
      weekList.forEach((week) => {
        let item = lodash.find(this.calendarList, {current: week});
        if(item){
          this.currentWeek.push(item);
        }else {
          this.currentWeek.push({
            "current": week,
            "week": curDate(new Date(week)),
            "leadCommander": null,
            "dayShiftLeadCommander": null,
            "nightShiftLeadCommander": null,
            "type": 1
          });
        }
      })
    },
    getClass(){
      return this.dutyColor[Math.floor(Math.random() * 4)];
    }
  }
}

</script>
<style lang="less" scoped>
.calendar-container{
  display: flex;
  flex-direction: column;
  width: 100%;
  .calendar-content{
    display: flex;
    width: 100%;
    .prev-week,.next-week{
      width: 9px;
      height: 9px;
      margin: 56px 10px;
      cursor: pointer;
    }
    >div{
      background: transparent;
      color: #A5F3FD;
      width: calc(100% - 60px);
      display: flex;
    }
    .calendar-box{
      width: 14.3%;
      border: 1px solid #486c7d;
      &:not(:last-child){
        border-right: none;
      }
      .calendar-head{
        display: flex;
        flex-direction: column;
        border-bottom:1px solid #486c7d; 
        justify-content: center;
        align-items: center;
        background-color: rgba(128,255,255,0.09);
        padding: 10px 0;
        span{
          font-weight: 400;
          color: #A5F3FD;
          font-size: 13px;

        }
      }
      .calendar-text{
        display: flex;
        flex-direction: column;
        min-height: 125px;
        justify-content: center;
        .online {
          display: block;
          cursor: pointer;
          padding: 0 0 0 4px;
          margin: 5px 0 0 0;
          font-size: 12px;
          word-break: break-all;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        .online.orange {
          border-left: 4px solid rgba(223, 149, 0, 1);
          color: #DF9500;
          background: rgba(223, 149, 0, 0.27843137254902);
        }

        .online.red {
          border-left: 4px solid rgba(223, 53, 99, 1);
          color: #DF3563;
          background-color: rgba(223, 53, 99, 0.227450980392157);
        }

        .online.green {
          border-left: 4px solid #00b87c;
          color: rgba(0, 187, 125, 0.988235294117647);
          background-color: #145251;
        }

        .online.blue {
          border-left: 4px solid #1890ff;
          color: #1890FF;
          background-color: #1c446f;
        }
      }
    }
  }
}

</style>
