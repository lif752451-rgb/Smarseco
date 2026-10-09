<template>
  <div class="info">
    <div class="info-top">
      <div class="info-head">
        <p>基础信息</p>
      </div>
      <div class="info-top-form">
        <el-form label-position="left" label-width="88px">
          <el-form-item label="标题:">
            <p>{{detailData.title}}</p>
          </el-form-item>
          <el-form-item label="作战周期:">
            <p>{{detailData.combatFightPeriodLabel}}</p>
          </el-form-item>
          <el-form-item label="标签:">
            <div class="info-tags" v-if='detailData.tag'>
              <el-tag v-for="(item,key) in detailTags" :key="key">{{item}}</el-tag>
            </div>
            <span v-else>-</span>
          </el-form-item>
          <el-form-item label="附件:">
            <div class="info-attachment" v-if="detailAttachment.length">
              <sm-annex :model-value="detailAttachment" />
            </div>
            <span v-else>-</span>
          </el-form-item>
      </el-form>
      </div>
    </div>
    <div class="info-content">
      <div class="info-head">
        <p>情报内容</p>
      </div>
      <div class="info-detail">
        <div class="w-e-text" v-html="utils.editorResolve(handlerContent)"></div>
      </div>
    </div>
  </div>
</template>
<script>
import SmAnnex from "/@/components/Annex";
import { formatImage } from '/@/utils/old/index'
import utils from "/@/utils";
export default {
  props:{
    detailData:Object
  },
  computed:{
    detailTags(){
      return this.detailData.tag.split(',')
    },
    detailAttachment(){
      let arr = JSON.parse(this.detailData.attachment)
      return arr ? this.detailData.attachment : ''
    },
    handlerContent(){
      return this.detailData.intelligenceContentRich ? formatImage(this.detailData.intelligenceContentRich) :'-'
    }
  },
  data(){
    return {
      utils
    }
  },
  components:{
    SmAnnex
  }
}
</script>
<style lang="less" scoped>
.info{
  width: 756px;
  .info-head{
    background-color: rgba(128, 255, 255, 0.0980392156862745);
    box-sizing: border-box;
    border-left: 2px solid rgba(0, 255, 255, 1);
    height: 32px;
    padding-left:16px;
    line-height: 32px;
    p{
      font-weight: 500;
      font-style: normal;
      font-size: 14px;
      color: #00FFFF;
    }
  }
  .info-top{
    .info-top-form{
      padding: 10px 0;
      box-sizing: border-box;
      :deep(.el-form-item){
        line-height: 32px;
        margin-bottom:0px;
        .el-form-item__label{
          font-weight: 400;
          font-style: normal;
          color: #00FFFF;
          font-size: 14px;
          display: inline-block !important;
        }
        .el-form-item__content{
          display: inline-block !important;;
          color: #F2F2F2;
          width: calc(100% - 98px);
          vertical-align: top;
          .info-tags{
            display: flex;
            gap: 10px;
            line-height: 32px;
            align-items: center;
            flex-wrap: wrap;
            .el-tag{
              border-color: rgba(128, 255, 255, 1);
              background-color: rgba(128, 255, 255, 0.0980392156862745);
              box-sizing: border-box;
              font-weight: 400;
              font-style: normal;
              color: #00FFFF;
              padding: 0px 8px 0px 8px;
              font-size: 13px;
            }
          }
          .info-attachment{
            display: flex;
            gap: 15px;
          }
        }
      }
    }
  }
  .info-detail{
    .w-e-text{
      padding-top: 10px;
      border: none;
      color: #fff;
 	overflow: auto;
    }
  }
}

</style>
