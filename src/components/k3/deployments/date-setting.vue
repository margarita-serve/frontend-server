<template>
  <slot name="header" />

  <template v-if="resourceFlag">
    <div class="flex flex-row mb-5">
      <div class="flex flex-column mr-6">
        <div class="flex mb-3">Model</div>
        <div class="flex">
          <K3Dropdown v-model="selectmodel" :options="modeldropdown" optionLabel="name" optionValue="code"
            placeholder="Model is empty" class="w-15rem" style="text-overflow: ellipsis;" />
        </div>
      </div>

      <div class="flex flex-column ml-6">
        <div class="flex mb-3">Range (UTC+0)</div>
        <template v-for="(col, index) in saveDateTimes" :key="index">
          <div class="flex align-items-center justify-content-center" v-if="col.model === selectmodel">
            <K3Calendar v-model="calDate1" autocomplete="on" :showIcon="true" :showTime="true" :showButtonBar="true"
              dateFormat="yy-mm-dd" :minDate="col.startDate" :maxDate="col.endDate" />
            <i class="pi pi-arrow-right ml-5 mr-5" />
            <K3Calendar v-model="calDate2" autocomplete="on" :showIcon="true" :showTime="true" :showButtonBar="true"
              dateFormat="yy-mm-dd" :minDate="col.startDate" :maxDate="col.endDate" />
          </div>
        </template>
      </div>

      <div class="flex flex-column ml-6 align-items-center justify-content-center">
        <div class="flex">
          <K3Dropdown v-model="calSlideStep" :options="calSlideSteps" optionLabel="label" optionValue="value"
            placeholder="Select a Date" class="mr-5 border-blue-500 text-blue-500 w-8rem" />
          <K3Button type="button" label="Refresh" icon="pi pi-sync"
            class="bg-white p-button-outline p-button mr-5 text-blue-500 p-button-lg w-8rem" @click="clickGraph()" />
          <K3Button type="button" label="Reset" icon="pi pi-refresh"
            class="bg-white p-button-outline p-button mr-5 text-blue-500 p-button-lg w-8rem" @click="reset()" />
        </div>
      </div>
    </div>

    <template v-for="(col, index) in saveDateTimes" :key="index">
      <div class="flex flex-row mb-5" v-if="col.model === selectmodel">
        <K3Slider v-model="calSlide" :min="Date.parse(col.startDate)" :max="Date.parse(col.endDate)"
          :step="calSlideStep" :range="true" class="w-full bg-black-alpha-60" @change="changeCalDate()" />
      </div>
    </template>
  </template>

  <template v-else />
  <slot name="body" />

  <slot name="graph" />
</template>

<script setup lang="ts">
import { MessageTypes } from "~~/src/models";

const route = useRoute();
const deployID = route.query?.DEID;
const ModelPackageID = route.query?.MPID;
const { modelpackagesGetID, isFetchMPID, isStatusCodeMPID, isErrorMsgMPID, fetchMPID } = useAllService().getModelPackagesID(String(ModelPackageID));
const { historys, isFetchHistory, fetchGetHistory } = useAllService()?.getDeploymentsIDHistory(String(deployID));
const { deploymentsGetID, isfetchDeIDGet, isStatusCodeDeIDGet, isErrorMsgDeIDGet, fetchDeIDGet } = useAllService()?.getDeploymentsID(String(deployID));

const { UI } = useAppHelper();

// Variable
const calDate1 = ref();
const calDate2 = ref();
const saveDateTimes = ref([]);
const calSlide = ref([]);
const calSlideStep = ref(1000 * 60 * 60);

const graphStartTime = ref();
const graphEndTime = ref();
const graphSkeleton = ref(true);

const resourceFlag = ref(true);

const selectmodel = ref();
const modeldropdown = ref([]);
const saveSelectmodel = ref();
const calSlideSteps = ref([
  { label: "Month", value: 1000 * 60 * 60 * 24 * 30 },
  { label: "Week",  value: 1000 * 60 * 60 * 24 * 7 },
  { label: "Day",   value: 1000 * 60 * 60 * 24 },
  { label: "Hours", value: 1000 * 60 * 60 },
]);

// Props
const props = defineProps({ dataDriftEmitsFun: Object, });

// Emits

// accuracy-tab TargetMetric
const targetMetricValue = ref(props?.dataDriftEmitsFun?.TargetMetric);

// Method
const callTabGraph = {
  DataDrift: () => {
    props?.dataDriftEmitsFun?.Details(String(deployID), selectmodel.value, graphStartTime.value, graphEndTime.value);
    props?.dataDriftEmitsFun?.Drift(String(deployID), selectmodel.value, graphStartTime.value, graphEndTime.value);
    props?.dataDriftEmitsFun?.Predict(String(deployID), selectmodel.value, graphStartTime.value, graphEndTime.value);
  },

  ServiceStatus: () => {
    props?.dataDriftEmitsFun?.GraphService(String(deployID), selectmodel.value, graphStartTime.value, graphEndTime.value);
  },

  AccuracyTab: () => {
    props?.dataDriftEmitsFun?.MonitorAcc(String(deployID), selectmodel.value, graphStartTime.value, graphEndTime.value, targetMetricValue.value);
    props?.dataDriftEmitsFun?.GraphAccOver(String(deployID), selectmodel.value, graphStartTime.value, graphEndTime.value, targetMetricValue.value);
    props?.dataDriftEmitsFun?.GraphPredictAct(String(deployID), selectmodel.value, graphStartTime.value, graphEndTime.value);
  },

  Resource: () => {
    resourceFlag.value = false;
    watch(() => deploymentsGetID.value, (newvalue, oldvalue) => {
      if (newvalue?.requestMEM) {
        props?.dataDriftEmitsFun?.ResourceCPU(String(deployID), newvalue.requestCPU);
        props?.dataDriftEmitsFun?.ResourceMemory(String(deployID), newvalue.requestMEM);
      }
    });
  },
};

const clickGraph = () => {
  String(calDate1.value).includes("T") ? graphStartTime.value = useAllService().dateFilter(calDate1.value) : graphStartTime.value = calDate1.value;
  String(calDate2.value).includes("T") ? graphEndTime.value = useAllService().dateFilter(calDate2.value) : graphEndTime.value = calDate2.value;

  if (String(graphStartTime.value) > String(graphEndTime.value)) {
    UI.showToastMessage(MessageTypes.ERROR, 'Input Error Date', '시작 날짜가 끝나는 날짜보다 높습니다.');
    return;
  }

  switch (props?.dataDriftEmitsFun?.TabName) {
    case 'data-drift':
      callTabGraph?.DataDrift();
      break;
    case 'service-status':
      callTabGraph?.ServiceStatus();
      break;
    case 'accuracy-tab':
      callTabGraph?.AccuracyTab();
      break;
    case 'resource':
      callTabGraph?.Resource();
      break;
  }
};

const reset = () => { selectmodel.value = saveSelectmodel.value; };

const changeCalDate = () => {
  calDate1.value = new Date(calSlide.value[0]);
  calDate2.value = new Date(calSlide.value[1]);
};

// Watch
watch(() => props?.dataDriftEmitsFun?.TargetMetric, (newvalue, oldvalue) => { targetMetricValue.value = newvalue; });
watch(() => calDate1.value, (newvalue, oldvalue) => { exposeValue.value.graphStartTime = useAllService().dateFilter(newvalue); });
watch(() => calDate2.value, (newvalue, oldvalue) => { exposeValue.value.graphEndTime = useAllService().dateFilter(newvalue); });
watch(() => graphSkeleton.value, (newvalue, oldvalue) => { exposeValue.value.graphSkeleton = newvalue; });
watch(() => selectmodel.value, (newvalue, oldvalue) => {
  exposeValue.value.selectmodel = newvalue;
  calDate1.value = saveDateTimes.value.find(i => i.model === newvalue).startDate;
  calDate2.value = saveDateTimes.value.find(i => i.model === newvalue).endDate;
  calSlide.value = [];
});
watch(() => modelpackagesGetID.value, (newvalue, oldvalue) => { exposeValue.value.targetType = newvalue.targetType; });

watch(
  () => historys.value, (newvalue, oldvalue) => {
    if (newvalue.length > 0) {
      for (let i = 0; i < newvalue.length; i++) {
        let startDate = new Date();
        let endDate = new Date();

        startDate.setFullYear(newvalue[i].StartDate.split("T")[0].split("-")[0]);
        startDate.setMonth(newvalue[i].StartDate.split("T")[0].split("-")[1] - 1, newvalue[i].StartDate.split("T")[0].split("-")[2]);
        startDate.setHours(newvalue[i].StartDate.split("T")[1].split(":")[0]);

        if (newvalue[i].ApplyHistoryTag == "Current") {
          selectmodel.value = newvalue[i].ID;
          saveSelectmodel.value = newvalue[i].ID;
          graphSkeleton.value = false;
          endDate.setFullYear(new Date().getUTCFullYear());
          endDate.setMonth(new Date().getUTCMonth(), new Date().getUTCDate());
          endDate.setHours(new Date().getUTCHours() + 1);

        } else {
          endDate.setFullYear(newvalue[i].EndDate.split("T")[0].split("-")[0]);
          endDate.setMonth(newvalue[i].EndDate.split("T")[0].split("-")[1] - 1, newvalue[i].EndDate.split("T")[0].split("-")[2]);
          endDate.setHours(newvalue[i].EndDate.split("T")[1].split(":")[0]);
        }

        calDate1.value = useAllService().dateFilter(String(startDate));
        calDate2.value = useAllService().dateFilter(String(endDate));
        graphStartTime.value = useAllService().dateFilter(String(startDate));
        graphEndTime.value = useAllService().dateFilter(String(endDate));

        saveDateTimes.value.push({ model: newvalue[i].ID, startDate: startDate, endDate: endDate });
        modeldropdown.value.push({
          name: newvalue[i].ApplyHistoryTag + ' | ' + newvalue[i].Name + ' | '
            + startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate() + ' ~ ' +
            endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate(),
          code: newvalue[i].ID
        });
      }

      if (newvalue[newvalue.length-1].ApplyHistoryTag == "Current") {
          switch (props?.dataDriftEmitsFun?.TabName) {
            case 'data-drift':
              callTabGraph?.DataDrift();
              break;
            case 'service-status':
              callTabGraph?.ServiceStatus();
              break;
            case 'accuracy-tab':
              modelpackagesGetID.value?.targetType === "Binary" ? targetMetricValue.value = "tpr" : targetMetricValue.value = "rmse";
              callTabGraph?.AccuracyTab();
              break;
            case 'resource':
              callTabGraph?.Resource();
              break;
          }
        }
    } else {
      graphSkeleton.value = true;
    }
  },
);

// Mounted
onMounted(() => {
  fetchMPID(),
  fetchDeIDGet(),
  fetchGetHistory()
});

// Export
const exposeValue = ref({
  graphSkeleton: graphSkeleton.value,
  selectmodel: selectmodel.value,
  graphStartTime: useAllService().dateFilter(calDate1.value),
  graphEndTime: useAllService().dateFilter(calDate2.value),
  targetType: modelpackagesGetID.value?.targetType,
});

defineExpose({ exposeValue, });

</script>

<style>

</style>