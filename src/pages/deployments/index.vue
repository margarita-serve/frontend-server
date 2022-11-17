<template>
  <div class="page-container">
    <div class="page-wrapper">
      <!-- <section class="page-header">
        <K3PageTitle />
      </section> -->
      <section class="page-content">
        <!-- Content here -->
        <K3DataTable :value="deploymentsGetAll" responsiveLayout="scroll" :autoLayout="true" :scrollable="true"
          v-model:selection="onDeployDetail" selectionMode="single" dataKey="deploymentID"
          @rowSelect="delpoymentsPage(onDeployDetail.name, onDeployDetail.deploymentID, onDeployDetail.modelPackageID)"
          @rowUnselect="onRowUnselect" :scrollHeight="UI.tableSettings.scrollHeight" removableSort :paginator="true"
          :rows="UI.tableSettings.rows" :paginatorTemplate="UI.tableSettings.paginatorTemplate"
          :rowsPerPageOptions="UI.tableSettings.rowPerPageOptions"
          :currentPageReportTemplate="UI.tableSettings.pageReportTemplate" :loading="isFetchDeGetAll" stripedRows
          v-model:filters="UI.tableSettings.filters.value" :resizableColumns="true" columnResizeMode="fit"
          :reorderableColumns="true" @rowReorder="onRowReorder">

          <template #loading>
            <K3ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
              animationDuration=".5s" />
          </template>

          <template #empty>
            <div class="w-full text-center">
              <p class="text-orange-500">No records found.</p>
            </div>
          </template>

          <template #header>
            <h2>DeploymentsTable
              <!-- <K3Button label="More" icon="pi pi-plus" class="p-button-rounded p-button-outlined p-button-sm"
                @click="openPackageDialog()" /> -->
            </h2>
            <div class="header flex justify-content-between">
              <div class="search-left">
                <span>
                  <K3MultiSelect :modelValue="selectedColumns" :options="columns" optionLabel="header"
                    @update:modelValue="onToggle" placeholder="Select Columns" style="width: 20em" />
                </span>
              </div>

              <div class="search-right toggle flex align-content-center">
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <K3InputText class="flex" v-model="(UI.tableSettings.filters.value)['global'].value"
                    placeholder="Search" autofocus />
                </span>
              </div>
            </div>
          </template>

          <K3Column :rowReorder="true" :reorderableColumn="false" headerStyle="max-width: 3%" bodyStyle="max-width: 3%;" class="flex justify-content-center" />
          <K3Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header"
            :sortable="col.sortable" :key="index" :headerStyle="columnSize(col.field)"
            :bodyStyle="columnSize(col.field)" :class="col.class">
            <template #body="slotProps">
              <span v-if="slotProps.field === 'name' && slotProps.data.activeStatus === 'Active'">{{ slotProps?.data.name }} </span>
              <span v-else-if="slotProps.field === 'name' && slotProps.data.activeStatus != 'Active'">{{ slotProps?.data.name }} <i class="pi pi-stop-circle bg-white-500 text-2xl text-red-700 border-round-2xl" /> </span>
              <span v-else-if="slotProps.field === 'modelPackageName'"> {{ slotProps?.data.modelPackageName }} </span>
              <span v-else-if="slotProps.field === 'modelFrameWork'"> {{ slotProps?.data.modelFrameWork }} </span>
              <span v-else-if="slotProps.field === 'importance'"> {{ slotProps?.data.importance }} </span>
              <span v-else-if="slotProps.field === 'projectName'"> {{ slotProps?.data.projectName }} </span>
              <span v-else-if="slotProps.field === 'ID'">
                <K3SplitButton label="상세정보" v-if="slotProps.data.activeStatus === 'Active'" @click="delpoymentsPage(slotProps.data.name, slotProps.data.deploymentID, slotProps.data.modelPackageID)"
                :model="trueitems(slotProps.data.deploymentID).value" class="p-button-info p-button-raised" />
                <K3SplitButton label="상세정보" v-if="slotProps.data.activeStatus != 'Active'" @click="delpoymentsPage(slotProps.data.name, slotProps.data.deploymentID, slotProps.data.modelPackageID)"
                :model="falseitems(slotProps.data.deploymentID).value" class="p-button-info p-button-raised" />
              </span>
            </template>
          </K3Column>
        </K3DataTable>
        <!-- Content here -->

        <!-- <K3Dialog header="배포 패키지 선택" v-model:visible="packageDialog" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
          :style="{ width: '50vw' }">
          <K3DataTable :value="modelpackagesGetAll" :autoLayout="true" :scrollable="true"
            v-model:selection="onModelDetail" selectionMode="single"
            @rowSelect="onModelSelect(onModelDetail.modelPackageID)" @rowUnselect="onRowUnselect"
            responsiveLayout="scroll" :scrollHeight="UI.tableSettings.scrollHeight" removableSort :paginator="true"
            :rows="UI.tableSettings.rows" :paginatorTemplate="UI.tableSettings.paginatorTemplate"
            :rowsPerPageOptions="UI.tableSettings.rowPerPageOptions"
            :currentPageReportTemplate="UI.tableSettings.pageReportTemplate" :loading="isFetchModGetAll" stripedRows
            v-model:filters="UI.tableSettings.filters.value" :resizableColumns="true" columnResizeMode="fit">

            <template #loading>
              <K3ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
                animationDuration=".5s" />
            </template>

            <template #empty>
              <div class="w-full text-center">
                <p class="text-orange-500">No records found.</p>
              </div>
            </template>

            <template #header>
              <div class="header flex justify-content-between">
                <div class="search-left">
                  <span>
                    <K3MultiSelect :modelValue="selectedPackageColumns" :options="packageColumns" optionLabel="header"
                      @update:modelValue="onToggles" placeholder="Select Columns" style="width: 20em" />
                  </span>
                </div>

                <div class="search-right toggle flex align-content-center">
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <K3InputText class="flex" v-model="(UI.tableSettings.filters.value).global.value"
                      placeholder="Search" autofocus />
                  </span>
                </div>
              </div>
            </template>

            <K3Column v-for="(col, index) of selectedPackageColumns" :field="col.field" :header="col.header"
              :sortable="col.sortable" :key="col.field + '_' + index">
              <template #body="slotProps">
                <span v-if="slotProps.field === 'name'">{{ slotProps.data.name }}</span>
                <span v-else-if="slotProps.field === 'modelName'">{{ slotProps.data.modelName }}</span>
                <span v-else-if="slotProps.field === 'description'"> {{ slotProps.data.description }} </span>
              </template>
            </K3Column>

          </K3DataTable>

          <div class="m-3 align-items-align-items-start justify-content-left">
            <div class="field">
              <label for="firstname1" class="col-fixed">선택된 모델 패키지 세부 사항</label>
            </div>

            <div class="field">
              <label for="lastname1" class="col-fixed ">Created by</label>
              <div class="col text-primary-600">
                {{ modelCreatedBy }}
              </div>
            </div>

            <div class="field">
              <label for="lastname1" class="col-fixed ">target</label>
              <div class="col text-primary-600">
                {{ modelTarget }}
              </div>
            </div>

            <div class="field">
              <label for="lastname1" class="col-fixed ">Training Dataset</label>
              <div class="col text-primary-600">
                {{ modelTraining }}
              </div>
            </div>
          </div>

          <template #footer>
            <K3Button label="Cancel" icon="pi pi-times" @click="closePackageDialog()" class="p-button-text" />
            <K3Button label="Create" icon="pi pi-check" @click="deploymentCreatePage(onModelDetail?.modelPackageID)"
              autofocus />
          </template>
        </K3Dialog> -->

        <K3Dialog header="Alert" v-model:visible="alertDialog" :breakpoints="{'960px': '75vw', '640px': '90vw'}"
          :style="{width: '350px'}" :modal="true">
          <div class="confirmation-content flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-circle mr-3" style="font-size: 2rem" />
            <span>모델을 선택해 주세요</span>
          </div>
          <template #footer>
            <K3Button label="닫기" icon="pi pi-check" @click="closeAlertDialog" class="p-button-outlined" autofocus />
          </template>
        </K3Dialog>

        <K3Dialog header="모델 교체" v-model:visible="replaceDialog" :breakpoints="{'960px': '75vw', '640px': '90vw'}"
          :style="{width: 'auto'}" :modal="true">
          <div class="flex flex-column justify-content-start">
            <div>
              <div class="flex text-xl mb-3">
                <label for="modelDropdown" class="col-fixed w-7rem border-right-2 mr-3">모델 선택</label>
                <K3Dropdown id="modelDropdown" class="w-15rem overflow-hidden text-overflow-ellipsis"
                  v-model="replaceModelSelect" :options="replaceModelDropdown" optionLabel="name" optionValue="value"
                  placeholder="Select a Model" :filter="true" />
              </div>
              <div class="flex text-xl mb-3">
                <label for="reasonDropdown" class="col-fixed w-7rem border-right-2 mr-3">Reason</label>
                <K3Dropdown id="reasonDropdown" class="w-15rem overflow-hidden text-overflow-ellipsis"
                  v-model="replaceReasonSelect" :options="replaceReasonDropdown" optionLabel="name" optionValue="value"
                  placeholder="Select a Reason" />
              </div>
            </div>
          </div>
          <template #footer>
            <K3Button label="닫기" icon="pi pi-times" @click="closeReplaceDialog" class="p-button-outlined" autofocus />
            <K3Button label="교체" icon="pi pi-check" @click="replaceModel(replaceModelSelect, replaceReasonSelect)" autofocus />
          </template>
        </K3Dialog>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { FilterMatchMode } from 'primevue/api';
import { MessageTypes } from '~~/src/models';

// Page meta
definePageMeta({ layout: 'default', title: 'Deployments', public: true });

const { UI } = useAppHelper();
const { deploymentsGetAll, isFetchDeGetAll, isStatusCodeDeGetAll, isErrorMsgDeGetAll, fetchDeGetAll } = useAllService().getDeploymentsTable();
const { modelpackagesGetAll, isStatusCodeModGetAll, isErrorMsgModGetAll, isFetchModGetAll, fetchModGetAll } = useAllService().getModelPackagesTable();

const router = useRouter();
// const packageDialog = ref(false);
const alertDialog = ref(false);
const replaceDialog = ref(false);

// const modelCreatedBy = ref();
// const modelTarget = ref();
// const modelTraining = ref();

/**
 * DataTable select use primeVue
 * @link https://www.primefaces.org/primevue/datatable/selection
 */
const onDeployDetail = ref();
/**
 * DataTable select use primeVue
 * @link https://www.primefaces.org/primevue/datatable/selection
 */
// const onModelDetail = ref();

UI.tableSettings.initFilters({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.EQUALS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
});


const columns = ref([
  { field: 'name',              header: 'name',             sortable: true, class: "flex justify-content-start" },
  { field: 'modelPackageName',  header: 'modelPackageName', sortable: true, class: "flex justify-content-start" },
  { field: 'modelFrameWork',    header: 'modelFrameWork',   sortable: true, class: "flex justify-content-start" },
  { field: 'importance',        header: 'importance',       sortable: true, class: "flex justify-content-start" },
  { field: 'projectName',       header: 'projectName',      sortable: true, class: "flex justify-content-start" },
  { field: 'ID',                header: 'Command', class: "flex justify-content-center" },
]);
const selectedColumns = ref(columns.value);

const packageColumns = ref([
  { field: 'name',        header: 'Name',         sortable: true },
  { field: 'modelName',   header: 'ModelName',    sortable: true },
  { field: 'description', header: 'Description',  sortable: true }
]);
const selectedPackageColumns = ref(packageColumns.value);

const replaceModelSelect      = ref();
const replaceReasonSelect     = ref("Accuracy");
const replaceModelDropdown    = ref([]);
const replaceReasonDropdown   = ref([
  { name: "Accuracy",         value: "Accuracy" },
  { name: "DataDrift",        value: "DataDrift" },
  { name: "Errors",           value: "Errors" },
  { name: "ScheduledRefresh", value: "ScheduledRefresh" },
  { name: "PredictionSpeed",  value: "PredictionSpeed" },
  { name: "Other",            value: "Other" },
]);
const globalDeploymentID      = ref();


const columnSize = (field) => {
  let size = 0
  switch (field) {
    case 'name':
      size = 20   //5
      break;
    case 'modelPackageName':
      size = 20 // 60
      break;
    case 'modelFrameWork':
      size = 1   //5
      break;
    case 'importance':
      size = 1   //5
      break;
    case 'projectName':
      size = 10  //5
      break;
    case 'ID':
      size = 1   //5
      break;
  };
  return `min-width: ${size}%`
};

const trueitems = (deploymentID: string) => ref([
  { label: '모델 교체',     icon: 'pi pi-refresh',       command: () => { openReplaceDialog(deploymentID); } },
  { label: '배포 비활성화', icon: 'pi pi-stop-circle',    command: () => { deployInActive(deploymentID); } },
  { label: '배포 삭제',     icon: 'pi pi-trash',         command: () => { deleteDeloy(deploymentID); } }
]);

const falseitems = (deploymentID: string) => ref([
  { label: '모델 교체',   icon: 'pi pi-refresh',  command: () => { openReplaceDialog(deploymentID); } },
  { label: '배포 활성화', icon: 'pi pi-check',    command: () => { deployActive(deploymentID); } },
  { label: '배포 삭제',   icon: 'pi pi-trash',    command: () => { deleteDeloy(deploymentID); } }
])

// Methods
// const openPackageDialog = () => { packageDialog.value = true; };
// const closePackageDialog = () => { packageDialog.value = false; };
const closeAlertDialog = () => { alertDialog.value = false; };
const closeReplaceDialog = () => { replaceDialog.value = false; };

const onToggle = (value) => { selectedColumns.value = columns.value.filter((col) => value.includes(col)); };
// const onToggles = (value) => { selectedPackageColumns.value = packageColumns.value.filter((col) => value.includes(col)); };

const onRowReorder = (event) => { deploymentsGetAll.value = event.value; };

/**
 * Move page
 * @param deploymentName Specific deployment model name
 * @param deploymentID Specific deployment model ID
 * @param ModelPackageID Specific model-package name
 */
const delpoymentsPage = (deploymentName: string, deploymentID: string, ModelPackageID: string) => { router.push({ path: '/deployments/' + deploymentName + '/over-view', query: { DEID: deploymentID, MPID: ModelPackageID } }) };

/**
 * Move deployment create page
 * @param ModelPackageID Specific model-package ID
 * @TODO 추가예정
 */
// const deploymentCreatePage = (ModelPackageID: string) => {
//   if(ModelPackageID === null || ModelPackageID === undefined || ModelPackageID === ""){
//     alertDialog.value = true;
//     return;
//   }
//   else{
//     router.push({ path: '/deployments/create', query: { MPID: ModelPackageID } });
//   }
// };

/**
 * DataTable selected is operate, Details of a specific model package
 * @param modelPackageID Specific model-package ID
 */
// const onModelSelect = (modelPackageID: string) => {
//   const { modelpackagesGetID, isFetchMPID, fetchMPID } = useAllService().getModelPackagesID(modelPackageID);
//   fetchMPID();
//   watch(
//     () => modelpackagesGetID.value, (newvalue, oldvalue) => {
//       modelCreatedBy.value = newvalue.modelFileName;
//       modelTarget.value    = newvalue.targetType;
//       modelTraining.value  = newvalue.trainingDatasetName;
//     },
//   );
// };

/**
 * DataTable unselected is operate
 */
const onRowUnselect = () => {
  alert("unselect");
}

/**
 * Specific deployment model is delete
 * @param deploymentID Specific deployment model ID
 */
const deleteDeloy = (deploymentID: string) => {

  UI.showConfirm(MessageTypes.WARN, 'Alert', '삭제하시겠습니까?', ()=>{acceptCall(deploymentID)}, ()=>{} );

  const acceptCall = (deploymentID: string) => {
    const { isFetchDeIDDel, isStatusCodeDelDeID, isErrorMsgDelDeID, fetchDeleteDeployments } = useAllService().delDeploymentsID(deploymentID);
    fetchDeleteDeployments();
    isFetchDeGetAll.value = true;
    watch(() => isStatusCodeDelDeID?.value, (newvalue, oldvalue) => {
      if (newvalue === 200) {
        const index = deploymentsGetAll.value.findIndex(item => item.deploymentID === deploymentID);
        deploymentsGetAll.value.splice(index, 1);
      }isFetchDeGetAll.value = false;
    });
  }
};

const deployInActive = (deploymentID: string) => {

  UI.showConfirm(MessageTypes.WARN, 'Alert', '비활성화 하시겠습니까?', ()=>{ acceptCall(deploymentID) }, ()=>{} );

  const acceptCall = (deploymentID: string) => {
    const { isFetchPutDeIDInActive, isStatusCodePutDeIDInActive, isErrorMsgPutDeIDInActive, fetchPutDeploymentsIDInActive } = useAllService().putDeploymentsIDInActive(deploymentID);
    fetchPutDeploymentsIDInActive();
    isFetchDeGetAll.value = true;
      watch(() => isStatusCodePutDeIDInActive?.value, (newvalue, oldvalue) => {
        if (newvalue === 200) {
          const index = deploymentsGetAll.value.findIndex(item => item.deploymentID === deploymentID);
          const tempDeploymentItem = ref(deploymentsGetAll.value[index]);

          deploymentsGetAll.value.splice(index, 1);
          deploymentsGetAll.value.splice(index, 0,
            {
              accuracyStatus:       tempDeploymentItem.value.accuracyStatus,
              activeStatus:         "InActive",
              deploymentID:         tempDeploymentItem.value.deploymentID,
              description:          tempDeploymentItem.value.description,
              driftStatus:          tempDeploymentItem.value.driftStatus,
              importance:           tempDeploymentItem.value.importance,
              modelFrameWork:       tempDeploymentItem.value.modelFrameWork,
              modelPackageID:       tempDeploymentItem.value.modelPackageID,
              modelPackageName:     tempDeploymentItem.value.modelPackageName,
              name:                 tempDeploymentItem.value.name,
              predictionEnvID:      tempDeploymentItem.value.predictionEnvID,
              predictionEnvName:    tempDeploymentItem.value.predictionEnvName,
              projectID:            tempDeploymentItem.value.projectID,
              projectName:          tempDeploymentItem.value.projectName,
              serviceHealthStatus:  tempDeploymentItem.value.serviceHealthStatus,
              serviceStatus:        tempDeploymentItem.value.serviceStatus,
            });
        }isFetchDeGetAll.value = false;
      });
  }
}

const deployActive = (deploymentID: string) => {

  UI.showConfirm(MessageTypes.INFO, 'Alert', '활성화 하시겠습니까?', () => { acceptCall(deploymentID) }, () => { });

  const acceptCall = (deploymentID: string) => {
    const { isFetchPutDeIDActive, isStatusCodePutDeIDActive, isErrorMsgPutDeIDActive, fetchPutDeploymentsIDActive } = useAllService().putDeploymentsIDActive(deploymentID);
      fetchPutDeploymentsIDActive();
      isFetchDeGetAll.value = true;
      const tempDeploymentItem = ref();
      watch(() => isStatusCodePutDeIDActive?.value, (newvalue, oldvalue) => {
        if (newvalue === 200) {
          const index = deploymentsGetAll.value.findIndex(item => item.deploymentID === deploymentID);
          tempDeploymentItem.value = deploymentsGetAll.value[index];

          deploymentsGetAll.value.splice(index, 1);
          deploymentsGetAll.value.splice(index, 0,
            {
              accuracyStatus:       tempDeploymentItem.value.accuracyStatus,
              activeStatus:         "Active",
              deploymentID:         tempDeploymentItem.value.deploymentID,
              description:          tempDeploymentItem.value.description,
              driftStatus:          tempDeploymentItem.value.driftStatus,
              importance:           tempDeploymentItem.value.importance,
              modelFrameWork:       tempDeploymentItem.value.modelFrameWork,
              modelPackageID:       tempDeploymentItem.value.modelPackageID,
              modelPackageName:     tempDeploymentItem.value.modelPackageName,
              name:                 tempDeploymentItem.value.name,
              predictionEnvID:      tempDeploymentItem.value.predictionEnvID,
              predictionEnvName:    tempDeploymentItem.value.predictionEnvName,
              projectID:            tempDeploymentItem.value.projectID,
              projectName:          tempDeploymentItem.value.projectName,
              serviceHealthStatus:  tempDeploymentItem.value.serviceHealthStatus,
              serviceStatus:        tempDeploymentItem.value.serviceStatus,
            });
        }isFetchDeGetAll.value = false;
      });
  }
}

const openReplaceDialog = (deploymentID: string) => {
  replaceDialog.value = true;
  globalDeploymentID.value = deploymentID;
  deploymentsGetAll.value.find(item => { if (item.deploymentID === deploymentID){ replaceModelSelect.value = item.modelPackageID; } });
}

const replaceModel = (modelPackageID: string, reason: string) => {
  let objectReplace = ({});
  objectReplace.modelPackageID = modelPackageID;
  objectReplace.reason         = reason;
  const { isFetchPatchDeIDReplace, isStatusCodePatchDeIDReplace, isErrorMsgPatchDeIDReplace, fetchPatchDeploymentsReplace } = useAllService().patchDeploymentsIDReplaceModel(globalDeploymentID.value, objectReplace);
  fetchPatchDeploymentsReplace();
  isFetchDeGetAll.value = true;
  replaceDialog.value = false;
  watch(
    () => isStatusCodePatchDeIDReplace?.value, (newvalue, oldvalue) => {
      if (newvalue === 200) {
        const { modelpackagesGetID, isFetchMPID, isStatusCodeMPID, isErrorMsgMPID, fetchMPID } = useAllService().getModelPackagesID(modelPackageID);
        fetchMPID();

        watch(
          () => isStatusCodeMPID?.value, (newvalue, oldvalue) => {
            if (newvalue === 200) {
              const index = deploymentsGetAll.value.findIndex(item => item.deploymentID === globalDeploymentID.value);
              const tempDeploymentItem = ref(deploymentsGetAll.value[index]);
              deploymentsGetAll.value.splice(index, 1);
              deploymentsGetAll.value.splice(index, 0,
                {
                  accuracyStatus:       tempDeploymentItem.value.accuracyStatus,
                  activeStatus:         tempDeploymentItem.value.activeStatus,
                  deploymentID:         tempDeploymentItem.value.deploymentID,
                  description:          tempDeploymentItem.value.description,
                  driftStatus:          tempDeploymentItem.value.driftStatus,
                  importance:           tempDeploymentItem.value.importance,
                  modelFrameWork:       modelpackagesGetID.value.modelFrameWork,
                  modelPackageID:       modelpackagesGetID.value.modelPackageID,
                  modelPackageName:     modelpackagesGetID.value.name,
                  name:                 tempDeploymentItem.value.name,
                  predictionEnvID:      tempDeploymentItem.value.predictionEnvID,
                  predictionEnvName:    tempDeploymentItem.value.predictionEnvName,
                  projectID:            tempDeploymentItem.value.projectID,
                  projectName:          tempDeploymentItem.value.projectName,
                  serviceHealthStatus:  tempDeploymentItem.value.serviceHealthStatus,
                  serviceStatus:        tempDeploymentItem.value.serviceStatus,
                });
              replaceDialog.value = false;
            }
          }
        )
      }
      isFetchDeGetAll.value = false;
    }
  )
}

// Watch
watch( () => isStatusCodeModGetAll?.value, (newvalue, oldvalue) => {
  if (newvalue === 200) {
    modelpackagesGetAll.value.forEach((item, index) => {
      replaceModelDropdown.value.push({ name: item.name, value: item.modelPackageID });
    })
  }
});

onMounted(() => { fetchDeGetAll(); fetchModGetAll(); });

window.onerror = function (e) {
  if (e.toString().includes("NotFoundError:")) {
    document.location.reload()
    return true;
  }
}
</script>

<style scoped lang="scss">
</style>