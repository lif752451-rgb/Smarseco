<template>
  <el-col :span="6" style="height: 100%">
    <div class="card-box">
      <div class="card-head">
        <el-image :src="util.getAssetsImages('screen-sec/small-title-1.png')" />
      </div>
      <div class="card-body">
        <div class="container">
          <div class="animate">
            <div class="center">
              <b>{{ assetTotal }}</b><p>资产总数</p>
            </div>
            <div class="ball ball1">
              <div class="round">
                <b>{{ netSafetyAsset }}</b><p>网络安全资产</p>
              </div>
            </div>
            <div class="ball ball2">
              <div class="round">
                <b>{{ infoAsset }}</b><p>信息化资产</p>
              </div>
            </div>
            <div class="ball ball3">
              <div class="round">
                <b>{{ dumdTerAsset }}</b><p>哑终端资产</p>
              </div>
            </div>
            <div class="ball ball4">
              <div class="round">
                <b>{{ terAsset }}</b><p>终端资产</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card-box">
      <div class="card-head">
        <el-image :src="util.getAssetsImages('screen-sec/small-title-2.png')" />
      </div>
      <div class="card-body">
        <div class="safety-box">
          <el-row>
            <el-col :span="8" class="main-bg">
            </el-col>
            <el-col :span="4" class="line-box">
              <div class="line1"></div>
              <div class="line2"></div>
              <div class="line3"></div>
            </el-col>
            <el-col :span="11" class="keyword-box">
              <div class="keyword1">
                <div v-for="(item, index) in keyword1" :key="index" class="keyword">
                  <el-row type="flex">
                    <el-col :span="4" style="height: 32px; display: flex; align-items: center;">
                      <div class="color-box" style="background-color: #367BED;"></div>
                    </el-col>
                    <el-col :span="20">
                      <sm-text-tooltip :content="item" />
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="keyword2">
                <div v-for="(item, index) in keyword2" :key="index" class="keyword">
                  <el-row type="flex">
                    <el-col :span="4" style="height: 32px; display: flex; align-items: center;">
                      <div class="color-box" style="background-color: #0EB0F1;"></div>
                    </el-col>
                    <el-col :span="20">
                      <sm-text-tooltip :content="item" />
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="keyword3">
                <div v-for="(item, index) in keyword3" :key="index" class="keyword">
                  <el-row type="flex">
                    <el-col :span="4" style="height: 32px; display: flex; align-items: center;">
                      <div class="color-box" style="background-color: #00C6DC;"></div>
                    </el-col>
                    <el-col :span="20">
                      <sm-text-tooltip :content="item"/>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div class="card-box">
      <div class="card-head">
        <el-image :src="util.getAssetsImages('screen-sec/small-title-3.png')" />
      </div>
      <div class="card-body">
        <div class="vuln-box">
          <el-row :gutter="16" style="margin-bottom: 40px;">
            <el-col :span="8" class="vuln-card">
              <div class="card1">
                <b>{{ vulnCount }}</b>
              </div>
              <span style="font-size: 28px;">漏洞总数</span>
            </el-col>
            <el-col :span="8" class="vuln-card">
              <div class="card2">
                <b>{{ hostCount }}</b>
              </div>
              <span style="font-size: 28px;">主机漏洞</span>
            </el-col>
            <el-col :span="8" class="vuln-card">
              <div class="card3">
                <b>{{ webCount }}</b>
              </div>
              <span style="font-size: 28px;">应用漏洞</span>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8" class="vuln-card">
              <div class="card1">
                <b>{{ highPer }}%</b>
              </div>
              <span style="font-size: 28px;">高危漏洞</span>
            </el-col>
            <el-col :span="8" class="vuln-card">
              <div class="card2">
                <b>{{ mediumPer }}%</b>
              </div>
              <span style="font-size: 28px;">中危漏洞</span>
            </el-col>
            <el-col :span="8" class="vuln-card">
              <div class="card3">
                <b>{{ lowPer }}%</b>
              </div>
              <span style="font-size: 28px;">低危漏洞</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </el-col>
</template>

<script>
import lodash from "lodash-es";
import { getChartDataParam } from '/@/api/stp/visual/visual';
import SmTextTooltip from "/@/components/Tooltip";
import util from '/@/utils';

export default {
  components: { SmTextTooltip },
  data() {
    return {
      util,
      assetTotal: 0,
      netSafetyAsset: 0,
      infoAsset: 0,
      dumdTerAsset: 0,
      terAsset: 0,
      keyword1: [],
      keyword2: [],
      keyword3: [],
      vulnCount: 0,
      hostCount: 0,
      webCount: 0,
      lowPer: 0,
      highPer: 0,
      mediumPer: 0,
      config: {
        placement: 'top',
        popperClass: 'keywords-popper',
      },
    }
  },
  created() {
    this.getVulnData()
    this.getAssetData()
    this.getKeyWords()
  },
  methods: {
    getVulnData() {
      getChartDataParam({ id: "202312041048495700009" }).then((res) => {
        this.vulnCount = res.data.resultData[0].vulnCount;
        this.hostCount = res.data.resultData[0].hostCount;
        this.webCount = res.data.resultData[0].webCount;
        this.lowPer = this.calcPercent(res.data.resultData[0].lowCount, res.data.resultData[0].vulnCount);
        this.highPer = this.calcPercent(res.data.resultData[0].highCount, res.data.resultData[0].vulnCount);
        this.mediumPer = this.calcPercent(res.data.resultData[0].mediumCount, res.data.resultData[0].vulnCount);
      })
    },
    getAssetData() {
      Promise.all([
        getChartDataParam({ id: "202311301901596760002" }),
        getChartDataParam({ id: "202312041620477810002" }),
        getChartDataParam({ id: "202312041614556760000" })
      ]).then((res) => {
        const [ res1, res2, res3 ] = res;
        this.assetTotal = res1.data.resultData[0].total;
        this.netSafetyAsset = res3.data.resultData[0].secuProTotal;
        this.infoAsset = res3.data.resultData[0].serverTotal;
        this.dumdTerAsset = res3.data.resultData[0].internetOfThingsTotal;
        this.terAsset = res2.data.resultData[0].total;
      })
    },
    getKeyWords() {
      getChartDataParam({ id: "202312060951244530000" }).then((res) => {
        this.keyword1 = lodash.get(lodash.find(res.data.resultData, {name: '防护'}), 'child');
        this.keyword2 = lodash.get(lodash.find(res.data.resultData, {name: '监测'}), 'child');
        this.keyword3 = lodash.get(lodash.find(res.data.resultData, {name: '审计'}), 'child');
      })
    },
    calcPercent(a, b) {
      let per = (a / b * 100).toFixed(0);
      if(per == 100 && a != b) {
        per = 99;
      }
      if(per == 0 && a != 0) {
        per = 1;
      }
      return per;
    },
  }
}
</script>

<style scoped lang="less">
.container {
  position: relative;
  height: 600px;
  left: 0;
  top: 0;
  /* 旋转动画 */
  .animate {
    width: 90%;
    height: 100%;
    border-radius: 50%;
    position: absolute;
    left: calc(100% / 2 - 90% / 2);
    background: url("/@/assets/images/screen-sec/asset-surround-bg.png") no-repeat center 70px;
    .ball {
      width: 190px;
      height: 190px;
      position: absolute;
      display:flex;
      flex-direction: column;
      align-items:center;
      justify-content:center;
      font-size: 12px;
      background: url("/@/assets/images/screen-sec/asset-round-bg.png") no-repeat;
      background-size: contain;
      .round {
        text-align: center;
        font-weight: normal;
        color: #EEEEEE;
        line-height: 32px;
        text-shadow: 0 0 23px #2096F7;
      }
    }
    .center {
      width: 280px;
      height: 350px;
      margin: 150px auto 0;
      text-align: center;
      padding-top: 70px;
      color: #ffffff;
      background: url("/@/assets/images/screen-sec/asset-center-bg.png") no-repeat;
    }
    p {
      color: #8FADCC;
      font-size: 28px;
    }
    b {
      font-size: 38px;
      font-style: italic;
    }
  }
  @keyframes animX{
    0% {left: 0;}
    100% { left: 690px; }
  }
  @keyframes animY{
    0% {top: -20px;}
    100% {top: 430px;}
  }
  @keyframes scale {
    0% {
      transform: scale(0.7)
    }
    50% {
      transform: scale(1.2)
    }
    100% {
      transform: scale(0.7)
    }
  }
  /* 6个图x和y轴动画加起来是18s , 18s/6 等于 3s
  每个球y轴动画延迟 从0递减3s,x轴与y轴相差动画时长的一半（9s/2） */
  .ball1 {
    animation: animX 27s cubic-bezier(0.36, 0, 0.64, 1) -13.5s infinite alternate,
    animY 27s cubic-bezier(0.36, 0, 0.64, 1) 0s infinite alternate,
  }
  .ball2 {
    animation: animX 27s cubic-bezier(0.36, 0, 0.64, 1) -27s infinite alternate,
    animY 27s cubic-bezier(0.36, 0, 0.64, 1) -13.5s infinite alternate,
  }
  .ball3 {
    animation: animX 27s cubic-bezier(0.36, 0, 0.64, 1) -40.5s infinite alternate,
    animY 27s cubic-bezier(0.36, 0, 0.64, 1) -27s infinite alternate,
  }
  .ball4 {
    animation: animX 27s cubic-bezier(0.36, 0, 0.64, 1) -54s infinite alternate,
    animY 27s cubic-bezier(0.36, 0, 0.64, 1) -40.5s infinite alternate,
  }
}
.safety-box {
  height: 400px;
  .main-bg {
    height: 400px;
    background: url("/@/assets/images/screen-sec/safety-main-bg.png") center no-repeat;
  }
  .line-box {
    height: 400px;
    .line1 {
      height: 100px;
      background: url("/@/assets/images/screen-sec/safety-line1-bg.png") center no-repeat;
      background-size: 100% 50%;
    }
    .line2 {
      height: 200px;
      background: url("/@/assets/images/screen-sec/safety-line2-bg.png") center no-repeat;
      background-size: 100% 15%;
    }
    .line3 {
      height: 100px;
      background: url("/@/assets/images/screen-sec/safety-line3-bg.png") center no-repeat;
      background-size: 100% 50%;
    }
  }
  .keyword-box {
    height: 400px;
    color: #EEEEEE;
    line-height: 32px;
    font-weight: normal;
    .keyword1, .keyword2, .keyword3 {
      margin-bottom: 20px;
      height: auto;
      padding: 10px 20px;
      background: linear-gradient(180deg, rgba(0,88,148,0) 0%, rgba(0,88,148,0.34) 100%);
      border-radius: 4px;
      opacity: 0.8;
      border: 1px solid;
      border-image: linear-gradient(220deg, rgba(67, 136, 238, 1), rgba(67, 136, 238, 0.13), rgba(67, 136, 238, 0.04), rgba(67, 136, 238, 0.19)) 1 1;
      backdrop-filter: blur(2px);
      .keyword {
        width: calc(100% / 2);
        display: inline-block;
        margin-top: 5px;
        font-size: 25px;
      }
      .color-box {
        line-height: 32px;
        width: 20px;
        height: 20px;
      }
    }
  }
}
.vuln-box {
  height: 500px;
  .vuln-card {
    text-align: center;
    font-weight: normal;
    color: #EEEEEE;
    line-height: 32px;
    // text-shadow: 0px 0px 23px #2096F7;
    height: 200px;
  }
  .card1 {
    height: calc(100% - 50px);
    background: url("/@/assets/images/screen-sec/vuln-yellow-bg.png") center no-repeat;
  }
  .card2 {
    height: calc(100% - 50px);
    background: url("/@/assets/images/screen-sec/vuln-blue-bg.png") center no-repeat;
  }
  .card3 {
    height: calc(100% - 50px);
    background: url("/@/assets/images/screen-sec/vuln-green-bg.png") center no-repeat;
  }
  b {
    font-size: 38px;
    font-style: italic;
  }
}
</style>
<style lang="less">
.keywords-popper {
  font-size: 25px;
}
</style>
