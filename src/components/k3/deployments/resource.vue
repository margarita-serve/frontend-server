<template>
  <div class="flex flex-column text-2xl p-5" style="background-color: #F2F2F8;">
    <K3DeploymentsDateSetting :dataDriftEmitsFun="dataDriftEmitsFun" ref="sendFromChild">
      <template v-slot:header>
      </template>

      <template v-slot:graph>
        <div class="flex flex-column">
          <div class="flex flex-column">
            <div class="flex bg-white border-1 hover:border-blue-500 m-2" style="width: 110rem; height: 35rem;">
              <iframe v-if="sendFromChild?.exposeValue?.graphSkeleton === false" id="cpuResource" src="" frameborder="0" width="100%" height="100%" scrolling="auto" />
              <K3Skeleton v-else width="100%" height="100%" />
            </div>
          </div>

          <div class="flex flex-column">
            <div class="flex bg-white border-1 hover:border-blue-500 m-2" style="width: 110rem; height: 35rem;">
              <iframe v-if="sendFromChild?.exposeValue?.graphSkeleton === false" id="memoryResource" src="" frameborder="0" width="100%" height="100%" scrolling="auto" />
              <K3Skeleton v-else width="100%" height="100%" />
            </div>
          </div>
        </div>
      </template>
    </K3DeploymentsDateSetting>
  </div>
</template>

<script lang="ts" setup>
const dataDriftEmitsFun = ref({
  TabName: 'resource',

  ResourceCPU: async (deployID: string, requestCPU: number) => {
    const urlObject = await useAllService().graphCollet.getGraphCPU(String(deployID), requestCPU);
    useAllService().graphCollet.iframeDoc(urlObject, "cpuResource");
    // document.getElementById('cpuResource').setAttribute("src", urlObject);
  },

  ResourceMemory: async (deployID: string, requestMEM: number) => {
    const urlObject = await useAllService().graphCollet.getGraphMemory(String(deployID), requestMEM);
    useAllService().graphCollet.iframeDoc(urlObject, "memoryResource");
    // document.getElementById('memoryResource').setAttribute("src", urlObject);
  },
});
const sendFromChild = ref();
</script>

<style>

</style>