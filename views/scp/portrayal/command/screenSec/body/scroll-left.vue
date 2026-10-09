<template>
  <div class="attack-wrap" ref="attack-wrap">
    <ul ref="attack-list"
      :class="`${position}-attack-list`">
      <li class="attack-item" v-for="(item, k1) in array1" :key="k1">
        <p class="attack-row" :style="{ color: item.color, fontSize: item.fontSize + 'px', marginLeft: item.left + 'px', lineHeight: item.lineHeight + 'px' }">
          {{ item.label ? item.label : item.name }}
        </p>
      </li>
    </ul>
    <ul ref="attack-list"
      :class="`${position}-attack-list`">
      <li class="attack-item" v-for="(item, k1) in array2" :key="k1">
        <p class="attack-row" :style="{ color: item.color, fontSize: item.fontSize + 'px', marginLeft: item.left + 'px', lineHeight: item.lineHeight + 'px' }">
          {{ item.label ? item.label : item.name }}
        </p>
      </li>
    </ul>
    <ul ref="attack-list"
      :class="`${position}-attack-list`">
      <li class="attack-item" v-for="(item, k1) in array3" :key="k1">
        <p class="attack-row" :style="{ color: item.color, fontSize: item.fontSize + 'px', marginLeft: item.left + 'px', lineHeight: item.lineHeight + 'px' }">
          {{ item.label ? item.label : item.name }}
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'AttackList',
  props: {
    attackIpList: {
      type: Array,
      default: []
    },
    position: {
      type: String,
      default: 'leftTop'
    }
  },
  data() {
    return {
      array1: [],
      array2: [],
      array3: [],
    }
  },
  created() {
  },
  methods: {
    integerArray(array) {
      let n = array.length
      let m = Math.floor(n/3)
      this.array1 = array.slice(0, m)
      this.array2 = array.slice(m, 2*m) 
      this.array3 = array.slice(2*m, n)
    }
  },
  watch: {
    attackIpList(val) {
      this.integerArray(val)
      const second = val.length * 3;
      const distance = val.length * 100 / 3;
      document.documentElement.style.setProperty(`--${ this.position }-width`, `${ distance }px`)
      // document.documentElement.style.setProperty(`--${ this.position }-distance`, `-${ distance - 70 }px`)
      document.documentElement.style.setProperty(`--${ this.position }-second`, `${ second }s`)
    },
  }
}
</script>
<style lang="less" scoped>
.attack-wrap {
  overflow: hidden;
  .leftTop-attack-list, .leftBottom-attack-list, .rightTop-attack-list, .rightBottom-attack-list {
    width: 300px;
    transform: translateX(0);
    list-style: none;
    padding: 0 0 1px 0;
    display: flex;
    flex-direction: row-reverse;
    .attack-item {
      margin-right: 10px;
      height: 40px;
      line-height: 40px;
      flex-shrink: 0;
      .attack-row {
        line-height: 33px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 0 0 25px 0;
        text-shadow: none;
      }
    }
  }
  .leftTop-attack-list {
    animation: scroll-leftTop var(--leftTop-second) linear infinite;
  }
  .leftBottom-attack-list {
    animation: scroll-leftBottom var(--leftBottom-second) linear infinite;
  }
  .rightTop-attack-list {
    animation: scroll-rightTop var(--rightTop-second) linear infinite;
  }
  .rightBottom-attack-list {
    animation: scroll-rightBottom var(--rightBottom-second) linear infinite;
  }
  @keyframes scroll-leftTop {
    form {
      transform: translateX(0);
    }
    to {
      transform: translateX(var(--leftTop-width));
    }
  }
  @keyframes scroll-leftBottom {
    form {
      transform: translateX(0);
    }
    to {
      transform: translateX(var(--leftBottom-width));
    }
  }
  @keyframes scroll-rightTop {
    form {
      transform: translateX(0);
    }
    to {
      transform: translateX(var(--rightTop-width));
    }
  }
  @keyframes scroll-rightBottom {
    form {
      transform: translateX(0);
    }
    to {
      transform: translateX(var(--rightBottom-width));
    }
  }
}
</style>
