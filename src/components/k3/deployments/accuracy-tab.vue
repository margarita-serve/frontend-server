<template>
  <div class="flex flex-column text-2xl p-5" style="background-color: #F2F2F8;">
    <K3DeploymentsDateSetting :dataDriftEmitsFun="dataDriftEmitsFun" ref="sendFromChild">
      <template v-slot:header>
        <h3 class="mb-5">정확도</h3>
      </template>

      <template v-slot:body>
        <div v-if="monitorAccStatusCode === 200 && monitorAccResultCode === 200" class="flex flex-row flex-wrap mb-5 w-auto">
          <div class="flex m-2" v-for="(col, index) in monitorAccurancyStatus" :key="index">
            <div
              :class="ClickFlag === index ? 'flex flex-column align-items-center justify-content-center bg-white border-2 border-blue-500 p-2' : 'flex flex-column align-items-center justify-content-center bg-white border-1 p-2'"
              @click="clickTargetMetric(col.header), ClickFlag = index">
              <div class="flex mb-2 text-2xl text-orange-700">{{col.header}}</div>
              <div class="flex flex-row">
                <div class="flex flex-column w-auto mr-1">
                  <div class="w-10rem flex align-items-center justify-content-center mb-2"> start:&nbsp;{{convertNumber(col.base)}} </div>
                  <div class="w-11rem flex align-items-center justify-content-center text-blue-500" v-if="betterWorse(convertNumber(col.percent)).includes('better')"> {{betterWorse(convertNumber(col.percent))}} </div>
                  <div class="w-11rem flex align-items-center justify-content-center text-red-500" v-else-if="betterWorse(convertNumber(col.percent)).includes('worse')"> {{betterWorse(convertNumber(col.percent))}} </div>
                  <div class="w-11rem flex align-items-center justify-content-center" v-else> {{betterWorse(convertNumber(col.percent))}} </div>
                </div>
                <div class="w-6rem flex align-items-center justify-content-center text-3xl">{{convertNumber(col.actual)}}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-else
          class="flex flex-row text-4xl align-items-center justify-content-center bg-white border-1 hover:border-blue-500 h-10rem mb-5">
          <div>{{monitorAccErrorMsg}}</div>
        </div>
      </template>

      <template v-slot:graph>
        <div class="flex flex-column">
          <div class="flex bg-white border-1 hover:border-blue-500 mb-5" style="width: 100rem; height: 35rem;">
            <iframe v-if="sendFromChild?.exposeValue?.graphSkeleton === false" id="accOverTimeGraph" src="" frameborder="0" width="100%" height="100%"
              scrolling="auto" />
            <K3Skeleton v-else width="100%" height="100%" />
          </div>
          <div class="flex bg-white border-1 hover:border-blue-500" style="width: 100rem; height: 35rem;">
            <iframe v-if="sendFromChild?.exposeValue?.graphSkeleton === false" id="predictActGraph" src="" frameborder="0" width="100%" height="100%"
              scrolling="auto" />
            <K3Skeleton v-else width="100%" height="100%" />
          </div>
        </div>
      </template>
    </K3DeploymentsDateSetting>
  </div>

</template>

<script setup lang="ts">
// import
import { MessageTypes } from "~~/src/models";

const targetMetricValue = ref();
const sendFromChild = ref();
const dataDriftEmitsFun = ref({
  TabName: "accuracy-tab",
  TargetMetric: targetMetricValue.value,
  GraphAccOver: async (deployID: string, selectmodel: string, graphStartTime: string, graphEndTime: string, targetMetric: string = targetMetricValue.value) => {
    const graphAccOver = await useAllService().graphCollet.getGraphAccOver(deployID, selectmodel, targetMetric, graphStartTime, graphEndTime);
    document.getElementById('accOverTimeGraph').setAttribute("src", graphAccOver);
  },
  GraphPredictAct: async (deployID: string, selectmodel: string, graphStartTime: string, graphEndTime: string) => {
    const graphPredicAct = await useAllService().graphCollet.getGraphPredictAct(deployID, selectmodel, graphStartTime, graphEndTime);
    document.getElementById('predictActGraph').setAttribute("src", graphPredicAct);
  },
  MonitorAcc: async (deployID: string, selectmodel: string, graphStartTime: string, graphEndTime: string) => {
    if (selectmodel) {
      const { monitorAccurancys, isStatusCodeMonitorAcc, isErrorMsgMonitorAcc, fetchGetMonitorAcc } = useAllService().getDeIDMonitorAccurancy(deployID, selectmodel, graphStartTime, graphEndTime);
      fetchGetMonitorAcc();
      watch(
        () => monitorAccurancys?.value, (newvalue, oldvalue) => {
          monitorAccurancyStatus.value.forEach((item) => { monitorAccurancyStatus.value.splice(0, monitorAccurancyStatus.value.length); });
          const objects = eval("(" + newvalue + ")");
          if (Object.keys(objects).length > 0) {
            if (sendFromChild.value.exposeValue.targetType === "Binary") {
              monitorAccurancyStatus.value.push({ header: "TPR", base: objects.tpr?.base, actual: objects.tpr?.actual, percent: objects.tpr?.percent });
              monitorAccurancyStatus.value.push({ header: "Accuracy", base: objects.accuracy?.base, actual: objects.accuracy?.actual, percent: objects.accuracy?.percent });
              monitorAccurancyStatus.value.push({ header: "F1", base: objects.f1?.base, actual: objects.f1?.actual, percent: objects.f1?.percent });
              monitorAccurancyStatus.value.push({ header: "PPV", base: objects.ppv?.base, actual: objects.ppv?.actual, percent: objects.ppv?.percent });
              monitorAccurancyStatus.value.push({ header: "FNR", base: objects.fnr?.base, actual: objects.fnr?.actual, percent: objects.fnr?.percent });
              monitorAccurancyStatus.value.push({ header: "FPR", base: objects.fpr?.base, actual: objects.fpr?.actual, percent: objects.fpr?.percent });
            } else {
              monitorAccurancyStatus.value.push({ header: "RMSE", base: objects.rmse?.base, actual: objects.rmse?.actual, percent: objects.rmse?.percent });
              monitorAccurancyStatus.value.push({ header: "MAE", base: objects.mae?.base, actual: objects.mae?.actual, percent: objects.mae?.percent });
              monitorAccurancyStatus.value.push({ header: "Gamma Deviance", base: objects.mean_gamma_deviance?.base, actual: objects.mean_gamma_deviance?.actual, percent: objects.mean_gamma_deviance?.percent });
              monitorAccurancyStatus.value.push({ header: "Tweedie Deviance", base: objects.mean_tweedie_deviance?.base, actual: objects.mean_tweedie_deviance?.actual, percent: objects.mean_tweedie_deviance?.percent });
              monitorAccurancyStatus.value.push({ header: "RMSLE", base: objects.rmsle?.base, actual: objects.rmsle?.actual, percent: objects.rmsle?.percent });
              monitorAccurancyStatus.value.push({ header: "MAPE", base: objects.mape?.base, actual: objects.mape?.actual, percent: objects.mape?.percent });
            }
            monitorAccResultCode.value = 200;
          }
          else { monitorAccResultCode.value = 500; }
        }
      )

      watch(() => isStatusCodeMonitorAcc?.value, (newvalue, oldvalue) => { if (newvalue) { monitorAccStatusCode.value = isStatusCodeMonitorAcc.value; } });
    }
  }
});

watch(()=> targetMetricValue?.value, (newvalue, oldvalue)=>{ dataDriftEmitsFun.value.TargetMetric = newvalue; });

const route = useRoute();
const deployID = route.query?.DEID;
const { UI } = useAppHelper();

const monitorAccurancyStatus = ref([]);
const monitorAccStatusCode = ref();
const monitorAccResultCode = ref();
const monitorAccErrorMsg = ref("There are no predictions in the selected date range");
const ClickFlag = ref(0);

const clickTargetMetric = (targetmetric: string) => {
  if(String(sendFromChild.value.exposeValue.graphStartTime) > String(sendFromChild.value.exposeValue.graphEndTime)){
    UI.showToastMessage(MessageTypes.ERROR, 'Input Error Date', '시작 날짜가 끝나는 날짜보다 높습니다.');
    return;
  }

  targetMetricValue.value = targetmetric.toLowerCase();

  dataDriftEmitsFun.value.GraphAccOver(String(deployID), sendFromChild.value.exposeValue.selectmodel, sendFromChild.value.exposeValue.graphStartTime, sendFromChild.value.exposeValue.graphEndTime, targetMetricValue.value)
}

const convertNumber = (convertNumber: any) => {
  const number = ref();
  if (convertNumber === 'N/A'){ return 'N/A'; }

  if(convertNumber >= 1000){ return number.value = new Intl.NumberFormat("en", { minimumFractionDigits: 3, maximumFractionDigits: 3, notation: 'compact'  }).format(convertNumber); }
  else{ number.value = convertNumber?.toFixed(2); return number.value; }
}

const betterWorse = (convertString: any) => {
  if(convertString === 'N/A'){ return 'N/A'; }

  return convertString > 0 ? String(convertString + '% better') : String(convertString + '% worse');
}

</script>

<style lang="scss">
</style>