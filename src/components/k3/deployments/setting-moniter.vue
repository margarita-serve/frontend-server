<template>
  <!-- CONTENT HERE -->
  <div class="w-auto">
    <div v-if="isStatusCodeMointor === 200" style="width: 70rem">
      <div class="flex justify-content-end mt-3 mb-3">
        <K3Button label="Save new Setting"  class="mr-3 p-button-outlined"  icon="pi pi-save"     @click="saveNewSetting()" />
        <K3Button label="Reset to defaults" class="p-button-outlined"       icon="pi pi-refresh"  @click="resetToDefaults()" />
      </div>
      <K3FormContainer class="mb-5">
        <template #header>Data Drift</template>
        <!-- <template #footer> <K3Button label="Save" /> </template> -->
        <K3FormRow>
          <K3FormColumn class="" label="Range">
            <K3Inplace :closable="true">
              <template #display>
                <template v-for="(col, index) in monitorRangeDropdown" :key="index">
                  <span v-if="col.code === allMonitorsDrift?.monitorRange" class="pr-2" >{{col.name}}</span>
                </template>
                <i class="pi pi-pencil bg-orange-400 border-round" style="font-size: 1.1rem" />
              </template>
              <template #content>
                <K3Dropdown v-model="monitorRangeSelect" :options="monitorRangeDropdown" optionLabel="name"
                  optionValue="code" placeholder="Select a monitor range" />
              </template>
            </K3Inplace>
          </K3FormColumn>

          <K3FormColumn label="Drift Metric">
            <K3Dropdown v-model="dirftMetricSelect" :options="driftMetricDropdown" optionLabel="name" optionValue="code"
              placeholder="Select a drift metric" />
          </K3FormColumn>

          <K3FormColumn label="Drift Threshould">
            <K3Inplace :closable="true">
              <template #display>
                <!-- <K3InputText type="text" v-model="driftThresholdText" /> -->
                <span class="pr-2" > {{ driftThresholdText }} </span>
                <i class="pi pi-pencil bg-orange-400 border-round" style="font-size: 1.1rem" />
              </template>
              <template #content>
                <K3InputText type="text" v-model="driftThresholdText" />
              </template>
            </K3Inplace>
          </K3FormColumn>

          <K3FormColumn label="Importance Threshould">
            <K3Inplace :closable="true">
              <template #display>
                <!-- <K3InputText type="text" v-model="driftThresholdText" /> -->
                <span class="pr-2"> {{ importanceThresholdText }} </span>
                <i class="pi pi-pencil bg-orange-400 border-round" style="font-size: 1.1rem" />
              </template>
              <template #content>
                <K3InputText type="text" v-model="importanceThresholdText" />
              </template>
            </K3Inplace>
          </K3FormColumn>

          <K3FormColumn label="Low-Importance Drift Count">
            <span style="margin-left: 0.75rem;"> At Risk </span>
            <K3InputText class="ml-3 w-7rem" type="text" v-model="lowImportanceAtRiskText" />
            <!-- <K3FormInputField v-model="v$.lowImportanceAtRiskText" /> -->
            <span style="margin-left: 0.75rem;"> Failing </span>
            <K3InputText class="ml-3 w-7rem" type="text" v-model="lowImportanceFailingText" />
          </K3FormColumn>

          <K3FormColumn label="High-Importance Drift Count">
            <span style="margin-left: 0.75rem;"> At Risk </span>
            <K3InputText class="ml-3 w-7rem" type="text" v-model="highImportanceAtRiskText" />
            <span style="margin-left: 0.75rem;"> Failing </span>
            <K3InputText class="ml-3 w-7rem" type="text" v-model="highImportanceFailingText" />
          </K3FormColumn>

        </K3FormRow>
      </K3FormContainer>

      <K3FormContainer>
        <template #header>Accurancy</template>
        <!-- <template #footer>Footer</template> -->
        <K3FormRow>
          <K3FormColumn label="Range">
            <span style="margin-left: 0.75rem;"> All prediction </span>
          </K3FormColumn>

          <K3FormColumn v-if="modelpackagesGetID?.targetType === 'Regression'" label="Metric">
            <K3Dropdown v-model="regressionMetricSelect" :options="regressionMetricDropdown" optionLabel="name"
              optionValue="code" placeholder="Select a metric" />
          </K3FormColumn>

          <K3FormColumn v-else label="Metric">
            <K3Dropdown v-model="binaryMetricSelect" :options="binaryMetricDropdown" optionLabel="name" optionValue="code"
              placeholder="Select a metric" />
          </K3FormColumn>

          <K3FormColumn label="Measurement">
            <K3Dropdown v-model="measurementSelect" :options="measurementDropdown" optionLabel="name" optionValue="code"
              placeholder="Select a measurement" />
          </K3FormColumn>

          <K3FormColumn label="increases by">
            <span style="margin-left: 0.75rem;"> At Risk </span>
            <K3InputText class="ml-3 w-7rem" type="text" v-model="accIncreaseAtRistText" />
            <span style="margin-left: 0.75rem;"> Failing </span>
            <K3InputText class="ml-3 w-7rem" type="text" v-model="accIncreaseFalingText" />
          </K3FormColumn>
        </K3FormRow>
      </K3FormContainer>
    </div>

    <div v-else class="surface-overlay border-1 w-auto min-h-full p-2 py-0">
      <h4 class="border-700 border-bottom-3">Setting-Monitoring</h4>
      <div class="field grid">
        <pre>Server Error! Status code is {{isStatusCodeMointor}} and message {{isErrorMsgMonitor}}</pre>
      </div>
    </div>
  </div>
  <!-- CONTENT HERE -->
</template>

<script setup lang="ts">
//import
import { MessageTypes } from '~~/src/models';
const { UI } = useAppHelper();

const route = useRoute();
const deployID = route.query?.DEID;
const modelPackageID = route.query?.MPID;
const { allMonitorsDrift, allMonitorsAcc, isFetchMonitor, isStatusCodeMointor, isErrorMsgMonitor, fetchGetMonitor } = useAllService().getDeploymentsIDMonitor(String(deployID));
const { modelpackagesGetID, isFetchMPID, isStatusCodeMPID, isErrorMsgMPID, fetchMPID } = useAllService().getModelPackagesID(String(modelPackageID))

const driftThresholdText = ref();
const importanceThresholdText = ref();
const lowImportanceAtRiskText = ref();
const lowImportanceFailingText = ref();
const highImportanceAtRiskText = ref();
const highImportanceFailingText = ref();

const accIncreaseAtRistText = ref();
const accIncreaseFalingText = ref();

const monitorRangeSelect = ref();
const monitorRangeDropdown = ref([
  { name: 'Last 2 hours', code: '2h' },
  { name: 'Last day', code: '1d' },
  { name: 'Lasy 7 days', code: '7d' },
  { name: 'Last 30 days', code: '30d' },
  { name: 'Last 90 days', code: '90d' },
  { name: 'Last 180 days', code: '180d' },
  { name: 'Last 365 days', code: '365d' },
]);

const dirftMetricSelect = ref();
const driftMetricDropdown = ref([
  { name: 'Population Stability Index (PSI)', code: 'PSI' },
]);

const regressionMetricSelect = ref();
const regressionMetricDropdown = ref([
  { name: 'rmse', code: 'rmse' },
  { name: 'rmsle', code: 'rmsle' },
  { name: 'mape', code: 'mape' },
  { name: 'mean_tweedie_deviance', code: 'mean_tweedie_deviance' },
  { name: 'gamma_deviance', code: 'gamma_deviance' },
]);

const binaryMetricSelect = ref();
const binaryMetricDropdown = ref([
  { name: 'tpr', code: 'tpr' },
  { name: 'accuracy', code: 'accuracy' },
  { name: 'f1', code: 'f1' },
  { name: 'ppv', code: 'ppv' },
  { name: 'fnr', code: 'fnr' },
  { name: 'fpr', code: 'fpr' },
]);

const measurementSelect = ref();
const measurementDropdown = ref([
  { name: 'percent', code: 'percent' },
  { name: 'value', code: 'value' },
]);

const resetDefaults = ref({});

// Mounte
onBeforeMount(()=>{
  fetchMPID();
});

onMounted(()=>{
  fetchGetMonitor();
});

const saveNewSetting = () => {
  const accetCall = () => {
    let objectPatchMonitor = ({ accuracySetting:{}, dataDriftSetting:{} });
      modelpackagesGetID?.value.targetType === "Regression" ? objectPatchMonitor.accuracySetting.metricType = regressionMetricSelect?.value : objectPatchMonitor.accuracySetting.metricType = binaryMetricSelect?.value
      objectPatchMonitor.accuracySetting.measurement                  = measurementSelect?.value;
      objectPatchMonitor.accuracySetting.atRiskValue                  = parseInt(accIncreaseAtRistText?.value);
      objectPatchMonitor.accuracySetting.failingValue                 = parseInt(accIncreaseFalingText?.value);

      objectPatchMonitor.dataDriftSetting.monitorRange                = monitorRangeSelect?.value;
      objectPatchMonitor.dataDriftSetting.driftMetricType             = dirftMetricSelect?.value;
      objectPatchMonitor.dataDriftSetting.driftThreshold              = parseFloat(driftThresholdText?.value);
      objectPatchMonitor.dataDriftSetting.importanceThreshold         = parseFloat(importanceThresholdText?.value);
      objectPatchMonitor.dataDriftSetting.lowImportanceAtRiskCount    = parseInt(lowImportanceAtRiskText?.value);
      objectPatchMonitor.dataDriftSetting.lowImportanceFailingCount   = parseInt(lowImportanceFailingText?.value);
      objectPatchMonitor.dataDriftSetting.highImportanceAtRiskCount   = parseInt(highImportanceAtRiskText?.value);
      objectPatchMonitor.dataDriftSetting.highImportanceFailingCount  = parseInt(highImportanceFailingText?.value);

      const { patchDeID, isFetchPatchDeIDMonitor, isStatusCodePatchDeIDMonitor, isErrorMsgPatchDeIDMonitor, fetchPatchDeIDMonitor } = useAllService().patchDeIDMonitor(String(deployID), objectPatchMonitor);
      fetchPatchDeIDMonitor();
  };

  UI.showConfirm(MessageTypes.INFO, 'Alert', '저장하시겠습니까?', ()=>{accetCall()}, ()=>{});
}

const resetToDefaults = () => {
  const accetCall = () => {
    monitorRangeSelect.value = resetDefaults.value.range;
    dirftMetricSelect.value = resetDefaults.value.driftMetric;
    driftThresholdText.value = resetDefaults.value.driftThreshould;
    importanceThresholdText.value = resetDefaults.value.importanceThreshold;
    lowImportanceAtRiskText.value = resetDefaults.value.lowImportanceAtRisk;
    lowImportanceFailingText.value = resetDefaults.value.lowImportanceFailing;
    highImportanceAtRiskText.value = resetDefaults.value.highImportanceAtRisk;
    highImportanceFailingText.value = resetDefaults.value.highImportanceFailing;

    accIncreaseAtRistText.value = resetDefaults.value.accIncreaseAtRist;
    accIncreaseFalingText.value = resetDefaults.value.accIncreaseFaling;
    measurementSelect.value = resetDefaults.value.measurement;

    modelpackagesGetID?.value.targetType === "Regression" ? regressionMetricSelect.value = resetDefaults.value.regressionMetric : binaryMetricSelect.value = resetDefaults.value.binaryMetric;
  };

  UI.showConfirm(MessageTypes.INFO, 'Alert', '초기화 하시겠습니까?', ()=>{accetCall()}, ()=>{})
}

// Watcher
watch(() => allMonitorsDrift.value, (newvalue, oldvalue) => {
  driftThresholdText.value = newvalue.driftThreshold;
  importanceThresholdText.value = newvalue.importanceThreshold;
  lowImportanceAtRiskText.value = newvalue.lowImportanceAtRiskCount;
  lowImportanceFailingText.value = newvalue.lowImportanceFailingCount;
  highImportanceAtRiskText.value = newvalue.highImportanceAtRiskCount;
  highImportanceFailingText.value = newvalue.highImportanceFailingCount;
  dirftMetricSelect.value = newvalue.driftMetricType;
  monitorRangeSelect.value = newvalue.monitorRange;

  resetDefaults.value.range                   = monitorRangeSelect.value;
  resetDefaults.value.driftMetric             = dirftMetricSelect.value;
  resetDefaults.value.driftThreshould         = driftThresholdText.value;
  resetDefaults.value.importanceThreshold     = importanceThresholdText.value;
  resetDefaults.value.lowImportanceAtRisk     = lowImportanceAtRiskText.value;
  resetDefaults.value.lowImportanceFailing    = lowImportanceFailingText.value;
  resetDefaults.value.highImportanceAtRisk    = highImportanceAtRiskText.value;
  resetDefaults.value.highImportanceFailing   = highImportanceFailingText.value;
});

watch(()=> allMonitorsAcc.value, (newvalue, oldvalue) => {
  accIncreaseAtRistText.value = newvalue.atRiskValue;
  accIncreaseFalingText.value = newvalue.failingValue;
  if(modelpackagesGetID?.value.targetType === "Regression"){
    regressionMetricSelect.value = newvalue.metricType;
    resetDefaults.value.regressionMetric  = regressionMetricSelect.value;
  }else{
    binaryMetricSelect.value = newvalue.metricType;
    resetDefaults.value.binaryMetric      = binaryMetricSelect.value;
  }
  measurementSelect.value = newvalue.measurement;

  resetDefaults.value.accIncreaseAtRist   = accIncreaseAtRistText.value;
  resetDefaults.value.accIncreaseFaling   = accIncreaseFalingText.value;
  resetDefaults.value.measurement         = measurementSelect.value;
});

</script>

<style>
</style>