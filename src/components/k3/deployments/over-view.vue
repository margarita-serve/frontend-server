<template>
<div>
  <div class="flex mb-3">
    <div class="flex flex-1">
      <span class="flex align-content-center justify-content-center text-3xl">Overview</span>
    </div>
    <div class="flex flex-1 align-content-center justify-content-end">
      <K3Button label="Save of Setting" class="mr-3 p-button-outlined" icon="pi pi-save" @click="saveOfSetting()" />
      <K3Button label="Default of Setting" class="p-button-outlined" icon="pi pi-refresh" @click="defaultOfSetting()" />
    </div>
  </div>

  <div class="flex flex-wrap align-items-center justify-content-center card-container text-left">
      <div v-if="isStatusCodeDeIDGet === 200" class="surface-overlay border-1 w-auto h-full p-2 py-0">
        <h5 class="border-700 border-bottom-3">Summary</h5>

        <div class="field grid">
          <label for="firstname3" class="col-fixed borde-700 border-right-3" style="width:7.5rem">Name</label>
          <div class="col">
            <!-- <span style="margin-left: 0.75rem;" > {{ summaryName }} </span> -->
            <K3Inplace :closable="true">
              <template #display>
                {{ summaryName }} <i class="pi pi-pencil bg-orange-400 border-round" style="font-size: 1.1rem" />
              </template>
              <template #content>
                <span>
                  <K3InputText type="text" v-model="summaryName" />
                </span>
              </template>
            </K3Inplace>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed border-700 border-right-3" style="width:7.5rem">Description</label>
          <div class="col">
            <!-- <span style="margin-left: 0.75rem;" > {{ summaryDescription }} </span> -->
            <K3Inplace :closable="true">
              <template #display>
                <span> {{ summaryDescription }} <i class="pi pi-pencil bg-orange-400 border-round"
                    style="font-size: 1.1rem" /> </span>
              </template>
              <template #content>
                <K3InputText type="text" v-model="summaryDescription" />
              </template>
            </K3Inplace>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed border-700 border-right-3" style="width:7.5rem">ActiveStatus</label>
          <div class="col">
            <span style="margin-left: 0.75rem;"> {{ summaryActiveStatus }} </span>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed border-700 border-right-3" style="width: 7.5rem">ServiceStatus</label>
          <div class="col">
            <span style="margin-left: 0.75rem;"> {{ summaryServiceStatus }} </span>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed border-700 border-right-3" style="width:7.5rem">Importance</label>
          <div class="col">
            <!-- <span style="margin-left: 0.75rem;" > {{ summaryImportance }} </span> -->
            <K3Inplace :closable="false" @click="openImportance()">
              <template #display>
                <span> {{ summaryImportance }} <i class="pi pi-pencil bg-orange-400 border-round" /> </span>
              </template>
              <template #content>
                <span style="margin-left: 0.75rem;"> {{ summaryImportance }} <i
                    class="pi pi-pencil bg-orange-400 border-round" /> </span>
              </template>
            </K3Inplace>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed border-700 border-right-3" style="width:7.5rem">URI</label>
          <div class="col">
            <span style="margin-left: 0.75rem;"> {{ summaryURI }} </span>
          </div>
        </div>
      </div>

      <div v-else class="surface-overlay border-1 w-auto min-h-full p-2 py-0">
        <h4 class="border-700 border-bottom-3">Summary</h4>
        <div class="field grid">
          <pre>Server Error! Status code is {{isStatusCodeDeIDGet}} and message {{isErrorMsgDeIDGet}}</pre>
        </div>
      </div>

    <!-- ------------------------------------------------------선------------------------------------------------------ -->

    <div v-if="isStatusCodeMPID === 200"
      class="surface-overlay border-1 w-auto min-h-full shadow-1 p-2 py-0 ml-3 mr-3">
      <h5 class="border-700 border-bottom-3">Content</h5>
      <div class="field grid" v-for="(col, index) in contentFor" :key="index">
        <label for="firstname3" class="col-fixed borde-700 border-right-3" style="width: 11rem">{{col.header}}</label>
        <div class="col">
          {{ col.value }}
        </div>
      </div>
    </div>

    <div v-else
      class="surface-overlay border-1 w-auto min-h-full p-2 py-0 ml-3 mr-3">
      <h4 class="border-700 border-bottom-3">Content</h4>
      <div class="field grid">
        <pre>Server Error! Status code is {{isStatusCodeMPID}} and message {{isErrorMsgMPID}}</pre>
      </div>
    </div>

    <!-- ------------------------------------------------------선------------------------------------------------------ -->

    <div v-if="isStatusCodeGetGover === 200" class="surface-overlay border-1 w-auto min-h-full shadow-1 p-2 py-0">
      <h5 class="border-700 border-bottom-3">Governance(Scroll)</h5>
      <K3ScrollPanel class="w-25rem h-13rem">
        <div v-for="(col, index) of goversGet" :key="index">
          <div class="field">
            <span> &lt;{{ col.EventType }}&gt; </span><br />
            <span> {{ col.LogMessage }} </span><br />
            <span> {{ col.EventDate }} </span><br />
            <span> {{ col.DeploymentID }} </span><br />
          </div><br />
        </div>
        <K3ScrollTop target="parent" :threshold="100" class="custom-scrolltop" icon="pi pi-arrow-up" />
      </K3ScrollPanel>
    </div>

    <div v-else class="surface-overlay border-1 w-auto min-h-full p-2 py-0">
      <h4 class="border-700 border-bottom-3">Governance</h4>
      <div class="field grid">
        <pre>Server Error! Status code is {{isStatusCodeGetGover}} and message {{isErrorMsgGetGover}}</pre>
      </div>
    </div>
    <!-- ------------------------------------------------------구분선------------------------------------------------------ -->

    <K3Dialog header="배포 중요도" v-model:visible="displayImportance" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }" :modal="true" class="text-2xl">

      <div class="" v-for="(col, index) of importanceRadioBtn" :key="index">
        <div class="mb-2">
          <K3RadioButton class="mr-2" id="importance" name="importance" :value=col.value v-model="summaryImportance" />
          <label for="importance"> {{ col.label }} </label><br />
        </div>
        <div class="mb-2" style="margin-left: 1.9rem;"> {{ col.text }} </div>
      </div>

      <template #footer>
        <K3Button label="적용" icon="pi pi-check" @click="closeModal" class="p-button-outlined" />
      </template>
    </K3Dialog>
  </div>
</div>

</template>

<script setup lang="ts">
import { MessageTypes } from "~~/src/models";

// import
const route = useRoute()
const deployID = route.query.DEID;
const ModelPackageID = route.query.MPID;
const { deploymentsGetID, isfetchDeIDGet, isStatusCodeDeIDGet, isErrorMsgDeIDGet, fetchDeIDGet } = useAllService().getDeploymentsID(String(deployID));
const { modelpackagesGetID, isFetchMPID, isStatusCodeMPID, isErrorMsgMPID, fetchMPID } = useAllService().getModelPackagesID(String(ModelPackageID));
const { goversGet, isFetchGetGover, isStatusCodeGetGover, isErrorMsgGetGover, fetchGetGover } = useAllService().getDeploymentsIDGovernance(String(deployID));
const { UI } = useAppHelper();

const displayImportance = ref(false);

const summaryName = ref();
const summaryDescription = ref();
const summaryActiveStatus = ref();
const summaryServiceStatus = ref();
const summaryImportance = ref();
const summaryURI = ref();

const contentName = ref();
const contentModelDescription = ref();
const contentTargetType = ref();
const contentModelFrameWork = ref();
const contentPredictionThreshold = ref();
const contentModelVersion = ref();

const importanceRadioBtn = ref([
  { label: 'Low',       value: 'Low',       text: "예측양이 적고, 규제 요구 사항에 대한 노출이 제한적이며, 조직에 미치는 재정적 영향이 낮습니다." },
  { label: 'Moderate',  value: 'Moderate',  text: "예측양이 중간이거나 적고, 규제 요구 사항에 대한 노출이 제한적이며, 조직에 미치는 재정적 영향이 중간이거나 낮습니다." },
  { label: 'High',      value: 'High',      text: "예측양이 많거나 중간이고, 상당한 규제 노출에 노출되거나, 조직에 미치는 재정적 영향이 큽니다." },
  { label: 'Critical',  value: 'Critical',  text: "조직 운영에 중요합니다." }
]);

// const saveBtnProgressSpinner = ref(false);
const defaultSave = ref({});

const contentFor = ref([
  { header: 'Name',                 value: contentName },
  { header: 'ModelDescription',     value: contentModelDescription },
  { header: 'TargetType',           value: contentTargetType },
  { header: 'ModelFrameWork',       value: contentModelFrameWork },
  { header: 'PredictionThreshold',  value: contentPredictionThreshold },
  { header: 'ModelVersion',         value: contentModelVersion },
]);

// Method
const saveOfSetting = () => {
  UI.showConfirm(MessageTypes.INFO, "Alert", '저장하시겠습니까?', ()=>{ acceptCall ()}, ()=>{});
  const acceptCall = () => {
    // saveBtnProgressSpinner.value = true;
    let object = {};
    object.name         = summaryName.value;
    object.description  = summaryDescription.value;
    object.importance   = summaryImportance.value;

    const { isFetchDeIDPatch, isStatusCodePatchDeID, isErrorMsgPatchDeID, fetchPatchDeployments } = useAllService().patchDeploymentsID(String(deployID), object);
    fetchPatchDeployments();

    // watch(()=> isStatusCodePatchDeID?.value, (newvalue, oldvalue)=> {
      // saveBtnProgressSpinner.value = false;
    // });
  }
}

const openImportance = () => { displayImportance.value = true; };
const closeModal = () => { displayImportance.value = false; };

const defaultOfSetting = () => {
  UI.showConfirm(MessageTypes.INFO, "Alert", 'Reset', ()=>{ acceptCall ()}, ()=>{});
  const acceptCall = () => {
    summaryName.value           = defaultSave.value.name;
    summaryDescription.value    = defaultSave.value.description;
    summaryImportance.value     = defaultSave.value.importance;
  }
}

// deploy 변경 시 AssoID가 없을 때
// "accuracyAnalyze": true 조건 "associationID": "ㅁㅁㅁ" 필수값, "associationIDInFeature": false 필수값
// "accuracyAnalyze": false 제외 "associationID": "ㅁㅁㅁ" 제외, "associationIDInFeature": false 제외
// deploy 변경 시 AssoID가 있을 때
// "accuracyAnalyze": false -> true, "accuracyAnalyze": true 필수, "associationIDInFeature": false 필수
// "accuracyAnalyze": true -> false, "accuracyAnalyze": false 필수, "associationID": "ㅁㅁㅁ" 제외, "associationIDInFeature": false 제외

// Mounted
onMounted(() => {
  fetchDeIDGet();
  fetchMPID();
  fetchGetGover();
});

watch(
  () => deploymentsGetID?.value, (newvalue, oldvalue) => {
    if (newvalue) {
      summaryName.value              = newvalue.name;
      summaryDescription.value       = newvalue.description;
      summaryActiveStatus.value      = newvalue.activeStatus;
      summaryServiceStatus.value     = newvalue.serviceStatus;
      summaryImportance.value        = newvalue.importance;
      summaryURI.value               = newvalue.URI;

      defaultSave.value.name         = newvalue.name;
      defaultSave.value.description  = newvalue.description;
      defaultSave.value.importance   = newvalue.importance;
    }
  }
)

watch(
  () => modelpackagesGetID?.value, (newvalue, oldvalue) => {
    if (newvalue) {
      contentName.value                   = newvalue.name;
      contentModelDescription.value       = newvalue.modelDescription;
      contentTargetType.value             = newvalue.targetType;
      contentModelFrameWork.value         = newvalue.modelFrameWork;
      contentPredictionThreshold.value    = newvalue.predictionThreshold;
      contentModelVersion.value           = newvalue.modelVersion;
    }
  }
)
</script>

<style scoped lang="scss">

</style>