export const BASE_INFO = [
    {
      label: '标题',
      value: 'taskName',
      name: 'taskName',
      tooltip: true,
    },
    {
      label: '作战周期',
      value: 'taskPeriodLabel',
      name: 'taskPeriodLabel',
      tooltip: true,
    },
    {
      label: '任务类型',
      value: 'taskType',
      name: 'taskType',
      tooltip: true,
    },
    {
      label: '优先级',
      value: 'taskLevelLabel',
      name: 'taskLevelLabel',
    },
    {
      label: '跟进人',
      value: 'taskFollowPersonName',
      name: 'taskFollowPersonName',
      tooltip: true,
    },
    {
      label: '反馈截止时间',
      value: 'deadlineTime',
      name: 'deadlineTime',
      tooltip: true,
    },
    {
      label: '任务内容',
      value: 'contentHtml',
      name: 'contentHtml',
      span: 3,
      html: true
    },
    { 
      label: "附件",
      value: "attList",
      name: "attList",
      span: 3,
      annex: true
    },
    {
      label: '任务状态',
      value: 'statusLabel',
      name: 'statusLabel',
    },
    {
      label: '创建人',
      value: 'createByLabel',
      name: 'createByLabel',
      tooltip: true,
    },
    {
      label: '创建时间',
      value: 'createTime',
      name: 'createTime',
      tooltip: true,
    },
  ]  

  export const RECORD_INFO = [
    {
      label: '创建',
      operationType: '创建',
      labels: []
    },
    {
      label: '反馈',
      operationType:'反馈',
      labels: [
        {
          name: '跟进情况',
          prop: 'commentEditor',
        },
        {
          name: '附件',
          prop: 'commonAttBusinessTypeList',
        }
      ]
    },
    {
      label: '转办',
      operationType:'转办',
      labels: [
        {
          name: '转办对象',
          prop: 'sourcePerson',
        },
        {
          name: '转办原因',
          prop: 'comment',
        }
      ]
    },
    {
      // type: 'approve',
      label: '审核',
      operationType:'审核',
      labels: [
        {
          name: '审核结果',
          prop: 'dealResult',
        },
        {
          name: '审核意见',
          prop: 'comment',
        }
      ]
    },
  ]