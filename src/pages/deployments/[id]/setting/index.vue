<template>
  <div class="page-container">
    <div class="page-wrapper">
      <!-- <section class="page-header mb-5">
        <K3PageTitle />
      </section> -->
      <section class="page-content" style="width: fit-content;">
        <!-- Content here -->
        <K3DeploymentsCurrentStatus />
        <K3TabView @tab-click="tabRouting($event)" :activeIndex=6>
          <K3TabPanel>
            <template #header>
              <span>Overview</span>
            </template>
          </K3TabPanel>

          <K3TabPanel>
            <template #header>
              <span>서비스 상태</span>
            </template>
          </K3TabPanel>

          <K3TabPanel>
            <template #header>
              <span>리소스</span>
            </template>
          </K3TabPanel>

          <K3TabPanel>
            <template #header>
              <span>데이터 드리프트</span>
            </template>
          </K3TabPanel>

          <K3TabPanel>
            <template #header>
              <span>정확도</span>
            </template>
          </K3TabPanel>

          <K3TabPanel>
            <template #header>
              <span>웹 훅</span>
            </template>
          </K3TabPanel>

          <K3TabPanel>
            <template #header>
              <span>설정</span>
            </template>
            <K3DeploymentsSetting />
          </K3TabPanel>
        </K3TabView>
        <!-- Content here -->
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', title: 'setting', public: true });
const route = useRoute();
const router = useRouter();
const deployID = route.query.DEID;
const ModelID = route.query.MPID;
const deployName = route.fullPath.split('/')[2].split('?')[0];
const routingMap = ['over-view', 'service-status', 'resource', 'data-drift', 'accuracy-tab', 'web-hook', 'setting'];

const tabRouting = (event: Event) => { router.push({ path: '/deployments/' + deployName + '/' + routingMap[event.index], query: { DEID: deployID, MPID: ModelID } }) };

</script>

<style>
</style>