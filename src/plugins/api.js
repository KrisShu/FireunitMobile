const API = {


  //  todo 登录注册
  Add: "/api/services/app/FireUnitUser/Add", //添加账号
  USER_LOGIN: "/api/services/app/FireUnitUser/UserLoginForMobile", //用户登录
  QUERY_FIRE_UNIT_LIKE_NAME: "/api/services/app/FireUnit/QueryFireUnitLikeName", //查询防火单位名称(模糊查询)
  INVITAT_VERIFY: "/api/services/app/FireUnit/InvitatVerify", //邀请码验证
  USER_REGISTUSER_REGIST: "/api/services/app/FireUnitUser/UserRegist", //用户注册

  // todo 引导页
  GET_FIRE_UNIT_PEOPLE: "/api/services/app/AppGuideSet/GetFireUnitPeople", //获取防火单位工作人员
  GetUserInfo: "/api/services/app/AppGuideSet/GetUserInfo", //获取工作人员详情
  UPDATE_USER_INFO: "/api/services/app/AppGuideSet/UpdateUserInfo", //编辑工作人员信息
  ADD_USER: "/api/services/app/AppGuideSet/AddUser", //新增工作人员
  DELETE_USER: "api/services/app/AppGuideSet/DeleteUser", // 删除工作人员
  UPDATE_FireUnit_System:"/api/services/app/AppGuideSet/UpdateFireUnitSystem",


  GetNoReadAlarmNumList:"/api/services/app/Alarm/GetNoReadAlarmNumList",//
  GetFireAlarmList:"/api/services/app/Alarm/GetFireAlarmList",//
  CheckFireAlarm:"/api/services/app/Alarm/CheckFireAlarm",//提交核警
  GetFireAlarmById:"/api/services/app/Alarm/GetFireAlarmById",//根据fireAlarmId获取单条火警数据详情
  GetElectricAlarmList:"/api/services/app/Alarm/GetElectricAlarmList",//电气火灾报警
  GetWaterAlarmList:"/api/services/app/Alarm/GetWaterAlarmList",//消防管网
  GetVisionAlarmList:"/api/services/app/Alarm/GetVisionAlarmList",//获取防火单位消防分析仪报警列表数据
  GetVisionAlarmPhotoPath:'/api/services/app/Alarm/GetVisionAlarmPhotoPath',//


  // todo 维保单位和消防巡查
  UPDATE_GUIDESET: "/api/services/app/AppGuideSet/UpdateGuideSet", //更新防火单位引导设置
  GetFireUnitInfo: "/api/services/app/FireUnit/GetFireUnitInfo", //防火单位详情

  //todo 设施故障
  GET_BREAK_DOWNLIST: "/api/services/app/BreakDownService/GetBreakDownlist", //获取设施故障列表
  GET_BREAK_DOWN_INFO: "/api/services/app/BreakDownService/GetBreakDownInfo", //获取设施故障详情
  UPDATE_BREAK_DOWN_INFO:
    "/api/services/app/BreakDownService/UpdateBreakDownInfo", //更新设施故障详情

  // todo 消防系统
  GET_FIRE_SYSTEM: "/api/services/app/AppGuideSet/GetFireSystem", //获取消防系统
  GetFireUnitSystem: "/api/services/app/AppGuideSet/GetFireUnitSystem", //获取防火单位消防系统
  AddFireSystem: "/api/services/app/AppGuideSet/AddFireSystem", //增加消防系统

  //  todo 终端设备
  /* GET_END_DEVICE_OPTIONS: "/api/services/app/Device/GetEndDeviceOptions", //获取终端设备筛选选项
  GET_FIRE_UNIT_END_DEVICE_STATE:"/api/services/app/Device/GetFireUnitEndDeviceState", //获取防火单位的终端状态
  GET_RECORD_ANALOG: "/api/services/app/Device/GetRecordAnalog", //获得防火单位终端历史记录 */
  //物联终端
  //火警联网
  GetFireAlarmDeviceList: "/api/services/app/FireDevice/GetFireAlarmDeviceList", //获取指定防火单位ID的火警联网设施列
  GetFireAlarmFaultDetectorList:"/api/services/app/FireDevice/GetFireAlarmFaultDetectorList", //获取指定设备ID的故障部件列表
  GetFireAlarm30DayList: "/api/services/app/FireDevice/GetFireAlarm30DayList", //获取指定设备ID的30天报警记录
  GetFireAlarmHighList: "/api/services/app/FireDevice/GetFireAlarmHighList", //获取高频报警部件列表
  //电气火灾设施
  GetFireElectricDeviceState: "/api/services/app/FireDevice/GetFireElectricDeviceState", //获取电气火灾设备各状态数量
  GetFireElectricDeviceList:"/api/services/app/FireDevice/GetFireElectricDeviceList", //获取指定防火单位ID的电气火灾设施列表
  GetSingleElectricDeviceData:'/api/services/app/FireDevice/GetSingleElectricDeviceData',//刷新某一电气火灾设备的当前数值
  BreakoffPower:'/api/services/app/FireDevice/BreakoffPower',//发送断电信号
  //消防管网
  GetFireWaterDeviceList: "/api/services/app/FireDevice/GetFireWaterDeviceList", //获取消防管网设备列表
  //-----------------------------------------------------------------------------------------------------
  //  todo 消防预警
  GET_ALARM_CHECKS: "/api/services/app/Alarm/GetAlarmChecks", //获取指定防火单位警情数据
  GET_ALARM_CHECK_DETAIL: "/api/services/app/Alarm/GetAlarmCheckDetail", //查询给定checkId的警情详细信息
  CHECK_ALARM: "/api/services/app/Alarm/CheckAlarm", //核警某一条警情[FromForm]

  //  todo 值班
  GET_DUTY_LIST: "/api/services/app/DutyAndPatrolService/GetDutylist", //获取值班记录列表
  GET_DUTY_INFO: "/api/services/app/DutyAndPatrolService/GetDutyInfo", //获取值班记录详情
  ADD_DUTY_INFO: "/api/services/app/DutyAndPatrolService/AddDutyInfo", //新增值班记录

  //todo 巡查
  GET_PATROL_LIST: "/api/services/app/DutyAndPatrolService/GetPatrollist", //获取巡查记录列表
  GET_PATROL_TRACK_LIST:
    "/api/services/app/DutyAndPatrolService/GetPatrolTrackList", //获取巡查记录轨迹
  GetFireUnitlSystem:
    "/api/services/app/DutyAndPatrolService/GetFireUnitlSystem", //获取防火单位消防系统
  ADD_PATROL_TRACK: "/api/services/app/DutyAndPatrolService/AddPatrolTrack", //添加巡查记录
  GetListByFireUnitId:'/api/services/app/FireUnitArchitecture/GetListByFireUnitId',//获取总得建筑信息
  GET_PATROL_TYPE: "/api/services/app/DutyAndPatrolService/GetPatrolType", //新增时获取巡查记录类别
  ADD_PATROL_TRACK_DETAIL:"/api/services/app/DutyAndPatrolService/AddPatrolTrackDetail", //添加巡查记录轨迹
  AddPatrolTrackDetailAll:"/api/services/app/DutyAndPatrolService/AddPatrolTrackDetailAll",
  GET_ADD_ALLOW: "/api/services/app/DutyAndPatrolService/GetAddPatrolAllow", //新增时查询今日是否已添加
  GET_PATROL_INFOFORWEB:
    "/api/services/app/DutyAndPatrolService/GetPatrolInfoForWeb", //Web获取巡查记录轨迹,获取问题点数量
  //-------------2019/12/30-----
  SubmitPatrolDetail:'/api/services/app/DutyAndPatrolService/SubmitPatrolDetail',//提交巡查轨迹点
  GetPatrolDetailInfo:"/api/services/app/DutyAndPatrolService/GetPatrolDetailInfo",//获取未提交的巡查轨迹点的详情
  UpdatePatrolDetail:"/api/services/app/DutyAndPatrolService/UpdatePatrolDetail",//修改巡查记录
  DeletePatrolDetail:"/api/services/app/DutyAndPatrolService/DeletePatrolDetail",//删除巡查轨迹点

  GetPatrolInfo:"/api/services/app/DutyAndPatrolService/GetPatrolInfo",//获取巡查记录详情List
  GetPatrolList:"/api/services/app/DutyAndPatrolService/GetPatrolList",//获取巡查记录列表
  SubmitPatrol:"/api/services/app/DutyAndPatrolService/SubmitPatrol",//提交巡查主记录
  DeletePatrol:"/api/services/app/DutyAndPatrolService/DeletePatrol",//删除巡查记录



  //  todo 设置
  UPDATE_EQUIPMENTNO_INFO:
    "/api/services/app/AppGuideSet/UpdateEquipmentNoInfo", //修改设施编码信息
  GET_EQUIPMENTNO_LIST: "/api/services/app/AppGuideSet/GetEquipmentNoList", //获取绑定设施编码列表
  ADD_EQUIPMENT_NO: "/api/services/app/AppGuideSet/AddEquipmentNo", //绑定设施编码
  GET_EQUIPMENTNO_INFO: "/api/services/app/AppGuideSet/GetEquipmentNoInfo", //扫码获取信息
  ADD_ADVICE: "/api/services/app/Version/Add", //添加建议
  Get_Select_Safe_Units: "/api/services/app/SafeUnit/GetSelectSafeUnits", //选择查询维保单位
  CHANGE_PASSWORD: "/api/services/app/FireUnitUser/ChangePassword", //修改密码
  USER_LOGOUT: "/api/services/app/FireUnitUser/UserLogout"//注销用户
 
};
export default API;
