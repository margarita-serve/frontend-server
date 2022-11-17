<template>
  <div class="page-container">
    <div class="page-wrapper">
      <section class="page-header">
        <K3PageTitle />
      </section>
      <section class="page-content">
        <!-- Content here -->
        <K3DataTable :value="modelpackagesGetAll" responsiveLayout="scroll" :autoLayout="true" :scrollable="true"
          v-model:selection="onModelDetail" selectionMode="single"
          @rowSelect="modelPackagesDetailPage(onModelDetail.name)" @rowUnselect="onRowUnselect"
          :scrollHeight="UI.tableSettings.scrollHeight" removableSort :paginator="true" :rows="UI.tableSettings.rows"
          :paginatorTemplate="UI.tableSettings.paginatorTemplate"
          :rowsPerPageOptions="UI.tableSettings.rowPerPageOptions"
          :currentPageReportTemplate="UI.tableSettings.pageReportTemplate" :loading="isFetchModGetAll" stripedRows
          v-model:filters="UI.tableSettings.filters.value" :resizableColumns="true" columnResizeMode="fit">
          <template #empty>
            <div class="w-full text-center">
              <p class="text-orange-500">No records found.</p>
            </div>
          </template>

          <template #header>
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
                  <K3InputText class="flex" v-model="(UI.tableSettings.filters.value).global.value"
                    placeholder="Search" autofocus />
                </span>
              </div>
            </div>
          </template>

          <K3Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header"
            :sortable="col.sortable" :key="col.field + '_' + index">
            <template #body="slotProps">
              <span v-if="slotProps.field === 'Name'">{{ slotProps.data.name }}</span>
              <span v-else-if="slotProps.field === 'ModelFrameWork'"> {{ slotProps.data.modelFrameWork }} </span>
              <span v-else-if="slotProps.field === 'ModelName'"> {{ slotProps.data.modelName }} </span>
              <span v-else-if="slotProps.field === 'TargetType'"> {{ slotProps.data.targetType }} </span>
              <span v-else-if="slotProps.field === 'ModelPackageID'">
                <K3SplitButton label="상세정보" :model="items().value" class="p-button-info p-button-raised mb-2" />
              </span>
            </template>
          </K3Column>
        </K3DataTable>
        <!-- Content here -->
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { FilterMatchMode } from "primevue/api";
const { UI } = useAppHelper()
const router = useRouter();
const { modelpackagesGetAll, isFetchModGetAll, fetchModGetAll } = useAllService().getModelPackagesTable();

// Page meta
definePageMeta({ layout: 'default', title: 'ModelPackages', public: true })

// Props

// const props = defineProps({}),
// Emits
// const emits = defineEmits(['eventname']),
// Properties
// Compputed
const onModelDetail = ref();

UI.tableSettings.initFilters({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.EQUALS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
})

const columns = ref([
  { field: 'Name', header: 'Name', sortable: true },
  { field: 'ModelFrameWork', header: 'ModelFrameWork', sortable: true },
  { field: 'ModelName', header: 'ModelName', sortable: true },
  { field: 'TargetType', header: 'TargetType', sortable: true },
  { field: 'ModelPackageID', header: '' },
]);
const selectedColumns = ref(columns.value);

const items = () => ref([
  { label: 'Test', icon: 'pi pi-refresh', },
  { label: '편집', icon: 'pi pi-times-circle', },
  { label: 'Deploy', icon: 'pi pi-trash', },
  { label: 'Archived', icon: 'pi pi-trash', }
]);
// Watcher
// Methods

/**
 * Move page
 * @param modelPackagesName Specific model-package name
 */
const modelPackagesDetailPage = (modelPackagesName) => {
  router.push({ path: '/modelPackages/' + modelPackagesName })
};

onMounted(() => {
  fetchModGetAll();
})

const onToggle = (value) => {
  selectedColumns.value = columns.value.filter((col) => value.includes(col));
}

const onRowUnselect = (event) => {
  // TODO: Row unselected
};


// Events
// Logics (like api call, etc)
</script>

<style>
</style>