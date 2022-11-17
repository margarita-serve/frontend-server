<template>
  <K3DataTable :value="webHooksAll" responsiveLayout="scroll" :autoLayout="true" :scrollable="true"
    v-model:selection="rowWebHooksSelect" selectionMode="single" dataKey="webHookID" :showApplyButton="false"
    @rowSelect="onWebHookRowSelect(rowWebHooksSelect.name, rowWebHooksSelect.method, rowWebHooksSelect.triggerSource, rowWebHooksSelect.customHeader, rowWebHooksSelect.url, rowWebHooksSelect.messageBody, rowWebHooksSelect.webHookID, rowWebHooksSelect.triggerStatus)"
    @rowUnselect="onWebHookRowUnselect()" :scrollHeight="UI.tableSettings.scrollHeight" removableSort :paginator="true"
    :rows="UI.tableSettings.rows" :paginatorTemplate="UI.tableSettings.paginatorTemplate"
    :rowsPerPageOptions="UI.tableSettings.rowPerPageOptions"
    :currentPageReportTemplate="UI.tableSettings.pageReportTemplate" :loading="isFetchWebHooksAll" stripedRows
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
      <h2>Web-Hooks Table
        <K3Button label="Add" icon="pi pi-plus" class="p-button-rounded p-button-outlined p-button-sm"
          @click="openAddWebHooksDialog()" />
      </h2>
      <div class="header flex justify-content-between">
        <div class="search-left">
          <span>
            <K3MultiSelect :modelValue="selectedWebHooksColumns" :options="webHooksColumns" optionLabel="header"
              @update:modelValue="webHooksToggle" placeholder="Select Columns" style="width: 20em" />
          </span>
        </div>

        <div class="search-right toggle flex align-content-center">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <K3InputText class="flex" v-model="(UI.tableSettings.filters.value)['global'].value" placeholder="Search"
              autofocus />
          </span>
        </div>
      </div>
    </template>

    <K3Column :rowReorder="true" :reorderableColumn="false" headerStyle="max-width: 3%" bodyStyle="max-width: 3%;" class="flex justify-content-center" />
    <K3Column v-for="(col, index) of selectedWebHooksColumns" :field="col.field" :header="col.header"
      :sortable="col.sortable" :key="col.field + '_' + index" :class="col.class"
      :headerStyle="columnSize(col.field)" :bodyStyle="columnSize(col.field)" >
      <template #body="slotProps">
        <span v-if="slotProps.field === 'Name'">{{ slotProps.data.name }}</span>
        <span v-else-if="slotProps.field === 'TriggerSource'"> {{ slotProps.data.triggerSource }} </span>
        <span v-else-if="slotProps.field === 'Method'"> {{ slotProps.data.method }} </span>
        <span v-else-if="slotProps.field === 'url'"> {{ slotProps.data.url }} </span>
        <span v-else-if="slotProps.field === 'messageBody'">
          <K3SplitButton label="상세정보" :model="webHooksitems(slotProps.data.name, slotProps.data.method, slotProps.data.triggerSource, slotProps.data.customHeader, slotProps.data.url, slotProps.data.messageBody, slotProps.data.webHookID, slotProps.data.triggerStatus).value"
            class="p-button-info p-button-raised"
            @click="onWebHookRowSelect(slotProps.data.name, slotProps.data.method, slotProps.data.triggerSource, slotProps.data.customHeader, slotProps.data.url, slotProps.data.messageBody, slotProps.data.webHookID, slotProps.data.triggerStatus)" />
        </span>
      </template>
    </K3Column>
  </K3DataTable>

  <K3Dialog header="Add Web-Hook" v-model:visible="addDialogWebHooks" :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '600px' }" :modal="true">
    <form @submit.prevent="addWebHook(!v$.$invalid)" class="p-fluid">
      <div class="flex flex-column m-3">
        <div class="field grid">
          <label for="firstname3" class="col-fixed w-7rem"> Name </label>
          <div class="col">
            <K3InputText id="firstname3" type="text" v-model="v$.nameWebHook.$model"
              class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" />
            <small id="firstname3" class="text-blue-500"> ex) pipe-line-trigger </small>
            <small v-if="(v$.nameWebHook.$invalid && webHooksSubmit) || v$.nameWebHook.$pending.$responce"
              id="firstname3" class="p-error"> Input 5 ~ 20 characters</small>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed w-7rem"> Method </label>
          <div class="col">
            <K3InputText id="firstname3" type="text" v-model="v$.methodWebHook.$model"
              class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" />
            <small id="firstname3" class="text-blue-500"> ex) POST </small>
            <small v-if="(v$.methodWebHook.$invalid && webHooksSubmit) || v$.methodWebHook.$pending.$responce"
              id="firstname3" class="p-error"> {{ v$.methodWebHook.required.$message.replace('Value', 'Method') }}
            </small>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed w-7rem"> TriggerSource </label>
          <div class="col">
            <K3InputText id="firstname3" type="text" v-model="v$.triggerWebHook.$model"
              class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" />
            <small id="firstname3" class="text-blue-500"> ex) DataDrift </small>
            <small v-if="(v$.triggerWebHook.$invalid && webHooksSubmit) || v$.triggerWebHook.$pending.$responce"
              id="firstname3" class="p-error"> {{ v$.triggerWebHook.required.$message.replace('Value', 'TriggerSource') }}
            </small>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed w-7rem"> TriggerStatus </label>
          <div class="col">
            <K3InputText id="firstname3" type="text" v-model="v$.triggerStatus.$model"
              class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" />
            <small id="firstname3" class="text-blue-500"> ex) AtRisk, Failing </small>
            <small v-if="(v$.triggerStatus.$invalid && webHooksSubmit) || v$.triggerStatus.$pending.$responce"
              id="firstname3" class="p-error"> {{ v$.triggerStatus.required.$message.replace('Value', 'TriggerSource') }}
            </small>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed w-7rem"> CustomHeader </label>
          <div class="col">
            <K3Textarea v-model="v$.customWebHook.$model" :autoResize="true" rows="1" cols="30" class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" />
            <!-- <K3InputText id="firstname3" type="text" v-model="v$.customWebHook.$model"
              class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" /> -->
            <small id="firstname3" class="text-blue-500"> ex) Content-Type: application/json </small>
            <small v-if="(v$.customWebHook.$invalid && webHooksSubmit) || v$.customWebHook.$pending.$responce"
              id="firstname3" class="p-error"> {{ v$.customWebHook.required.$message.replace('Value', 'CustomHeader') }}
            </small>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed w-7rem"> URL </label>
          <div class="col">
            <K3InputText id="firstname3" type="text" v-model="v$.urlWebHook.$model"
              class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" />
            <small id="firstname3" class="text-blue-500"> ex) http://-------... </small>
            <small v-if="(v$.urlWebHook.$invalid && webHooksSubmit) || v$.urlWebHook.$pending.$responce"
              id="firstname3" class="p-error"> {{ v$.urlWebHook.required.$message.replace('Value', 'URL') }} </small>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed w-7rem"> MessageBody </label>
          <div class="col">
            <K3Textarea v-model="v$.msgWebHook.$model" :autoResize="true" rows="1" cols="600" class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" />
            <!-- <K3InputText id="firstname3" type="text" v-model="v$.msgWebHook.$model"
              class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" /> -->
            <small id="firstname3" class="text-blue-500"> ex) {"text": "텍스트입니다."} </small>
            <small v-if="(v$.msgWebHook.$invalid && webHooksSubmit) || v$.msgWebHook.$pending.$responce"
              id="firstname3" class="p-error"> {{ v$.msgWebHook.required.$message.replace('Value', 'MessageBody') }}
            </small>
          </div>
        </div>

        <div class="flex justify-content-end flex-wrap card-container green-container">
          <K3Button label="Test" type="button" icon="pi pi-comment" @click="webHookTest(!v$.$invalid)" class="p-button-info mr-2 w-min"
          autofocus />
          <K3Button label="Close" type="button" icon="pi pi-times" @click="closeWebHooksDialog" class="p-button-outlined mr-2 w-min"
          autofocus />
          <K3Button label="Add" type="submit" icon="pi pi-check" class="w-min" autofocus />
        </div>
      </div>
    </form>
  </K3Dialog>

  <K3Dialog header="Web-Hook Detail" v-model:visible="detailDialogWebHook"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '600px' }" :modal="true">
    <form @submit.prevent="updateWebHook(!v$.$invalid)" class="p-fluid">
      <div class="flex flex-column m-3">
        <div class="field grid">
          <label for="firstname3" class="col-fixed w-7rem"> Name </label>
          <div class="col">
            <K3InputText id="firstname3" type="text" v-model="v$.nameWebHook.$model"
              class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" />
            <small id="firstname3" class="text-blue-500"> ex) pipe-line-trigger </small>
            <small v-if="(v$.nameWebHook.$invalid && webHooksSubmit) || v$.nameWebHook.$pending.$responce"
              id="firstname3" class="p-error"> Input 5 ~ 20 characters</small>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed w-7rem"> Method </label>
          <div class="col">
            <K3InputText id="firstname3" type="text" v-model="v$.methodWebHook.$model"
              class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" />
            <small id="firstname3" class="text-blue-500"> ex) POST </small>
            <small v-if="(v$.methodWebHook.$invalid && webHooksSubmit) || v$.methodWebHook.$pending.$responce"
              id="firstname3" class="p-error"> {{ v$.methodWebHook.required.$message.replace('Value', 'Method') }}
            </small>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed w-7rem"> TriggerSource </label>
          <div class="col">
            <K3InputText id="firstname3" type="text" v-model="v$.triggerWebHook.$model"
              class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" />
            <small id="firstname3" class="text-blue-500"> ex) Datadrift </small>
            <small v-if="(v$.triggerWebHook.$invalid && webHooksSubmit) || v$.triggerWebHook.$pending.$responce"
              id="firstname3" class="p-error"> {{ v$.triggerWebHook.required.$message.replace('Value', 'TriggerSource') }}
            </small>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed w-7rem"> TriggerStatus </label>
          <div class="col">
            <K3InputText id="firstname3" type="text" v-model="v$.triggerStatus.$model"
              class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" />
            <small id="firstname3" class="text-blue-500"> ex) ex) AtRisk, Failing </small>
            <small v-if="(v$.triggerStatus.$invalid && webHooksSubmit) || v$.triggerStatus.$pending.$responce"
              id="firstname3" class="p-error"> {{ v$.triggerStatus.required.$message.replace('Value', 'TriggerSource') }}
            </small>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed w-7rem"> CustomHeader </label>
          <div class="col">
            <K3Textarea v-model="v$.customWebHook.$model" :autoResize="true" rows="1" cols="30" class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" />
            <!-- <K3InputText id="firstname3" type="text" v-model="v$.customWebHook.$model"
              class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" /> -->
            <small id="firstname3" class="text-blue-500"> ex) Content-Type: application/json </small>
            <small v-if="(v$.customWebHook.$invalid && webHooksSubmit) || v$.customWebHook.$pending.$responce"
              id="firstname3" class="p-error"> {{ v$.customWebHook.required.$message.replace('Value', 'CustomHeader') }}
            </small>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed w-7rem"> URL </label>
          <div class="col">
            <K3InputText id="firstname3" type="text" v-model="v$.urlWebHook.$model"
              class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" />
            <small id="firstname3" class="text-blue-500"> ex) http://-------... </small>
            <small v-if="(v$.urlWebHook.$invalid && webHooksSubmit) || v$.urlWebHook.$pending.$responce"
              id="firstname3" class="p-error"> {{ v$.urlWebHook.required.$message.replace('Value', 'URL') }} </small>
          </div>
        </div>

        <div class="field grid">
          <label for="firstname3" class="col-fixed w-7rem"> MessageBody </label>
          <div class="col">
            <K3Textarea v-model="v$.msgWebHook.$model" :autoResize="true" rows="1" cols="600" class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" />
            <!-- <K3InputText id="firstname3" type="text" v-model="v$.msgWebHook.$model"
              class="text-indigo-500 surface-overlay p-2 border-2 border-cyan-600 border solid border-round appearance-none outline-none focus:border-primary w-12" /> -->
            <small id="firstname3" class="text-blue-500"> ex) {"text": "텍스트입니다."} </small>
            <small v-if="(v$.msgWebHook.$invalid && webHooksSubmit) || v$.msgWebHook.$pending.$responce"
              id="firstname3" class="p-error"> {{ v$.msgWebHook.required.$message.replace('Value', 'MessageBody') }}
            </small>
          </div>
        </div>
      </div>
      <div class="flex justify-content-end flex-wrap card-container green-container">
        <K3Button label="Test" icon="pi pi-comment" @click="webHookTest(!v$.$invalid)" class="p-button-info mr-2 w-min"
          autofocus />
        <K3Button label="Close" icon="pi pi-times" @click="closeDetailWebHookDialog" class="p-button-outlined mr-2 w-min"
          autofocus />
        <K3Button label="Update" icon="pi pi-check" type="submit" class="w-min" autofocus />
      </div>
    </form>
  </K3Dialog>
</template>

<script setup lang="ts">
// imports
import { FilterMatchMode } from 'primevue/api';
import { required, minLength, maxLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { MessageTypes } from '~~/src/models';
const route = useRoute();
const deployID = route.query?.DEID;

const { UI } = useAppHelper();
const { webHooksAll, isFetchWebHooksAll, isStatusCodeWebHooksAll, isErrorMsgWebHooksAll, fetchGetWebHooksAll } = useAllService().getDeIDWebHooksAll(deployID?.toString());

UI.tableSettings.initFilters({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.EQUALS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
});
const webHooksColumns = ref([
  { field: 'Name',          header: 'Name',           sortable: true, class: "flex justify-content-start" },
  { field: 'TriggerSource', header: 'TriggerSource',  sortable: true, class: "flex justify-content-start" },
  { field: 'Method',        header: 'Method',         sortable: true, class: "flex justify-content-start" },
  { field: 'url',           header: 'url',            sortable: true, class: "flex justify-content-start" },
  { field: 'messageBody',   header: 'Command', class: "flex justify-content-center"},
]);
const selectedWebHooksColumns = ref(webHooksColumns.value);

const webHooksitems = (name: string, method: string, trigger: string, custom: string, url: string, msg: string, webHookID: string, triggerStatus: string) => ref([
  // { label: 'Update', icon: 'pi pi-refresh', command: () => { openDetailWebHookDialog(name, method, trigger, custom, url, msg, webHookID, triggerStatus); } },
  { label: 'Delete', icon: 'pi pi-trash', command: () => { delWebHook(webHookID);} }
]);

const columnSize = (field) => {
  let size = 0;
  switch (field) {
    case "Name":
      size = 15;
      break;
    case "TriggerSource":
      size = 15;
      break;
    case "Method":
      size = 15;
      break;
    case "url":
      size = 35;
      break;
    case "ID":
      size = 10;
      break;
    case "messageBody":
      size = 10;
      break;
    case " ":
      size = 1;
      break;
  }
  return `min-width: ${size}%`;
};

const webHookstate = reactive({
  nameWebHook: 'pipe-line-test',
  methodWebHook: 'POST',
  triggerStatus: 'AtRisk',
  triggerWebHook: 'DataDrift',
  customWebHook: 'Content-Type: application/json',
  urlWebHook: 'http://example.com/to/webhook/client',
  msgWebHook: '{\"text\": \"채널에 있는 한 줄의 텍스트입니다.\"}',
});

const webHookRules = {
  nameWebHook: { required, minLength: minLength(5), maxLength: maxLength(20) },
  methodWebHook: { required },
  triggerStatus: { required },
  triggerWebHook: { required },
  customWebHook: { required },
  urlWebHook: { required },
  msgWebHook: { required }
};
const webHooksSubmit = ref(false);
const v$ = useVuelidate(webHookRules, webHookstate);

const addDialogWebHooks = ref(false);
const detailDialogWebHook = ref(false);
const rowWebHooksSelect = ref();
const webhookID = ref();

// Mount
onMounted(() => {
  fetchGetWebHooksAll();
});

// Methods
const openAddWebHooksDialog = () => { addDialogWebHooks.value = true; };
const closeWebHooksDialog = () => { addDialogWebHooks.value = false; };
const openDetailWebHookDialog = (name: string, method: string, trigger: string, custom: string, url: string, msg: string, webHookID: string, triggerStatus: string) => {
  v$.value.triggerWebHook.$model = trigger;
  v$.value.triggerStatus.$model = triggerStatus;
  v$.value.nameWebHook.$model = name;
  v$.value.urlWebHook.$model = url;
  v$.value.methodWebHook.$model = method;
  v$.value.customWebHook.$model = custom;
  v$.value.msgWebHook.$model = msg;
  webhookID.value = webHookID;
  detailDialogWebHook.value = true;
};
const closeDetailWebHookDialog = () => { detailDialogWebHook.value = false; };

const webHooksToggle = (value) => { selectedWebHooksColumns.value = webHooksColumns.value.filter((col) => value.includes(col)); };
const onWebHookRowSelect = (name: string, method: string, trigger: string, custom: string, url: string, msg: string, id: string, triggerStatus: string) => {
  webhookID.value = id;
  v$.value.triggerWebHook.$model = trigger;
  v$.value.triggerStatus.$model = triggerStatus;
  v$.value.nameWebHook.$model = name;
  v$.value.urlWebHook.$model = url;
  v$.value.methodWebHook.$model = method;
  v$.value.customWebHook.$model = custom;
  v$.value.msgWebHook.$model = msg;
  detailDialogWebHook.value = true;
};

const onWebHookRowUnselect = () => { };

const addWebHook = (isAddFormVaild: boolean) => {
  webHooksSubmit.value = true;
  if (!isAddFormVaild) {
    return;
  }

  let objectWebHook = ({});
  objectWebHook.triggerSource = v$.value.triggerWebHook.$model;
  objectWebHook.triggerStatus = v$.value.triggerStatus.$model;
  objectWebHook.name = v$.value.nameWebHook.$model;
  objectWebHook.url = v$.value.urlWebHook.$model;
  objectWebHook.method = v$.value.methodWebHook.$model;
  objectWebHook.customHeader = v$.value.customWebHook.$model;
  objectWebHook.messageBody = v$.value.msgWebHook.$model;
  const { addWebHookID, isFetchPostWebHook, isStatusCodePostWebHook, isErrorMsgPostWebHook, fetchPostWebHooksAll } = useAllService().postDeIDWebHook(deployID.toString(), objectWebHook);
  fetchPostWebHooksAll();
  isFetchWebHooksAll.value = true;

  v$.value.triggerWebHook.$model = '';
  v$.value.triggerStatus.$model = '';
  v$.value.nameWebHook.$model = '';
  v$.value.urlWebHook.$model = '';
  v$.value.methodWebHook.$model = '';
  v$.value.customWebHook.$model = '';
  v$.value.msgWebHook.$model = '';

  addDialogWebHooks.value = false;
  webHooksSubmit.value = false;

  watch(() => isStatusCodePostWebHook?.value, (newvalue, oldvalue) => {
    if (newvalue === 200) {
      // webHooksAll.value.unshift({ "webHookID": addWebHookID.value, "deploymentID": deployID.toString(), "triggerSource": objectWebHook.triggerSource, "name": objectWebHook.name, "url": objectWebHook.url, "method": objectWebHook.method, "customHeader": objectWebHook.customHeader, "messageBody": objectWebHook.messageBody })
      webHooksAll.value.unshift({ "webHookID": addWebHookID.value, "deploymentID": deployID.toString(), "triggerSource": objectWebHook.triggerSource, "triggerStatus": objectWebHook.triggerStatus, "name": objectWebHook.name, "url": objectWebHook.url, "method": objectWebHook.method, "customHeader": objectWebHook.customHeader, "messageBody": objectWebHook.messageBody });
    }isFetchWebHooksAll.value = false;
  });
}

const updateWebHook = (isAddFormVaild: boolean) => {
  webHooksSubmit.value = true;
  if(!isAddFormVaild){
    return;
  }
  let objectWebHook = ({});
  objectWebHook.triggerSource = v$.value.triggerWebHook.$model;
  objectWebHook.triggerStatus = v$.value.triggerStatus.$model;
  objectWebHook.name = v$.value.nameWebHook.$model;
  objectWebHook.url = v$.value.urlWebHook.$model;
  objectWebHook.method = v$.value.methodWebHook.$model;
  objectWebHook.customHeader = v$.value.customWebHook.$model;
  objectWebHook.messageBody = v$.value.msgWebHook.$model;
  const { isFetchPatchwebHook, isStatusCodePatchWebHook, isErrorMsgPatchWebHook, fetchPatchWebHook } = useAllService().patchDeIDWebHook(deployID.toString(), String(webhookID.value), objectWebHook);
  fetchPatchWebHook();
  isFetchWebHooksAll.value = true;

  watch(() => isStatusCodePatchWebHook?.value, (newvalue, oldvalue) => {
    if (newvalue === 200) {
      const index = webHooksAll.value.findIndex(item => item.webHookID === webhookID.value);
      webHooksAll.value.splice(index, 1);
      webHooksAll.value.splice(index, 0,
        {
          "webHookID": webhookID.value,
          "deploymentID": deployID.toString(),
          "triggerSource": objectWebHook.triggerSource,
          "triggerStatus": objectWebHook.triggerStatus,
          "name": objectWebHook.name,
          "url": objectWebHook.url,
          "method": objectWebHook.method,
          "customHeader": objectWebHook.customHeader,
          "messageBody": objectWebHook.messageBody
        }
      );
    }isFetchWebHooksAll.value = false;
  });

  detailDialogWebHook.value = false;
  webHooksSubmit.value = false;
}

const delWebHook = (webHookID: string) => {
  UI.showConfirm(MessageTypes.WARN, 'Alert', '삭제하시겠습니까?', ()=>{acceptCall(webHookID)}, ()=>{} );

  const acceptCall = (webHookID: string) => {
    const { isFetchDelWebHook, isStatusCodeDelWebHook, isErrorMsgDelWebHook, fetchDeleteWebHook } = useAllService().delDeIDWebhook(deployID.toString(), webHookID);
    fetchDeleteWebHook();
    isFetchWebHooksAll.value = true;

    watch(() => isStatusCodeDelWebHook?.value, (newvalue, oldvalue) => {
      if (newvalue === 200) {
        const index = webHooksAll.value.findIndex(item => item.webHookID === webHookID);
        webHooksAll.value.splice(index, 1);
      }isFetchWebHooksAll.value = false;
    });
  }
}

const webHookTest = (isAddFormVaild: boolean) => {
  webHooksSubmit.value = true;
  if (!isAddFormVaild) {
    return;
  }

  let objectWebHook = ({});
  objectWebHook.triggerSource = v$.value.triggerWebHook.$model;
  objectWebHook.triggerStatus = v$.value.triggerStatus.$model;
  objectWebHook.name = v$.value.nameWebHook.$model;
  objectWebHook.url = v$.value.urlWebHook.$model;
  objectWebHook.method = v$.value.methodWebHook.$model;
  objectWebHook.customHeader = v$.value.customWebHook.$model;
  objectWebHook.messageBody = v$.value.msgWebHook.$model;

  const { addWebHookIDTest, isFetchPostWebHookTest, isStatusCodePostWebHookTest, isErrorMsgPostWebHookTest, fetchPostWebHooksAllTest } = useAllService().postDeIDWebHookTest(deployID.toString(), objectWebHook);
  fetchPostWebHooksAllTest();

  webHooksSubmit.value = false;
}

const onRowReorder = (event) => { webHooksAll.value = event.value; };
</script>

<style scoped lang="scss">
</style>