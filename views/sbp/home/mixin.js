import lodash from 'lodash-es'
// const SearchForm = () => import('./components/SearchForm');
// const TableList = () => import('./components/TableList');
export default {
  name: 'homepageMixins',
  components: {
    // SearchForm,
    // TableList
  },
  data() {
    return {
      tableColumns: [
        {
          label: "标题",
          prop: "title",
          minWidth: '200px',
          disabled: 'disabled',
          formatter: (row, column) => {
            return (column.title || '-')
          }
        },
        {
          label: "工单状态",
          prop: "workStatus",
          type: "point",
          width: "180px",
        },
        {
          label: "提交人",
          prop: "committer",
          width: "200px",
        },
        {
          label: "提交时间",
          prop: "commitTime",
          width: "200px",
        }
      ],
      tableConfig: {
        tableHeight: 680,
        selection: false,
        index: true,
        noDataMsg: '暂无数据'
      },
      // 表格操作列参数
      handleConfig: {
        handleWidth: 140,
        handleShow: true,
        hasView: true,
        handleView: this.handleView,
      },
      searchParams: {
        pageNum: 1,
        pageSize: 20,
      }
    }
  },
  created () {
    this.tableConfig.tableHeight = window.innerHeight - 280;
  },
  mounted() {
    const { type = '' } = this.$route.params;
    this.formType = type;
    this.getTabList(!!type);
    this.$nextTick(() => {
      this.tableConfig.tableHeight = window.innerHeight - 280;
    });
  },
  computed: {
    listTitle() {
      const routeName = this.$route.meta.title || '需我处理'
      const tabData = lodash.find(this.tabData, (o) => (o.formType === this.formType))
      const tabLabel = (tabData && tabData.formName) || ''
      return `${tabLabel} - ${routeName}列表（${this.total}）`
    },
    username() {
      return this.$store.state.user.name;
    }
  },
  methods: {
    handleSearch(params) {
      this.searchParams = {
        ...this.searchParams,
        ...params
      }
      this.getTableList()
    },
    handleClick() {
      const radio = lodash.find(this.tabData, (o) => (o.formType === this.formType));
      this.basePath = radio.path || ''
      this.handleResetParams();
      this.getTableList();
    },
    searchHeigth(flag) {
      //点击更多搜素
      if (flag) {
        this.tableConfig.tableHeight = window.innerHeight - 330; // 加载表格高度
      } else {
        this.tableConfig.tableHeight = window.innerHeight - 280; // 加载表格高度
      }
    },
    handleResetParams() {
      this.searchParams = {
        pageNum: 1,
        pageSize: 20,
      }
      this.tableData = [];
      this.total = 0;
    },
    openUrl(url) {
      window.open(url +`${url.includes('?') ? '&' : '?'}un=${this.username}`, "_blank")
    }
  }
}
