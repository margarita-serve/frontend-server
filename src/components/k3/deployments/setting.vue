<template>
  <h4>설정</h4>
  <div class="page-container">
    <div class="page-wrapper">
      <section class="page-content">
        <!-- Content here -->
        <K3TabView>
          <K3TabPanel>
            <template #header>
              <span>Data</span>
            </template>
            <K3DeploymentsSettingData />
          </K3TabPanel>

          <K3TabPanel>
            <template #header>
              <span>Monitoring</span>
            </template>
            <K3DeploymentsSettingMoniter />
          </K3TabPanel>
        </K3TabView>
        <!-- Content here -->
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style>

</style>