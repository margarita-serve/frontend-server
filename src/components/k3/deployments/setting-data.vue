<template>
  <div class="flex justify-content-end mt-3 mb-3">
    <K3Button label="Save new Setting" class="mr-3 p-button-outlined" icon="pi pi-save" @click="saveNewSetting()" />
    <K3Button label="Reset to defaults" class="p-button-outlined" icon="pi pi-refresh" @click="resetOfDefault()" />
  </div>

  <div v-if="isStatusCodeMPID === 200" class="flex flex-row flex-wrap text-2xl">
    <div class="surface-overlay border-1 w-auto min-h-full p-5 py-0 mr-5">
      <h3 class="border-700 border-bottom-3">Model Package</h3>

      <template v-if="modelPackageTargetType != 'Regression'">
        <div class="field grid" v-for="(col, index) in modelPackageFor" :key="index">
          <label for="firstname3" class="col-fixed borde-700 border-right-3" style="width: 11em;">{{col.header}}</label>
          <div class="col">
            {{col.value}}
          </div>
        </div>
      </template>

      <template v-else>
        <div class="field grid" v-for="(col, index) in modelPackageForReg" :key="index">
          <label for="firstname3" class="col-fixed borde-700 border-right-3" style="width: 11em;">{{col.header}}</label>
          <div class="col">
            {{col.value}}
          </div>
        </div>
      </template>
    </div>

    <div class="flex flex-column">
      <div class="surface-overlay border-1 w-auto p-5 py-0 mb-5" v-if="saveProgressBar">
        <h3 class="border-700 border-bottom-3">Options</h3>

        <div class="field grid">
          <label for="firstname3" class="col-fixed borde-700 border-right-3" style="width: 11rem">Association ID</label>
          <div class="col">
            <K3InputText v-if="associationIDTextDisable" type="text"
              v-model="associationIDText" placeholder="Input Association ID"
              v-tooltip.right="{value:'Input Association ID', class: 'custom-errormsg'}" disabled />
            <K3InputText v-else type="text" v-model="associationIDText" placeholder="Input Association ID"
              v-tooltip.right="{value:'Input Association ID', class: 'custom-errormsg'}" />
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed borde-700 border-right-3" style="width: 14em">Enable feature drift
            tracking</label>
          <div class="col">
            <K3InputSwitch v-if="modelPackageTraining" v-model="featureDriftTrackingChk" />
            <K3InputSwitch v-else v-model="featureDriftTrackingChk" disabled />
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed borde-700 border-right-3" style="width: 14em">Accuracy analyze</label>
          <div class="col">
            <K3InputSwitch v-if="modelPackageHoldout" v-model="accurancyAnalyzeChk" />
            <K3InputSwitch v-else v-model="accurancyAnalyzeChk" disabled />
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed borde-700 border-right-3" style="width: 14em">associationIDInFeature</label>
          <div class="col">
            <K3InputSwitch v-if="associationIDTextDisable" v-model="associationIDInFeatureChk" disabled />
            <K3InputSwitch v-else v-model="associationIDInFeatureChk" />
          </div>
        </div>
      </div>

      <div class="surface-overlay border-1 w-auto p-5 py-0 mb-5" v-else>
        <h3 class="border-700 border-bottom-3">Options</h3>
        <div class="flex align-items-center justify-content-center mb-3">
          <K3LoadersSpinner />
        </div>
      </div>

      <div class="surface-overlay border-1 w-auto p-5 py-0" v-if="saveSpinnerActuals">
        <h3 class="border-700 border-bottom-3">Actuals</h3>

        <div class="field grid">
          <label for="firstname3" class="col-fixed w-6 border-right-3">TargetLabel</label>
          <div class="col">
            <K3InputText v-model="targetLabelText" class="w-full surface-overlay border-1" placeholder="Input Target Label" v-tooltip.right="{value:'Input Target Label', class: 'custom-errormsg'}" />
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed w-6 border-right-3">AssociationColumn</label>
          <div class="col">
            <K3InputText v-model="associationColumnText" class="w-full surface-overlay border-1" placeholder="Input AssociationColumn" v-tooltip.right="{value:'Input AssociationColumn', class: 'custom-errormsg'}" />
          </div>
        </div>

        <div class="field grid">
          <div class="col">
            <div class="flex align-items-center justify-content-center">
              <K3FileUpload name="demo[]" DragDrop="true" :customUpload="true" @uploader="onUpload">
                <template #empty>
                  <p class="text-center"><i class="pi pi-cloud-upload" /> Drag and drop files to here to upload.</p>
                </template>
              </K3FileUpload>
            </div>
          </div>
        </div>
      </div>

      <div class="surface-overlay border-1 w-auto p-5 py-0" v-else>
        <h3 class="border-700 border-bottom-3">Actuals</h3>
        <div class="flex align-items-center justify-content-center mb-3">
          <K3LoadersSpinner />
        </div>
      </div>
    </div>
  </div>

  <div v-else class="surface-overlay border-1 w-auto min-h-full p-2 py-0">
    <h4 class="border-700 border-bottom-3">Setting-Data</h4>
    <div class="field grid">
      <pre>Server Error! Status code is {{isStatusCodeMPID}} and message {{isErrorMsgMPID}}</pre>
    </div>
  </div>

</template>

<script setup lang="ts">
import { MessageTypes } from "~~/src/models";
// imports
const route = useRoute();
const deployID = route.query?.DEID;
const ModelPackageID = route.query?.MPID;

const { modelpackagesGetID, isFetchMPID, isStatusCodeMPID, isErrorMsgMPID, fetchMPID }           = useAllService().getModelPackagesID(String(ModelPackageID));
const { deploymentsGetID, isfetchDeIDGet, isStatusCodeDeIDGet, isErrorMsgDeIDGet, fetchDeIDGet } = useAllService().getDeploymentsID(String(deployID));

const { UI } = useAppHelper();
// variable
const associationIDText = ref();
const associationIDTextDisable = ref(false);
const featureDriftTrackingChk = ref(false);
const accurancyAnalyzeChk = ref(false);
const associationIDInFeatureChk = ref(false);
const saveProgressBar = ref(true);
const saveSpinnerActuals = ref(true);

const associationColumnText = ref();
const targetLabelText = ref();

const modelPackageName = ref();
const modelPackageTargetType = ref();
const modelPackagePredictionTarget = ref();
const modelPackagePositiveClassLabel = ref();
const modelPackageNegativeClassLabel = ref();
const modelPackageThreshould = ref();
const modelPackageTraining = ref();
const modelPackageHoldout = ref();
const modelDescription = ref();
const modelPackageFor = ref([
  {header: 'Package Name',            value: modelPackageName},
  {header: 'TargetType',              value: modelPackageTargetType},
  {header: 'PredictionTarget Name',   value: modelPackagePredictionTarget},
  {header: 'PositiveClassLabel',      value: modelPackagePositiveClassLabel},
  {header: 'NegativeClassLabel',      value: modelPackageNegativeClassLabel},
  {header: 'Threshould',              value: modelPackageThreshould},
  {header: 'Training Dataset',        value: modelPackageTraining},
  {header: 'Holdout Dataset',         value: modelPackageHoldout},
]);
const modelPackageForReg = ref([
  {header: 'Package Name',            value: modelPackageName},
  {header: 'TargetType',              value: modelPackageTargetType},
  {header: 'PredictionTarget Name',   value: modelPackagePredictionTarget},
  {header: 'Model Description',       value: modelDescription},
  // {header: 'Threshould',              value: modelPackageThreshould},
  {header: 'Training Dataset',        value: modelPackageTraining},
  {header: 'Holdout Dataset',         value: modelPackageHoldout},
]);
const resetOptionsAssoID = ref();
const resetOptionsDriftTracking = ref();
const resetOptionsAnalyze = ref();
const resetOptionsInFeature = ref();

// Methods
const saveNewSetting = () => {
  UI.showConfirm(MessageTypes.INFO, "Alert", '저장하시겠습니까?', ()=>{ acceptCall ()}, ()=>{});

  const acceptCall = () => {
    saveProgressBar.value = false;
    let object = {};
    // deploy 변경 시 AssoID가 없을 때
    if (associationIDText.value === '') {
      if (accurancyAnalyzeChk.value === true) {
        // "accuracyAnalyze": true 조건 "associationID": "ㅁㅁㅁ" 필수값, "associationIDInFeature": false 필수값
        object.accuracyAnalyze        = accurancyAnalyzeChk.value;
        object.associationID          = associationIDText.value;
        object.associationIDInFeature = associationIDInFeatureChk.value;
        object.featureDriftTracking   = featureDriftTrackingChk.value;
      } else {
        object.featureDriftTracking   = featureDriftTrackingChk.value;
        object.accuracyAnalyze        = accurancyAnalyzeChk.value;
        // "accuracyAnalyze": false 제외 "associationID": "ㅁㅁㅁ" 제외, "associationIDInFeature": false 제외
        // object.associationIDInFeature = associationIDInFeatureChk.value;
      }

    // deploy 변경 시 AssoID가 있을 때
    } else {
      object.accuracyAnalyze      = accurancyAnalyzeChk.value;
      object.featureDriftTracking = featureDriftTrackingChk.value;
    }

    const { isFetchDeIDPatch, isStatusCodePatchDeID, isErrorMsgPatchDeID, fetchPatchDeployments } = useAllService().patchDeploymentsID(String(deployID), object);
    fetchPatchDeployments();

    watch(()=> isFetchDeIDPatch?.value, (newvalue, oldvalue)=> { saveProgressBar.value = true; });
  }
};

const resetOfDefault = () => {
  associationIDText.value           = resetOptionsAssoID.value;
  featureDriftTrackingChk.value     = resetOptionsDriftTracking.value;
  accurancyAnalyzeChk.value         = resetOptionsAnalyze.value;
  associationIDInFeatureChk.value   = resetOptionsInFeature.value;
};

// {
//   "associationID": "",
//   "associationIDInFeature": false,
//   "importance": "Low",
//   "requestCPU": 0.5,
//   "requestMEM": 1,
//   "featureDriftTracking": false,
//   "accuracyAnalyze": false,
//   "description": "deploy best model",
//   "name": "This Is a Test Deploy2"
// }

// 생성
// "accuracyAnalyze": true 조건 "associationID": "ㅁㅁㅁ" 필수값, "associationIDInFeature": false 필수값
// "accuracyAnalyze": false 조건 "associationID": "ㅁㅁㅁ", "associationIDInFeature": false 제외

// 변경
// deploy 변경 시 AssoID가 없을 때 "accuracyAnalyze": true 조건 "associationID": "ㅁㅁㅁ" 필수값, "associationIDInFeature": false 필수값
// deploy 변경 시 AssoID가 없을 때 "accuracyAnalyze": false 제외 "associationID": "ㅁㅁㅁ" 제외, "associationIDInFeature": false 제외
// deploy 변경 시 AssoID가 있을 때 "accuracyAnalyze": true -> false, "accuracyAnalyze": false 필수, "associationID": "ㅁㅁㅁ" 제외, "associationIDInFeature": false 제외
// deploy 변경 시 AssoID가 있을 때 "accuracyAnalyze": false -> true, "accuracyAnalyze": true 필수, "associationIDInFeature": false 제외

// AssoId가 있으면 associationIDInFeature disabled로

// Watcher
watch(
  () => modelpackagesGetID?.value, (newvalue, oldvalue) => {
    modelPackageName.value                  = newvalue?.name;
    modelPackageTargetType.value            = newvalue?.targetType;
    modelPackagePredictionTarget.value      = newvalue?.predictionTargetName;
    modelPackagePositiveClassLabel.value    = newvalue?.positiveClassLabel;
    modelPackageNegativeClassLabel.value    = newvalue?.negativeClassLabel;
    modelPackageThreshould.value            = newvalue?.predictionThreshold;
    modelPackageTraining.value              = newvalue?.trainingDatasetName;
    modelPackageHoldout.value               = newvalue?.holdoutDatasetName;
    modelDescription.value                  = newvalue?.modelDescription;
  },
);

watch(
  () => deploymentsGetID?.value, (newvalue, oldvalue) => {
    associationIDText.value         = newvalue?.associationID;
    featureDriftTrackingChk.value   = newvalue?.featureDriftTracking;
    accurancyAnalyzeChk.value       = newvalue?.accuracyAnalyze;
    associationIDInFeatureChk.value = newvalue?.associationIDInFeature;

    resetOptionsAssoID.value        = newvalue?.associationID;
    resetOptionsDriftTracking.value = newvalue?.featureDriftTracking;
    resetOptionsAnalyze.value       = newvalue?.accuracyAnalyze;
    resetOptionsInFeature.value     = newvalue?.associationIDInFeature;

    associationIDText.value != "" ? associationIDTextDisable.value = true : associationIDTextDisable.value = false;
  },
);

// Mount
onMounted(() => {
  fetchMPID();
  fetchDeIDGet();
})

// Events
const onUpload = (event) => {
  let fileData = new FormData();
  fileData.append("file", event.files[0]);
  const { postDeIDMonitorActual, isFetchpostDeIDMonitorActual, isStatusCodepostDeIDMonitorActual, isErrorMsgpostDeIDMonitorActual, fetchPostDeIDMonitorActual } = useAllService().postDeIDMonitorActual(String(deployID), targetLabelText.value, associationColumnText.value, fileData);
  fetchPostDeIDMonitorActual();
  saveSpinnerActuals.value = false;

  watch(()=> isFetchpostDeIDMonitorActual.value, (newvalue, oldvalue) => { saveSpinnerActuals.value = true; });
}

// Logics (like api call, etc)

</script>

<style>
.custom-errormsg .p-tooltip-text {
    background-color: var(--cyan-600);
    color: rgb(255, 255, 255);
}
.custom-errormsg.p-tooltip-right .p-tooltip-arrow {
    border-right-color: var(--cyan-600);
}
</style>