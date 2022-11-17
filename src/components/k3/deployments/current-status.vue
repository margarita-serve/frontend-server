<template>
  <div class="card">
    <div class="formgroup-inline">
      <div class="field flex-2 flex align-items-center justify-content-center">
        <template v-for="(col, index) in statusModel" :key="index">
          <label for="firstname4" class="text-3xl" v-if="index < 1"> Service </label>
          <img :src="col.src" alt="statusImg" v-if="isStatusCodeDeIDGet === 200" v-show="deploymentsGetID?.serviceHealthStatus === col.value" width="25" height="25" v-tooltip.right="{value: col.tooltip, class: 'custom-errormsg'}" />
          <img src="/images/orca.png" alt="statusImg" v-else v-show="index < 1" width="25" height="25" v-tooltip.right="{value: col.tooltip, class: 'custom-errormsg'}" />
        </template>
      </div>

      <div class="field flex-2 flex align-items-center justify-content-center5 mr-3 ml-3">
        <template v-for="(col, index) in statusModel" :key="index">
          <label for="lastname4" class="text-3xl" v-if="index < 1">Drift</label>
          <img :src="col.src" alt="statusImg" v-if="isStatusCodeDeIDGet === 200" v-show="deploymentsGetID?.driftStatus === col.value" width="25" height="25" v-tooltip.right="{value: col.tooltip, class: 'custom-errormsg'}">
          <img src="/images/orca.png" alt="statusImg" v-else v-show="index < 1" width="25" height="25" v-tooltip.right="{value: col.tooltip, class: 'custom-errormsg'}" />
        </template>
      </div>

      <div class="field flex-2 flex align-items-center justify-content-center">
        <template v-for="(col, index) in statusModel" :key="index">
          <label for="lastname4" class="text-3xl" v-if="index < 1">Accuracy</label>
          <img :src="col.src" alt="statusImg" v-if="isStatusCodeDeIDGet === 200" v-show="deploymentsGetID?.accuracyStatus === col.value" width="25" height="25" v-tooltip.right="{value: col.tooltip, class: 'custom-errormsg'}">
          <img src="/images/orca.png" alt="statusImg" v-else v-show="index < 1" width="25" height="25" v-tooltip.right="{value: col.tooltip, class: 'custom-errormsg'}" />
        </template>
      </div>

      <div class="field flex-1 flex align-items-center justify-content-end">
        <K3Button label="Go To Deploymet" class="p-button-outlined" @click="Routing.moveTo('/deployments')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import
const route = useRoute();
const deployID = route.query?.DEID;
const ModelPackageID = route.query?.MPID;
const { Routing } = useAppHelper();
const  { deploymentsGetID, isfetchDeIDGet, isStatusCodeDeIDGet, isErrorMsgDeIDGet, fetchDeIDGet } = useAllService().getDeploymentsID(String(deployID));

const statusModel = ref([
  {value: 'servererror',  src: '/images/orca.png',    tooltip: "Status is server error",  severity: undefined},
  {value: 'pass',         src: '/images/pass.png',    tooltip: "Status is good",          severity: "success"},
  {value: 'failing',      src: '/images/failing.png', tooltip: "Status is failing",       severity: "error"},
  {value: 'atrisk',       src: '/images/warning.jpg', tooltip: "Status is atrisk",        severity: "warn"},
  {value: 'unknown',      src: '/images/unknown.png', tooltip: "Status is unknown",       severity: "info"},
])

// Mount
onMounted(() => { fetchDeIDGet(); });

// setInterval(function () { fetchDeIDGet(); }, 30000)

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