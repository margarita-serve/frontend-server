<template>
  <div class="flex flex-column text-2xl p-5 border-round-xl" style="background-color: #F2F2F8;">
    <K3DeploymentsDateSetting :dataDriftEmitsFun="dataDriftEmitsFun" ref="sendFromChild">
      <template v-slot:header>
        <h3 class="mb-5">데이터 드리프트</h3>
      </template>
      <template v-slot:graph>
        <div class="flex flex-row mb-5">
          <div class="flex flex-column bg-white border-1 hover:border-blue-500 mr-5">
            <div class="flex m-2" style="width: 45rem; height: 50rem;">
              <iframe v-if="sendFromChild?.exposeValue?.graphSkeleton === false" id="framesDrift" src="" frameborder="0"
                width="100%" height="100%" scrolling="auto" />
              <K3Skeleton v-else width="100%" height="100%" />
            </div>
          </div>

          <div class="flex flex-column bg-white border-1 hover:border-blue-500">
            <div class="flex flex-row">

            </div>
            <div class="flex m-2" style="width: 45rem; height: 50rem;">
              <iframe v-if="sendFromChild?.exposeValue?.graphSkeleton === false" id="framesDetail" src="" frameborder="0"
                width="100%" height="100%" scrolling="auto" />
              <K3Skeleton v-else width="100%" height="100%" />
            </div>
          </div>
        </div>
        <div class="flex flex-row">
          <div class="flex flex-column bg-white border-1 hover:border-blue-500" style="width: 95rem; height: ;">
            <div class="flex m-2">
              <iframe v-if="sendFromChild?.exposeValue?.graphSkeleton === false" id="framesPredict" src="" frameborder="0"
                width="100%" height="450px" scrolling="auto" />
              <K3Skeleton v-else width="100%" height="15vh" />
            </div>
          </div>
        </div>
      </template>
    </K3DeploymentsDateSetting>
  </div>
</template>

<script setup lang="ts">
const dataDriftEmitsFun = {
  TabName: "data-drift",

  Details: async (deployID: string, selectmodel: string, graphStartTime: string, graphEndTime: string) => {
    const urlObject = await useAllService().graphCollet.getGraphDetail(deployID, selectmodel, graphStartTime, graphEndTime);
    document.getElementById('framesDetail').setAttribute("src", urlObject);
  },

  Drift: async (deployID: string, selectmodel: string, graphStartTime: string, graphEndTime: string) => {
    const graphDrift = await useAllService().graphCollet.getGraphDrift(deployID, selectmodel, graphStartTime, graphEndTime);
    document.getElementById('framesDrift').setAttribute("src", graphDrift);
  },

  Predict: async (deployID: string, selectmodel: string, graphStartTime: string, graphEndTime: string) => {
    const graphPredictOverTime = await useAllService().graphCollet.getGraphPredictOverTime(deployID, selectmodel, graphStartTime, graphEndTime);
    document.getElementById('framesPredict').setAttribute("src", graphPredictOverTime);
  },
}
const sendFromChild = ref();
</script>



<style>
</style>