<template>
  <div class="flex flex-column text-2xl p-5" style="background-color: #F2F2F8;">
    <K3DeploymentsDateSetting :dataDriftEmitsFun="dataDriftEmitsFun" ref="sendFromChild">
      <template v-slot:header>
        <h3 class="mb-5">서비스 상태</h3>
      </template>

      <template v-slot:graph>
        <div class="flex flex-column">
          <div class="flex bg-white border-1 hover:border-blue-500" style="width: 110rem; height: 35rem;">
            <iframe v-if="sendFromChild?.exposeValue?.graphSkeleton === false" id="serviceGraph" src="" frameborder="0" width="100%" height="100%"
              scrolling="auto" />
            <K3Skeleton v-else width="100%" height="100%" />
          </div>
        </div>
      </template>
    </K3DeploymentsDateSetting>
  </div>
</template>

<script setup lang="ts">
const sendFromChild = ref();
const dataDriftEmitsFun = {
  TabName: "service-status",

  GraphService: async (deployID: string, selectmodel: string, graphStartTime: string, graphEndTime: string) => {
    const graphService = await useAllService().graphCollet.getGraphService(deployID, selectmodel, graphStartTime, graphEndTime);
    document.getElementById('serviceGraph').setAttribute("src", graphService);
  },
}
</script>

<style>

</style>